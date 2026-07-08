// Manejador centralizado de rutas
function navigateTo(path) {
    window.history.pushState({}, "", path);
    handleRoute(path);
}

function handleRoute(path) {
    const main = document.getElementById('main-content');
    
    if (path === '/' || path === '/index.html') {
        renderHomeView(main);
    } else if (path === '/login') {
        renderLoginView(main);
    } else if (path === '/register') {
        renderRegisterView(main);
    } else if (path === '/library') {
        renderLibraryView(main);
    } else if (path.startsWith('/search')) {
        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get('q') || '';
        renderSearchView(main, query);
    } else if (path.startsWith('/game/')) {
        const gameId = path.split('/')[2];
        renderGameDetailView(main, gameId);
    } else {
        main.innerHTML = `<div style="padding:2rem;"><h2>404 - Página no encontrada</h2></div>`;
    }
}

// Escuchar navegación del historial (Botones atrás/adelante)
window.addEventListener('popstate', () => handleRoute(window.location.pathname));

// Disparar la búsqueda desde la Navbar
function triggerGlobalSearch() {
    const query = document.getElementById('global-search-input').value.trim();
    if (query) navigateTo(`/search?q=${encodeURIComponent(query)}`);
}

// Arrancar la aplicación
window.onload = () => handleRoute(window.location.pathname);