// Configure this public-content database with a read-only database token.
// Browser code and its token are visible to every visitor.
const TURSO_CONFIG = {
    url: 'http://localhost:8080',
    authToken: 'sandbox'
};

async function loadGameData() {
    if (!TURSO_CONFIG.url || !TURSO_CONFIG.authToken) {
        throw new Error('Укажите URL и read-only токен Turso в app/db.js');
    }

    const url = new URL(TURSO_CONFIG.url.replace(/^(libsql|turso):\/\//, 'https://'));
    if (url.protocol !== 'https:' && !(url.hostname === 'localhost' && url.protocol === 'http:')) {
        throw new Error('Turso URL must use HTTPS outside localhost');
    }
    const response = await fetch(`${url.href.replace(/\/$/, '')}/v2/pipeline`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${TURSO_CONFIG.authToken}`,
            'Content-Type': 'application/json'
        },
        signal: AbortSignal.timeout(15000),
        body: JSON.stringify({
            requests: [
                { type: 'execute', stmt: { sql: 'SELECT id, avatar, choices, chains FROM events ORDER BY rowid', want_rows: true } },
                { type: 'execute', stmt: { sql: 'SELECT lang, ui, events FROM locales ORDER BY rowid', want_rows: true } },
                { type: 'close' }
            ]
        })
    });
    if (!response.ok) throw new Error(`Turso HTTP ${response.status}`);

    const { results } = await response.json();
    if (!Array.isArray(results) || results.length !== 3) {
        throw new Error('Invalid Turso response');
    }
    for (const result of results) {
        if (result.type !== 'ok') {
            throw new Error(result.error?.message || 'Turso query failed');
        }
    }
    const [eventRows, localeRows] = results.slice(0, 2).map(({ response }) => {
        const { cols, rows } = response.result;
        return rows.map(row => Object.fromEntries(
            cols.map((col, index) => [col.name, row[index].value ?? null])
        ));
    });

    // chains stores { chains?, isFollowUp? }; ui stores { ui, alerts }.
    // Unpack these envelopes so the existing game sees its original objects.
    const events = eventRows.map(row => ({
        id: row.id,
        avatar: row.avatar,
        choices: JSON.parse(row.choices),
        ...JSON.parse(row.chains)
    }));
    const locales = Object.fromEntries(localeRows.map(row => [
        row.lang, { ...JSON.parse(row.ui), events: JSON.parse(row.events) }
    ]));

    if (!events.length || !events.some(event => !event.isFollowUp)) {
        throw new Error('Turso contains no playable events');
    }
    for (const lang of ['ru', 'en', 'he']) {
        const texts = locales[lang];
        if (!texts?.ui || !texts.alerts || !texts.events || events.some(event =>
            !Array.isArray(event.choices) || !event.choices.length ||
            texts.events[event.id]?.choices?.length !== event.choices.length
        )) {
            throw new Error(`Incomplete game data for ${lang}`);
        }
    }
    return { events, locales };
}
