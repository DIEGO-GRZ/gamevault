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
                                ${game.price ? `Disponible a $${game.price} USD` : 'Precio no disponible actualmente'}
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
                        <button onclick="askGeminiAI(${gameId}, '${game.name}')" style="background: var(--primary-color); color: white; padding: 0.7rem 1.5rem; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">Consultar</button>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        container.innerHTML = `<div style="padding: 2rem;"><h2 style="color:#ef4444;">Error al cargar los detalles del juego.</h2></div>`;
    }
}

// Acción del chat usando Gemini a través de la API compartida
async function askGeminiAI(id, gameName) {
    const input = document.getElementById('ai-query-input');
    const chatBox = document.getElementById('ai-chat-box');
    if (!input.value.trim()) return;

    const query = input.value;
    chatBox.innerHTML = `<span style="color: #a1a1aa;">Gemini está analizando ${gameName}...</span>`;
    input.value = '';

    try {
        // Llama a la función de tips que Andrés y Diego configuraron
        const response = await TipsAPI.askAI({ gameId: id, gameName: gameName, question: query });
        chatBox.innerHTML = `<strong>Tú:</strong> ${query}<br><br><strong>✨ Gemini AI:</strong> ${response.text || response.message}`;
    } catch (error) {
        chatBox.innerHTML = `<span style="color: #ef4444;">Error al conectar con el servicio de IA. Asegúrate de configurar la GEMINI_API_KEY.</span>`;
    }
}

async function addGameToLibrary(id) {
    try {
        await LibraryAPI.add(id, 'Pendiente');
        alert("¡Juego agregado con éxito!");
    } catch (error) {
        alert("Inicia sesión para poder agregar juegos a tu biblioteca.");
    }
}