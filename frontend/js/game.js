async function renderGameDetailView(container, gameId) {
    container.innerHTML = `<div style="padding: 2rem;"><h2>Cargando información del juego...</h2></div>`;

    try {
        const game = await GamesAPI.detail(gameId);

        container.innerHTML = `
            <div style="padding: 2rem; max-width: 1000px; margin: 0 auto;">
                <div style="display: flex; gap: 2rem; flex-wrap: wrap; margin-bottom: 3rem;">
                    <img src="${game.image || 'https://via.placeholder.com/260x360'}" style="border-radius: 8px; border: 1px solid #3f3f46;" onerror="this.src='https://via.placeholder.com/260x360'">
                    <div style="flex: 1; min-width: 300px;">
                        <span style="background: var(--primary-color); padding: 0.3rem 0.6rem; border-radius: 4px; font-size: 0.8rem;">IGDB ID: ${gameId}</span>
                        <h1 style="margin: 0.5rem 0 1rem 0;">${game.name}</h1>
                        <p style="color: #a1a1aa; line-height: 1.6;">${game.summary || 'Sin sinopsis disponible.'}</p>

                        <div style="background: #1e1e24; padding: 1rem; border-radius: 6px; margin-top: 1rem; border-left: 4px solid #22c55e;">
                            <span style="color: #a1a1aa; font-size: 0.9rem;">Mejor Oferta (CheapShark API):</span>
                            <strong style="display: block; font-size: 1.2rem; color: #22c55e;">
                                ${game.price?.currentPrice ? `Disponible a $${game.price.currentPrice} USD` : 'Precio no disponible actualmente'}
                            </strong>
                        </div>

                        <button onclick="addGameToLibrary(${gameId})" style="margin-top: 1.5rem; background:#22c55e; color:white; border:none; padding:0.7rem 1.5rem; border-radius:4px; cursor:pointer; font-weight:bold;">➕ Agregar a Mi Biblioteca</button>
                    </div>
                </div>

                <div style="background: #1e1e24; padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
                    <h3>✨ Consejos Estratégicos de Gemini AI</h3>
                    <div id="ai-chat-box" style="background: #09090b; padding: 1rem; border-radius: 6px; margin-bottom: 1rem; min-height: 100px; font-size: 0.95rem; color: #e4e4e7; line-height: 1.5;">
                        Pregúntale a Gemini una táctica específica para este juego...
                    </div>
                    <div style="display: flex; gap: 1rem;">
                        <input type="text" id="ai-query-input" placeholder="¿Cómo derroto al primer jefe?" style="flex: 1; padding: 0.7rem; background: #09090b; color: white; border: 1px solid #3f3f46; border-radius: 4px;">
                        <button id="ai-submit-btn" style="background: var(--primary-color); color: white; padding: 0.7rem 1.5rem; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">Consultar</button>
                    </div>
                </div>

                <div style="background: #1e1e24; padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
                    <h3>💬 Tips de la Comunidad</h3>

                    <form id="tip-form" onsubmit="submitTip(event, ${gameId})" style="margin-bottom: 1.5rem; display: flex; flex-direction: column; gap: 0.7rem;">
                        <input type="text" id="tip-title" placeholder="Título del tip" required style="padding: 0.6rem; background: #09090b; color: white; border: 1px solid #3f3f46; border-radius: 4px;">
                        <textarea id="tip-content" placeholder="Comparte tu consejo..." required rows="3" style="padding: 0.6rem; background: #09090b; color: white; border: 1px solid #3f3f46; border-radius: 4px; resize: vertical;"></textarea>
                        <div style="display: flex; gap: 1rem;">
                            <select id="tip-category" style="flex: 1; padding: 0.6rem; background: #09090b; color: white; border: 1px solid #3f3f46; border-radius: 4px;">
                                <option value="general">General</option>
                                <option value="historia">Historia</option>
                                <option value="jefe">Jefe</option>
                                <option value="coleccionables">Coleccionables</option>
                                <option value="logros">Logros</option>
                                <option value="speedrun">Speedrun</option>
                            </select>
                            <button type="submit" style="background: var(--primary-color); color: white; padding: 0.6rem 1.5rem; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">Publicar</button>
                        </div>
                        <p id="tip-error" style="color:#ef4444; font-size:0.85rem; display:none; margin: 0;"></p>
                    </form>

                    <div id="tips-list">
                        <p style="color: var(--text-muted);">Cargando tips...</p>
                    </div>
                </div>
            </div>
        `;

        window._currentGame = { id: gameId, name: game.name };
        document.getElementById('ai-submit-btn').addEventListener('click', () => {
            askGeminiAI(window._currentGame.id, window._currentGame.name);
        });

        loadCommunityTips(gameId);

    } catch (error) {
        container.innerHTML = `<div style="padding: 2rem;"><h2 style="color:#ef4444;">Error al cargar los detalles del juego.</h2></div>`;
    }
}

