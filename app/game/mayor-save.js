(function (root) {
    root.createMayorSave = function (store, token, isCurrent, onAuthExpired) {
        const achievementIds = ACHIEVEMENTS_DEF.map(item => item.id);
        const counts = values => Object.fromEntries(achievementIds.map(id => [id, values?.[id] || 0]));
        let record;
        try { record = JSON.parse(store.getItem('cloudSave') || 'null'); } catch { /* Keep playing if storage is unavailable. */ }
        if (!record?.stats || !Array.isArray(record.completedGames) || !Number.isSafeInteger(record.writeTimestamp) ||
            !Number.isSafeInteger(record.ackTimestamp)) record = null;
        record ||= { state: null, stats: { gamesPlayed: 0, maxMoney: 0, achievements: counts() },
            versionGuid: null, ackTimestamp: 0, writeTimestamp: 0, completedGames: [], pending: null, activation: null };
        let running = null, ready = false, blocked = record.blocked || null;
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
        function completion(state) {
            return { gameId: state.gameId, finishedAt: state.finishedAt, days: state.day,
                money: state.money, endReason: state.endReason, achievements: state.achievements };
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
                if (record.state.isFinished) record.completedGames.push(completion(record.state));
                persist();
                try {
                    if (store.getItem('cloudSave')) {
                        store.removeItem('mayorGameState');
                        store.removeItem('mayorGuestStats');
                    }
                } catch { /* Keep the legacy copy if storage is unavailable. */ }
            }
        }
        const dirty = () => record.writeTimestamp > record.ackTimestamp;
        async function request(path, options = {}) {
            if (!isCurrent() || !token()) throw new Error('inactive_account');
            const data = await root.requestGameApi(path, { ...options, token: token() });
            if (!isCurrent()) throw new Error('inactive_account');
            return data;
        }
        async function sendPending() {
            const sent = record.pending;
            const result = await request('/api/game/save', { method: 'PUT', body: sent });
            if (result.status === 'stale') {
                // Never turn a server rejection into an acknowledgement of local progress.
                blocked = 'save_conflict';
                record.conflict = await request('/api/game/save');
                persist();
                return;
            }
            if (result.status !== 'saved' || result.operationId !== sent.operationId ||
                result.writeTimestamp !== sent.writeTimestamp || typeof result.versionGuid !== 'string') throw new Error('invalid_save_response');
            if (result.writeTimestamp >= record.ackTimestamp) {
                record.ackTimestamp = result.writeTimestamp;
                record.versionGuid = result.versionGuid;
            }
            const accepted = new Set(sent.completedGames.map(game => game.gameId));
            record.completedGames = record.completedGames.filter(game => !accepted.has(game.gameId));
            record.pending = null;
            persist();
        }
        async function activate() {
            const selection = record.activation.source;
            const result = await request('/api/game/session', { method: 'PUT', body: record.activation });
            if (typeof result.gameSessionId !== 'string') throw new Error('invalid_session_response');
            const cloud = result.save;
            const changedDuringActivation = record.activationTimestamp == null ? dirty() : record.writeTimestamp !== record.activationTimestamp;
            record.gameSessionId = result.gameSessionId;
            record.activation = null;
            record.pending = null;
            ready = true;
            if (selection === 'cloud' && changedDuringActivation && (cloud?.versionGuid || null) !== record.versionGuid) {
                record.conflict = cloud;
                blocked = 'save_conflict';
                persist();
                return;
            }
            record.versionGuid = cloud?.versionGuid || null;
            record.ackTimestamp = cloud?.writeTimestamp || 0;
            if (selection === 'cloud' && !changedDuringActivation) {
                record.state = cloud?.state || null;
                record.stats = cloud?.stats || { gamesPlayed: 0, maxMoney: 0, achievements: counts() };
                record.writeTimestamp = record.ackTimestamp;
                record.completedGames = [];
            } else if (record.state) {
                record.writeTimestamp = Math.max(Date.now(), record.writeTimestamp, record.ackTimestamp + 1);
            }
            record.conflict = null;
            blocked = null;
            ready = true;
            persist();
        }
        async function connect(loadCloud, reauthenticated) {
            // Recover a lost success reply before comparing GUIDs or replacing the writer session.
            if (record.pending) {
                try { await sendPending(); }
                catch (error) {
                    if (error.status !== 403 || (record.gameSessionId && !reauthenticated)) throw error;
                    // An unaccepted request can be rebuilt only after a successful activation.
                }
                if (blocked) return;
            }
            if (record.activation) {
                try { await activate(); return; }
                catch (error) {
                    if (error.status !== 403 || !reauthenticated) throw error;
                    record.activation = null;
                }
            }
            if (record.gameSessionId && !reauthenticated) {
                await request('/api/game/session?gameSessionId=' + encodeURIComponent(record.gameSessionId));
            }
            const cloud = await request('/api/game/save');
            if ((dirty() || !loadCloud) && (cloud?.versionGuid || null) !== record.versionGuid) {
                record.conflict = cloud;
                blocked = 'save_conflict';
                persist();
                return;
            }
            if (record.gameSessionId && !reauthenticated && (cloud?.versionGuid || null) === record.versionGuid) {
                ready = true;
                return;
            }
            record.activation = { operationId: crypto.randomUUID(), expectedVersionGuid: cloud?.versionGuid || null,
                previousGameSessionId: record.gameSessionId || null, confirmTransfer: false, source: dirty() ? 'local' : 'cloud' };
            record.activationTimestamp = record.writeTimestamp;
            persist();
            await activate();
            record.pending = null;
            persist();
        }
        async function sync(resume, reauthenticated = false, selection = null) {
            if (!isCurrent() || !token() || (blocked && !reauthenticated && !selection)) return;
            if (resume) { blocked = null; ready = false; }
            try {
                if (selection) {
                    if (!record.activation?.confirmTransfer) {
                        record.activation = { operationId: crypto.randomUUID(), expectedVersionGuid: record.conflict?.versionGuid || null,
                            previousGameSessionId: record.gameSessionId || null, confirmTransfer: true, source: selection };
                        record.activationTimestamp = record.writeTimestamp;
                    }
                    persist();
                    await activate();
                } else if (!resume && !dirty() && !record.pending && !record.activation) {
                    if (record.gameSessionId) await request('/api/game/session?gameSessionId=' + encodeURIComponent(record.gameSessionId));
                    return;
                } else if (!ready) await connect(resume, reauthenticated);
                while (ready && !blocked && (record.pending || dirty()) && isCurrent() && token()) {
                    if (!record.pending) {
                        record.pending = JSON.parse(JSON.stringify({ gameSessionId: record.gameSessionId,
                            operationId: crypto.randomUUID(), writeTimestamp: record.writeTimestamp,
                            state: record.state, stats: record.stats, completedGames: record.completedGames }));
                        persist();
                    }
                    await sendPending();
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
                // A network failure leaves the exact operation available for the next attempt.
            }
        }
        function run(resume, reauthenticated, selection) {
            if (!running) running = sync(resume, reauthenticated, selection).finally(() => { running = null; });
            return running;
        }
        return {
            resume: reauthenticated => run(true, reauthenticated), flush: () => run(false), status: () => blocked,
            details: () => ({ local: record.state, cloud: record.conflict, source: dirty() ? 'local' : 'cloud',
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
                if (JSON.stringify(snapshot) === JSON.stringify(record.state)) { persist(); return; }
                if (snapshot.isFinished && !(record.state?.gameId === snapshot.gameId && record.state.isFinished)) {
                    record.stats.gamesPlayed++;
                    for (const id of achievementIds) record.stats.achievements[id] += snapshot.achievements[id];
                    record.completedGames.push(completion(snapshot));
                }
                record.stats.maxMoney = Math.max(record.stats.maxMoney, snapshot.money);
                record.state = snapshot;
                record.writeTimestamp = Math.max(Date.now(), record.writeTimestamp + 1, record.ackTimestamp + 1);
                persist();
            }
        };
    };
})(window);
