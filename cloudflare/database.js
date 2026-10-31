export function pipeline(env, requests) {
    if (!env.TURSO_DATABASE_URL || !env.TURSO_AUTH_TOKEN) throw new Error('database_unavailable');
    const url = env.TURSO_DATABASE_URL.replace(/^libsql:\/\//, 'https://').replace(/\/$/, '');
    return fetch(`${url}/v2/pipeline`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${env.TURSO_AUTH_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ requests }),
        signal: AbortSignal.timeout(10000)
    });
}

export async function query(env, statements, transaction = false) {
    const steps = statements.map(({ sql, args = [] }) => ({ stmt: {
        sql, want_rows: true,
        args: args.map(value => value === null ? { type: 'null' } :
            { type: typeof value === 'number' ? 'integer' : 'text', value: String(value) })
    } }));
    if (transaction) {
        steps.unshift({ stmt: { sql: 'BEGIN IMMEDIATE' } });
        steps.push({ stmt: { sql: 'COMMIT' } });
        for (let i = 1; i < steps.length; i++) steps[i].condition = { type: 'ok', step: i - 1 };
        steps.push({ condition: { type: 'not', cond: { type: 'ok', step: steps.length - 1 } }, stmt: { sql: 'ROLLBACK' } });
    }
    const response = await pipeline(env, [
        { type: 'execute', stmt: { sql: 'PRAGMA foreign_keys = ON' } },
        { type: 'batch', batch: { steps } }, { type: 'close' }
    ]);
    if (!response.ok) throw new Error('database_unavailable');
    const data = await response.json();
    if (data.results?.[0]?.type !== 'ok') throw new Error('database_unavailable');
    const result = data.results?.[1];
    if (result?.type !== 'ok') throw new Error(result?.error?.code || 'database_unavailable');
    const { step_results: rows, step_errors: errors } = result.response.result;
    const error = errors.find(Boolean);
    if (error) throw Object.assign(new Error(error.message), { code: error.code });
    return (transaction ? rows.slice(1, 1 + statements.length) : rows).map(result =>
        result.rows.map(row => Object.fromEntries(result.cols.map((column, index) => {
            const cell = row[index];
            return [column.name, cell.type === 'null' ? null :
                cell.type === 'integer' || cell.type === 'float' ? Number(cell.value) : cell.value];
        }))));
}
