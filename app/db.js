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
            { type: 'execute', stmt: { sql: 'SELECT id, avatar, is_follow_up, repeat_policy, max_occurrences FROM game_events ORDER BY rowid', want_rows: true } },
            { type: 'execute', stmt: { sql: 'SELECT event_id, choice_index, money, wife, health, threat, rating, next_event_id, delay_days FROM game_choices ORDER BY event_id, choice_index', want_rows: true } },
            { type: 'execute', stmt: { sql: 'SELECT lang, ui, alerts FROM game_locale_ui ORDER BY rowid', want_rows: true } },
            { type: 'execute', stmt: { sql: 'SELECT event_id, lang, title, description FROM game_event_locales ORDER BY event_id, lang', want_rows: true } },
            { type: 'execute', stmt: { sql: 'SELECT event_id, choice_index, lang, text FROM game_choice_locales ORDER BY event_id, choice_index, lang', want_rows: true } },
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
    if (!Array.isArray(results) || results.length !== 6) {
        throw new Error('Invalid Turso response');
    }
    for (const result of results) {
        if (result.type !== 'ok') {
            throw new Error(result.error?.message || 'Turso query failed');
        }
    }
    const rowsFrom = ({ response }) => {
        const { cols, rows } = response.result;
        const decode = cell => {
            if (!cell || cell.type === 'null') return null;
            if (cell.type === 'integer') return Number(cell.value);
            if (cell.type === 'float') return Number(cell.value);
            return cell.value;
        };
        return rows.map(row => Object.fromEntries(
            cols.map((col, index) => [col.name, decode(row[index])])
        ));
    };
    const [eventRows, choiceRows, uiRows, eventLocaleRows, choiceLocaleRows] = results.slice(0, 5).map(rowsFrom);

    const events = eventRows.map(row => ({
        id: row.id,
        avatar: row.avatar,
        isFollowUp: Boolean(row.is_follow_up),
        repeatPolicy: row.repeat_policy,
        maxOccurrences: row.max_occurrences,
        choices: choiceRows
            .filter(choice => choice.event_id === row.id)
            .map(choice => ({
                money: choice.money,
                wife: choice.wife,
                health: choice.health,
                threat: choice.threat,
                rating: choice.rating,
                ...(choice.next_event_id ? {
                    nextEvent: { id: choice.next_event_id, delay: choice.delay_days }
                } : {})
            }))
    }));
    const locales = Object.fromEntries(uiRows.map(row => {
        const eventTexts = Object.fromEntries(
            eventLocaleRows
                .filter(event => event.lang === row.lang)
                .map(event => [event.event_id, {
                    title: event.title,
                    desc: event.description,
                    choices: choiceLocaleRows
                        .filter(choice => choice.lang === row.lang && choice.event_id === event.event_id)
                        .sort((a, b) => a.choice_index - b.choice_index)
                        .map(choice => choice.text)
                }])
        );
        return [row.lang, { ui: JSON.parse(row.ui), alerts: JSON.parse(row.alerts), events: eventTexts }];
    }));

    if (!events.length || !events.some(event => !event.isFollowUp)) {
        throw new Error('Turso contains no playable events');
    }
    for (const lang of ['ru', 'en', 'uk', 'he']) {
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
