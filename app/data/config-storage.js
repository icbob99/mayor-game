async function loadGameConfig() {
    let storage;
    try { storage = typeof LocalEnvironment !== 'undefined' ? LocalEnvironment.storage : localStorage; }
    catch { /* Storage is optional. */ }
    let config;
    try {
        config = await fetchGameConfig();
    } catch (error) {
        if (error instanceof SyntaxError) throw error;
        // A replaced Docker generation must reload instead of starting from stale defaults.
        if (typeof LocalEnvironment !== 'undefined' && !LocalEnvironment.isCurrent()) throw error;
        try {
            const cached = JSON.parse(storage?.getItem('mayorGameConfig') || 'null');
            return GameConfig.validate(cached);
        } catch { return GameConfig.fallback; }
    }
    // A malformed server response is a configuration error, not an offline condition.
    GameConfig.validate(config);
    try { storage?.setItem('mayorGameConfig', JSON.stringify(config)); }
    catch { /* A full or blocked cache must not override valid server settings. */ }
    return config;
}
