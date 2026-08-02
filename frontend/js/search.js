async function renderSearchView(container, query) {
    container.innerHTML = `
        <div style="padding: 2rem; max-width: 1200px; margin: 0 auto;">
            <h2>Resultados para: "${query}"</h2>
            <div class="games-grid" id="search-results-grid">
                <p style="color: var(--text-muted);">Buscando...</p>
            </div>
        </div>
    `;

    const grid = document.getElementById('search-results-grid');

    if (!query) {
        grid.innerHTML = `<p style="color: var(--text-muted);">Escribe algo en el buscador para empezar.</p>`;
        return;
    }

    try {
        const results = await GamesAPI.search(query);

        if (results.length === 0) {
            grid.innerHTML = `<p style="color: var(--text-muted);">No se encontraron juegos para "${query}".</p>`;
            return;
        }

        grid.innerHTML = results.map(game => `
            <div class="game-card" onclick="navigateTo('/game/${game.id}')">
                <img src="${game.image || 'https://via.placeholder.com/200x250'}" alt="${game.name}" onerror="this.src='https://via.placeholder.com/200x250'">
                <h3>${game.name}</h3>
            </div>
        `).join('');

    } catch (error) {
        console.error(error);
        grid.innerHTML = `<p style="color: #ef4444;">⚠️ Ocurrió un error al buscar. Inténtalo más tarde.</p>`;
    }
}
