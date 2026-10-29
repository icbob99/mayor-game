const GAME_DATA_URL = 'https://mayor-game-api.icbob99.workers.dev/api/game-data';

async function fetchRawGameData() {
    const isDocker = typeof LocalEnvironment !== 'undefined';
    const fetchData = isDocker ? LocalEnvironment.fetch.bind(LocalEnvironment) : fetch;
    const response = await fetchData(
        isDocker ? '/api/game-data' : GAME_DATA_URL,
        {
            method: 'GET',
            signal: AbortSignal.timeout(15000)
        }
    );
    if (!response.ok) throw new Error(`Turso HTTP ${response.status}`);
    return response.json();
}
