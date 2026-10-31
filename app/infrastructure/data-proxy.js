const GAME_DATA_URL = 'https://mayor-game-api.icbob99.workers.dev/api/game-data';

async function fetchRawGameData() {
    return requestGameApi('/api/game-data');
}

async function requestGameApi(path, { method = 'GET', body, token } = {}) {
    const isDocker = typeof LocalEnvironment !== 'undefined';
    const fetchData = isDocker ? LocalEnvironment.fetch.bind(LocalEnvironment) : fetch;
    const response = await fetchData(
        isDocker ? path : GAME_DATA_URL.replace('/api/game-data', path),
        {
            method,
            headers: { ...(body ? { 'Content-Type': 'application/json' } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) },
            body: body ? JSON.stringify(body) : undefined,
            signal: AbortSignal.timeout(15000)
        }
    );
    if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw Object.assign(new Error(`HTTP ${response.status}`), { code: data.error || 'server_unavailable', status: response.status, data });
    }
    if (response.status === 204) return;
    return response.json();
}
