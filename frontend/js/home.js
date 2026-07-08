async function renderHomeView(container) {
    container.innerHTML = `
        <div style="padding: 2rem; max-width: 1200px; margin: 0 auto;">
            <h2 style="margin-bottom: 1.5rem;">🔥 Juegos Populares del Momento</h2>
            <div class="games-grid" id="popular-games-grid">
                <p style="color: var(--text-muted);">Cargando tendencias desde IGDB...</p>
            </div>
        </div>
    `;

    const grid = document.getElementById('popular-games-grid');

    try {
        // LLAMADA REAL A TU API.JS
        const popularGames = await GamesAPI.popular();
        
        if (popularGames.length === 0) {
            grid.innerHTML = `<p style="color: var(--text-muted);">No se encontraron juegos populares en este momento.</p> text`;
            return;
        }

        grid.innerHTML = popularGames.map(game => `
            <div class="game-card" onclick="navigateTo('/game/${game.id}')">
                <img src="${game.image || 'https://via.placeholder.com/200x250'}" alt="${game.name}" onerror="this.src='https://via.placeholder.com/200x250'">
                <h3>${game.name}</h3>
            </div>
        `).join('');
        
    } catch (error) {
        console.error(error);
        // Manejo de error solicitado por el checklist (ej: si cae IGDB)
        grid.innerHTML = `<p style="color: #ef4444;">⚠️ No se pudieron cargar los juegos. Inténtalo más tarde.</p>`;
    }
}