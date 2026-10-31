const assert = require('node:assert/strict');
const { test } = require('node:test');
const { readFileSync } = require('node:fs');
const { webcrypto } = require('node:crypto');
const vm = require('node:vm');

function environment() {
    const values = new Map(), held = new Set();
    const storage = map => ({ getItem: key => map.get(key) ?? null, setItem: (key, value) => map.set(key, value),
        removeItem: key => map.delete(key), keys: () => [...map.keys()] });
    function tab(session = new Map()) {
        const root = { crypto: webcrypto, sessionStorage: storage(session), navigator: { locks: {
            request(name, options, callback) {
                if (typeof options === 'function') callback = options;
                if (held.has(name)) return Promise.resolve(callback(null));
                held.add(name);
                return Promise.resolve(callback({ name })).finally(() => held.delete(name));
            }
        } } };
        root.window = root;
        vm.runInNewContext(readFileSync('app/infrastructure/browser-session.js', 'utf8'), root);
        return { api: root.BrowserSession, session, close: () => held.delete('mayor-tab:' + session.get('mayorAccount:tabId')) };
    }
    return { values, store: storage(values), tab };
}

test('a duplicated tab gets its own identity and never inherits live authorization or writer proof', async () => {
    const e = environment();
    e.store.setItem('mayorAuth', JSON.stringify({ account: { id: 'a' }, authToken: 'old-token', mode: 'mayor', lastActivityAt: 1 }));
    e.store.setItem('mayorAccount:a:cloudSave', JSON.stringify({ gameSessionId: 'writer', state: { day: 5 }, writeTimestamp: 100, ackTimestamp: 100 }));
    const first = e.tab(); await first.api.init(e.store);
    assert.equal(first.api.readAuth().authToken, 'old-token', 'P4 authorization migrates once');
    const a = first.api.accountStore('a');
    assert.equal(JSON.parse(a.getItem('cloudSave')).gameSessionId, 'writer');
    const copy = e.tab(new Map(first.session)); await copy.api.init(e.store);
    assert.notEqual(copy.session.get('mayorAccount:tabId'), first.session.get('mayorAccount:tabId'));
    assert.equal(copy.api.readAuth().authToken, undefined);
    const b = copy.api.accountStore('a');
    assert.equal(JSON.parse(b.getItem('cloudSave')).gameSessionId, null);
    b.setItem('cloudSave', JSON.stringify({ state: { day: 6 }, writeTimestamp: 101, localChanged: true }));
    assert.equal(JSON.parse(a.getItem('cloudSave')).state.day, 5);
    assert.equal(first.api.readAuth().authToken, 'old-token');
});

test('reopening after closing the tab restores authorization and its local writer without copying a live tab', async () => {
    const e = environment();
    const first = e.tab(); await first.api.init(e.store);
    first.api.saveAuth({ account: { id: 'a' }, authToken: 'token-a', mode: 'mayor', lastActivityAt: Date.now() });
    first.api.accountStore('a').setItem('cloudSave', JSON.stringify({ gameSessionId: 'writer-a', writeTimestamp: 10, localChanged: false }));
    const originalId = first.session.get('mayorAccount:tabId');
    first.close();
    const reopened = e.tab(); await reopened.api.init(e.store);
    assert.equal(reopened.api.readAuth().authToken, 'token-a');
    assert.equal(reopened.session.get('mayorAccount:tabId'), originalId);
    assert.equal(JSON.parse(reopened.api.accountStore('a').getItem('cloudSave')).gameSessionId, 'writer-a');
    const liveCopy = e.tab(); await liveCopy.api.init(e.store);
    assert.notEqual(liveCopy.session.get('mayorAccount:tabId'), originalId);
    assert.equal(liveCopy.api.readAuth().authToken, undefined);
    assert.notEqual(liveCopy.api.readAuth().locked, true, 'new authorization is not an idle timeout');
});

test('existing per-tab authorization is restored when older browser metadata has no remembered tab ID', async () => {
    const e = environment();
    const auth = { account: { id: 'a' }, authToken: 'existing-token', mode: 'mayor', lastActivityAt: Date.now() };
    e.store.setItem('mayorAuth', JSON.stringify({ account: auth.account, mode: auth.mode, lastActivityAt: auth.lastActivityAt }));
    e.store.setItem('mayorAccount:tab:existing:auth', JSON.stringify(auth));
    const reopened = e.tab(); await reopened.api.init(e.store);
    assert.equal(reopened.api.readAuth().authToken, 'existing-token');
    assert.equal(reopened.session.get('mayorAccount:tabId'), 'existing');
});

test('new tab recovery prefers unsent progress over a newer clean snapshot or a blocked-tab metadata write', async () => {
    const e = environment();
    const first = e.tab(); await first.api.init(e.store);
    const a = first.api.accountStore('a');
    a.setItem('cloudSave', JSON.stringify({ state: { day: 9 }, writeTimestamp: 150, localChanged: true }));
    const second = e.tab(); await second.api.init(e.store);
    const b = second.api.accountStore('a');
    b.setItem('cloudSave', JSON.stringify({ state: { day: 12 }, writeTimestamp: 200, localChanged: false, blocked: 'session_replaced' }));
    const reopened = e.tab(); await reopened.api.init(e.store);
    assert.equal(JSON.parse(reopened.api.accountStore('a').getItem('cloudSave')).state.day, 9);
});

test('activity or expiry in a replaced tab cannot redirect reopening away from the accepted writer', async () => {
    const e = environment();
    const first = e.tab(); await first.api.init(e.store);
    const authA = { account: { id: 'a' }, authToken: 'token-a', mode: 'mayor', lastActivityAt: 10 };
    first.api.saveAuth(authA);
    const second = e.tab(); await second.api.init(e.store);
    second.api.saveAuth({ ...authA, authToken: 'token-b', lastActivityAt: 20 });
    first.api.saveAuth({ ...authA, mode: 'guest', lastActivityAt: 30 });
    first.api.saveAuth({ ...authA, authToken: null, retiredToken: 'token-a', locked: true });
    first.close(); second.close();
    const reopened = e.tab(); await reopened.api.init(e.store);
    assert.equal(reopened.api.readAuth().authToken, 'token-b');
    assert.equal(reopened.session.get('mayorAccount:tabId'), second.session.get('mayorAccount:tabId'));
});

test('resolved recovered progress is not offered again, while later source-tab moves remain recoverable', async () => {
    for (const cloudChoice of [false, true]) {
        const e = environment();
        const first = e.tab(); await first.api.init(e.store);
        const a = first.api.accountStore('a');
        a.setItem('cloudSave', JSON.stringify({ state: { day: 9 }, writeTimestamp: 150, localChanged: true, versionGuid: 'old' }));
        const second = e.tab(); await second.api.init(e.store);
        const b = second.api.accountStore('a');
        const imported = JSON.parse(b.getItem('cloudSave'));
        b.setItem('cloudSave', JSON.stringify({ ...imported, state: { day: cloudChoice ? 12 : 9 },
            writeTimestamp: 200, localChanged: false, recoveryResolved: true, versionGuid: 'accepted' }));
        const third = e.tab(); await third.api.init(e.store);
        assert.equal(JSON.parse(third.api.accountStore('a').getItem('cloudSave')).writeTimestamp, 200);
        a.setItem('cloudSave', JSON.stringify({ state: { day: 10 }, writeTimestamp: 151, localChanged: true, versionGuid: 'old' }));
        const fourth = e.tab(); await fourth.api.init(e.store);
        assert.equal(JSON.parse(fourth.api.accountStore('a').getItem('cloudSave')).state.day, 10);
    }
});
