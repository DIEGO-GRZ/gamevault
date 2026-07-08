function renderSearchView(container, query) {
    container.innerHTML = `
        <div style="padding: 2rem; max-width: 1200px; margin: 0 auto;">
            <h2>Resultados para: "${query}"</h2>
            <div class="games-grid" id="search-results-grid">
                <div class="game-card" onclick="navigateTo('/game/1001')">
                    <img src="https://images.igdb.com/igdb/image/upload/t_cover_big/co4jni.jpg" alt="Resultado">
                    <h3>Elden Ring (Coincidencia encontrada)</h3>
                </div>
            </div>
        </div>
    `;
}