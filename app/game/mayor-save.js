(function (root) {
    root.createMayorSave = function (store, token, isCurrent, onAuthExpired) {
        const achievementIds = ACHIEVEMENTS_DEF.map(item => item.id);
        const counts = values => Object.fromEntries(achievementIds.map(id => [id, values?.[id] || 0]));
        const equal = (a, b) => a === b || Boolean(a && b && typeof a === 'object' && typeof b === 'object' &&
            Object.keys(a).length === Object.keys(b).length && Object.keys(a).every(key => equal(a[key], b[key])));
        let record;
        try { record = JSON.parse(store.getItem('cloudSave') || 'null'); } catch { /* Keep playing if storage is unavailable. */ }
        if (!record?.stats || !Number.isSafeInteger(record.writeTimestamp)) record = null;
        record ||= { state: null, stats: { gamesPlayed: 0, maxMoney: 0, achievements: counts() },
            versionGuid: null, writeTimestamp: 0, activation: null };
        // Preserve old local progress, but never replay the previous delivery queue.
        record.localChanged ??= record.writeTimestamp > (record.ackTimestamp || 0);
        delete record.pending;
        delete record.ackTimestamp;
        delete record.completedGames;
        let running = null, blocked = record.blocked || null;
        function persist() {
            if (!isCurrent()) return;
            record.blocked = blocked;
            try { store.setItem('cloudSave', JSON.stringify(record)); } catch { /* Network saving can still succeed. */ }
        }
        function pack(state) {
            state.gameId ||= crypto.randomUUID();
            return {
                gameId: state.gameId, day: state.day, money: state.money, health: state.health,
                wife: state.wife, threat: state.threat, rating: state.rating,
                cooldowns: Object.fromEntries(shopPerkKeys.map(id => [id, state.cooldowns?.[id] || 0])),
                achievements: counts(Object.fromEntries((state.earnedAchievementsThisGame || []).map(id => [id, 1]))),
                isFinished: Boolean(state.gameOverRecorded), endReason: state.endReason || null, finishedAt: state.finishedAt || null
            };
        }
        // Migrate P3's local account save once; guest keys belong to a different store.
        if (!record.state) {
            const legacy = root.GuestStorage.loadGameState(store);
            if (legacy) {
                if (legacy.gameOverRecorded) legacy.finishedAt ||= Date.now();
                record.state = pack(legacy);
                record.preferences = { lang: legacy.lang, audioMuted: legacy.audioMuted };
                const stats = root.GuestStorage.loadGuestStats(store);
                record.stats = { ...stats, achievements: counts(stats.achievements) };
                record.writeTimestamp = Date.now();
                record.localChanged = true;
                persist();
                try {
                    if (store.getItem('cloudSave')) {
                        store.removeItem('mayorGameState');
                        store.removeItem('mayorGuestStats');
                    }
                } catch { /* Keep the legacy copy if storage is unavailable. */ }
            }
        }

        async function request(path, options = {}) {
            if (!isCurrent() || !token()) throw new Error('inactive_account');
            const data = await root.requestGameApi(path, { ...options, token: token() });
            if (!isCurrent()) throw new Error('inactive_account');
            return data;
        }
        function sendSnapshot() {
            if (!isCurrent() || !token() || blocked || !record.gameSessionId || record.activation || !record.state) return;
            const body = JSON.parse(JSON.stringify({ gameSessionId: record.gameSessionId,
                writeTimestamp: record.writeTimestamp, state: record.state, stats: record.stats }));
            // Delivery is best effort. Replies cannot change the game or schedule another PUT.
            void request('/api/game/save', { method: 'PUT', body }).catch(() => {});
        }
        async function activate() {
            const selection = record.activation.source;
            const result = await request('/api/game/session', { method: 'PUT', body: record.activation });
            if (typeof result.gameSessionId !== 'string') throw new Error('invalid_session_response');
            const cloud = result.save;
            const changedDuringActivation = record.activationTimestamp == null ? record.localChanged : record.writeTimestamp !== record.activationTimestamp;
            record.gameSessionId = result.gameSessionId;
            record.activation = null;
            if (selection === 'cloud' && changedDuringActivation && (cloud?.versionGuid || null) !== record.versionGuid) {
                record.conflict = cloud;
                blocked = 'save_conflict';
                persist();
                return;
            }
            record.versionGuid = cloud?.versionGuid || null;
            if (selection === 'cloud' && !changedDuringActivation) {
                record.state = cloud?.state || null;
                record.stats = cloud?.stats || { gamesPlayed: 0, maxMoney: 0, achievements: counts() };
                record.writeTimestamp = cloud?.writeTimestamp || 0;
                record.localChanged = false;
            } else if (record.state) {
                record.writeTimestamp = Math.max(Date.now(), record.writeTimestamp + 1, (cloud?.writeTimestamp || 0) + 1);
                record.localChanged = true;
            }
            record.recoveryResolved = true;
            record.conflict = null;
            blocked = null;
            persist();
        }
        async function connect(reauthenticated, currentSessionId) {
            if (record.activation) {
                try { await activate(); return true; }
                catch (error) {
                    if (error.status !== 403 || !reauthenticated) throw error;
                    record.activation = null;
                }
            }
            let ownsSession = Boolean(record.gameSessionId && record.gameSessionId === currentSessionId);
            if (record.gameSessionId && !reauthenticated) {
                await request('/api/game/session?gameSessionId=' + encodeURIComponent(record.gameSessionId));
                ownsSession = true;
            }
            const cloud = await request('/api/game/save');
            const sameSnapshot = cloud && equal(cloud.state, record.state) && equal(cloud.stats, record.stats);
            if (sameSnapshot) record.localChanged = false;
            if (!ownsSession && record.localChanged && !sameSnapshot && (cloud?.versionGuid || null) !== record.versionGuid) {
                record.conflict = cloud;
                blocked = 'save_conflict';
                persist();
                return false;
            }
            if (ownsSession && !reauthenticated) {
                // A GET verifies ownership; it is not a delivery acknowledgement or a retry trigger.
                return false;
            }
            record.activation = { operationId: crypto.randomUUID(), expectedVersionGuid: cloud?.versionGuid || null,
                previousGameSessionId: record.gameSessionId || null, confirmTransfer: false,
                source: record.localChanged && !sameSnapshot ? 'local' : 'cloud' };
            record.activationTimestamp = record.writeTimestamp;
            persist();
            await activate();
            return true;
        }
        async function sync(resume, reauthenticated = false, selection = null, currentSessionId = null) {
            if (!isCurrent() || !token() || (blocked && !reauthenticated && !selection)) return;
            if (resume) blocked = null;
            try {
                if (selection) {
                    if (!record.activation?.confirmTransfer) {
                        record.activation = { operationId: crypto.randomUUID(), expectedVersionGuid: record.conflict?.versionGuid || null,
                            previousGameSessionId: record.gameSessionId || null, confirmTransfer: true, source: selection };
                        record.activationTimestamp = record.writeTimestamp;
                    }
                    persist();
                    await activate();
                    if (selection === 'local' || record.localChanged) sendSnapshot();
                } else if (resume) {
                    const activated = await connect(reauthenticated, currentSessionId);
                    if (activated && record.localChanged) sendSnapshot();
                } else if (record.activation) {
                    // Recover the requested writer activation, without sending a game snapshot.
                    await activate();
                } else if (record.gameSessionId) {
                    await request('/api/game/session?gameSessionId=' + encodeURIComponent(record.gameSessionId));
                }
            } catch (error) {
                if (!isCurrent()) return;
                if (error.status === 401) onAuthExpired();
                if ([400, 403, 409].includes(error.status)) {
                    blocked = error.code;
                    if (error.code === 'transfer_required' && record.gameSessionId && !reauthenticated && !selection) blocked = 'session_replaced';
                    if (error.data?.save !== undefined) record.conflict = error.data.save;
                    // A definitive rejection can be retried with a newly reviewed version; a lost reply cannot.
                    record.activation = null;
                    persist();
                }
                // Only activation keeps its operation for recovery; game snapshots are never queued.
            }
        }
        function run(resume, reauthenticated, selection, currentSessionId) {
            if (!running) running = sync(resume, reauthenticated, selection, currentSessionId).finally(() => { running = null; });
            return running;
        }
        return {
            resume: (reauthenticated, currentSessionId) => run(true, reauthenticated, null, currentSessionId),
            checkSession: () => run(false), status: () => blocked,
            details: () => ({ local: record.state, cloud: record.conflict, source: record.localChanged ? 'local' : 'cloud',
                selection: record.activation?.confirmTransfer ? record.activation.source : null }),
            async resolve(source) {
                if (!['local', 'cloud'].includes(source)) return;
                if (running) await running;
                await run(false, true, source);
            },
            stats: () => record.stats,
            load() {
                if (!record.state) return null;
                const s = record.state;
                const earned = achievementIds.filter(id => s.achievements[id]);
                return { ...s, ...record.preferences, currentEventIndex: -1, eventQueue: [],
                    cooldowns: { ...s.cooldowns },
                    gameOverRecorded: s.isFinished, earnedAchievementsThisGame: earned, unlockedAchievements: [...earned] };
            },
            save(state) {
                if (!isCurrent()) return;
                if (blocked) return;
                const snapshot = pack(state);
                record.preferences = { lang: state.lang, audioMuted: state.audioMuted };
                if (equal(snapshot, record.state)) { persist(); return; }
                if (snapshot.isFinished && !(record.state?.gameId === snapshot.gameId && record.state.isFinished)) {
                    record.stats.gamesPlayed++;
                    for (const id of achievementIds) record.stats.achievements[id] += snapshot.achievements[id];
                }
                record.stats.maxMoney = Math.max(record.stats.maxMoney, snapshot.money);
                record.state = snapshot;
                record.writeTimestamp = Math.max(Date.now(), record.writeTimestamp + 1);
                record.localChanged = true;
                persist();
                sendSnapshot();
            }
        };
    };
})(window);
