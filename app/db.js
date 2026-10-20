// Local requests use the sandbox emulator; production requests use the Worker.
const TURSO_CONFIG = {
    localApiUrl: 'http://localhost:8080/v2/pipeline',
    workerApiUrl: 'https://mayor-game-api.icbob99.workers.dev/api/game-data',
    // Used only by tests that replace the request endpoint.
    url: '',
    authToken: ''
};

async function loadGameData() {
    const hostname = typeof location === 'undefined' ? 'localhost' : location.hostname;
    const isTestRequest = Boolean(TURSO_CONFIG.url);
    const isLocal = hostname === 'localhost' || hostname === '127.0.0.1' || isTestRequest;
    const testUrl = TURSO_CONFIG.url.replace(/^(libsql|turso):\/\//, 'https://').replace(/\/$/, '');
    const requestBody = {
            requests: [
                { type: 'execute', stmt: { sql: 'SELECT id, avatar, choices, chains FROM events ORDER BY rowid', want_rows: true } },
                { type: 'execute', stmt: { sql: 'SELECT lang, ui, events FROM locales ORDER BY rowid', want_rows: true } },
                { type: 'close' }
            ]
        };
    const response = await fetch(
        isTestRequest ? `${testUrl}/v2/pipeline` : isLocal ? TURSO_CONFIG.localApiUrl : TURSO_CONFIG.workerApiUrl,
        {
            method: isLocal ? 'POST' : 'GET',
            headers: isLocal ? {
                'Content-Type': 'application/json',
                ...(TURSO_CONFIG.authToken ? { Authorization: `Bearer ${TURSO_CONFIG.authToken}` } : {})
            } : {},
            signal: AbortSignal.timeout(15000),
            ...(isLocal ? { body: JSON.stringify(requestBody) } : {})
        }
    );
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
