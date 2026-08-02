// Mapeo interno: valor real (backend) -> etiqueta visible (español)
const STATUS_LABELS = {
    playing:   'Jugando',
    completed: 'Completado',
    pending:   'Pendiente',
    favorite:  'Favorito',
};

async function renderLibraryView(container) {
    container.innerHTML = `
        <div style="padding: 2rem; max-width: 1200px; margin: 0 auto;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                <h2>📚 Mi Biblioteca Personal</h2>
                <select id="library-filter" style="padding: 0.5rem; background: #1e1e24; color: white; border: 1px solid #3f3f46; border-radius:4px;" onchange="applyLibraryFilter()">
                    <option value="Todos">Mostrar Todos</option>
                    <option value="playing">Jugando</option>
                    <option value="completed">Completado</option>
                    <option value="pending">Pendiente</option>
                    <option value="favorite">Favorito</option>
                </select>
            </div>
            <div class="games-grid" id="library-items-grid">
                <p style="color:var(--text-muted)">Cargando biblioteca...</p>
            </div>
        </div>
    `;

    const grid = document.getElementById('library-items-grid');

    try {
        const userLibrary = await LibraryAPI.getAll();

        if (userLibrary.length === 0) {
            grid.innerHTML = `<p style="color: var(--text-muted);">Tu biblioteca está vacía. ¡Busca un juego y agrégalo!</p>`;
            return;
        }

        grid.innerHTML = userLibrary.map(game => `
            <div class="game-card" data-status="${game.status}">
                <img src="${game.image || 'https://via.placeholder.com/200x250'}" alt="${game.name}" onerror="this.src='https://via.placeholder.com/200x250'">
                <div style="padding: 1rem;">
                    <h3 style="font-size: 1rem; margin:0 0 0.5rem 0;">${game.name}</h3>
                    <select onchange="changeStatusInDB(${game.igdb_id}, this.value)" style="width:100%; padding:0.4rem; background:#09090b; color:white; border:1px solid #3f3f46; border-radius:4px;">
                        <option value="playing"   ${game.status === 'playing'   ? 'selected' : ''}>Jugando</option>
                        <option value="completed" ${game.status === 'completed' ? 'selected' : ''}>Completado</option>
                        <option value="pending"   ${game.status === 'pending'   ? 'selected' : ''}>Pendiente</option>
                        <option value="favorite"  ${game.status === 'favorite'  ? 'selected' : ''}>Favorito</option>
                    </select>
                </div>
            </div>
        `).join('');

    } catch (error) {
        grid.innerHTML = `<p style="color: #ef4444;">Por favor inicia sesión para ver tu biblioteca.</p>`;
    }
}

function applyLibraryFilter() {
    const filter = document.getElementById('library-filter').value;
    document.querySelectorAll('#library-items-grid .game-card').forEach(card => {
        card.style.display = (filter === 'Todos' || card.dataset.status === filter) ? '' : 'none';
    });
}

async function changeStatusInDB(id, newStatus) {
    try {
        await LibraryAPI.update(id, newStatus);
        console.log(`Estado actualizado a ${newStatus}`);
    } catch (error) {
        alert("No se pudo actualizar el estado del juego.");
    }
}
