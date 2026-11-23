(function (root) {
    // Application settings: disabling daily preserves its saved game and statistics.
    const settings = { dailyEnabled: false };
    const names = ['arcade', 'daily', 'blitz'];
    const copy = value => JSON.parse(JSON.stringify(value));
    const available = mode => names.includes(mode) && (mode !== 'daily' || settings.dailyEnabled);
    function maxTurns(s) {
        if (s.mode === 'daily') return Infinity;
        return s.mode === 'blitz' ? 25 : ({ easy: 60, normal: 50, hard: 40, insane: 30 }[s.difficulty] || 50);
    }
    // Called after resolving a decision and its drift, before advancing to the next day.
    function retirement(s) {
        if (s.day < maxTurns(s) || s.health <= 0 || s.wife <= 0 || s.rating <= 0 || s.threat >= 70) return null;
        if (s.difficulty === 'insane' && (s.rating >= 70 || s.wife >= 70)) return null;
        return 'honorable_retirement';
    }
    function mayorScore(s) { return Math.round(s.money * (s.endReason === 'honorable_retirement' ? 1.5 : 1)); }
    function blitzDuration(day) {
        return [10000, 7000, 5000, 3000, 2000][Math.min(4, Math.floor((day - 1) / 10))];
    }
    function dateKey(now = new Date()) {
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    }
    function remaining(s, now = new Date()) {
        s.daily ||= { date: dateKey(now), used: 0 };
        if (s.daily.date !== dateKey(now)) { s.daily.date = dateKey(now); s.daily.used = 0; }
        return Math.max(0, 5 - s.daily.used);
    }
    function canAct(s, now) { return available(s.mode || 'arcade') && (s.mode !== 'daily' || remaining(s, now) > 0); }
    function useTurn(s, now) {
        if (!canAct(s, now)) return false;
        if (s.mode === 'daily') s.daily.used++;
        return true;
    }
    function checkpoint(s) {
        if (s.mode !== 'daily') return;
        s.daily ||= { date: dateKey(), used: 0 };
        const { daily, lang, audioMuted, currentEventIndex, ...game } = s;
        daily.game = copy(game);
    }
    function resumeDaily(s) {
        if (!s.daily?.game) return null;
        const game = copy(s.daily.game);
        return { ...game, daily: copy(s.daily), mode: 'daily', gameOverRecorded: Boolean(game.gameOverRecorded),
            endReason: game.endReason || null, finishedAt: game.finishedAt || null };
    }
    function createClock(onExpired, now = () => performance.now()) {
        let left = 0, started = null, active = false;
        const remaining = () => Math.max(0, left - (started === null ? 0 : now() - started));
        function tick() {
            if (!active || remaining() > 0) return false;
            active = false; left = 0; started = null;
            onExpired();
            return true;
        }
        return {
            start(duration) { left = duration; active = true; started = now(); },
            stop() { active = false; started = null; },
            pause() { if (started !== null) { left = remaining(); started = null; } },
            resume() { if (active && started === null) started = now(); },
            remaining, tick
        };
    }
    root.GameModes = { settings, names, available, maxTurns, retirement, mayorScore, blitzDuration, dateKey, remaining, canAct, useTurn, checkpoint, resumeDaily, createClock };
    if (typeof module !== 'undefined' && module.exports) module.exports = root.GameModes;
})(globalThis);