async function loadCommunityTips(gameId) {
    const list = document.getElementById('tips-list');
    try {
        const tips = await TipsAPI.getByGame(gameId);

        if (tips.length === 0) {
            list.innerHTML = `<p style="color: var(--text-muted);">Todavía no hay tips para este juego. ¡Sé el primero en publicar uno!</p>`;
            return;
        }

        list.innerHTML = tips.map(tip => `
            <div style="background: #09090b; padding: 1rem; border-radius: 6px; margin-bottom: 0.8rem; border-left: 3px solid var(--primary-color);">
                <div style="display: flex; justify-content: space-between; align-items: start; gap: 1rem;">
                    <div>
                        <strong>${tip.title}</strong>
                        <span style="background: #1e1e24; color: #a1a1aa; font-size: 0.75rem; padding: 0.15rem 0.5rem; border-radius: 4px; margin-left: 0.5rem;">${tip.category}</span>
                    </div>
                    <button onclick="voteTip(${tip.id}, ${gameId})" style="background: none; border: 1px solid #3f3f46; color: #e4e4e7; padding: 0.3rem 0.7rem; border-radius: 4px; cursor: pointer; white-space: nowrap;">👍 ${tip.votes}</button>
                </div>
                <p style="color: #e4e4e7; margin: 0.6rem 0; line-height: 1.5;">${tip.content}</p>
                <span style="color: var(--text-muted); font-size: 0.8rem;">por ${tip.username}</span>
            </div>
        `).join('');

    } catch (error) {
        list.innerHTML = `<p style="color: #ef4444;">No se pudieron cargar los tips.</p>`;
    }
}

async function submitTip(e, gameId) {
    e.preventDefault();

    const title = document.getElementById('tip-title').value;
    const content = document.getElementById('tip-content').value;
    const category = document.getElementById('tip-category').value;
    const errorEl = document.getElementById('tip-error');
    errorEl.style.display = 'none';

    try {
        await TipsAPI.create(gameId, { title, content, category });
        document.getElementById('tip-form').reset();
        loadCommunityTips(gameId);
    } catch (error) {
        errorEl.textContent = error.message || 'Inicia sesión para publicar un tip.';
        errorEl.style.display = 'block';
    }
}

async function voteTip(tipId, gameId) {
    try {
        await TipsAPI.vote(tipId);
        loadCommunityTips(gameId);
    } catch (error) {
        alert(error.message || 'No se pudo registrar tu voto. ¿Ya votaste este tip?');
    }
}

async function askGeminiAI(id, gameName) {
    const input = document.getElementById('ai-query-input');
    const chatBox = document.getElementById('ai-chat-box');
    if (!input.value.trim()) return;

    const query = input.value;
    chatBox.innerHTML = `<span style="color: #a1a1aa;">Gemini está analizando ${gameName}...</span>`;
    input.value = '';

    try {
        const response = await TipsAPI.askAI({ gameId: id, gameName: gameName, question: query });
        chatBox.innerHTML = `<strong>Tú:</strong> ${query}<br><br><strong>✨ Gemini AI:</strong> ${response.answer}`;
    } catch (error) {
        chatBox.innerHTML = `<span style="color: #ef4444;">Error al conectar con el servicio de IA.</span>`;
    }
}

async function addGameToLibrary(id) {
    try {
        await LibraryAPI.add(id, 'pending');
        alert("¡Juego agregado con éxito!");
    } catch (error) {
        alert("Inicia sesión para poder agregar juegos a tu biblioteca.");
    }
}
