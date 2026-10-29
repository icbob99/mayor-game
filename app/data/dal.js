async function loadGameData() {
    const { results } = await fetchRawGameData();
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
