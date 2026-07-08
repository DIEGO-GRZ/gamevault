function renderLoginView(container) {
    container.innerHTML = `
        <div style="max-width: 400px; margin: 4rem auto; padding: 2rem; background: #1e1e24; border-radius: 8px; border: 1px solid #2e2e38;">
            <h2 style="margin-top:0;">Iniciar Sesión</h2>
            <form onsubmit="executeLogin(event)">
                <div style="margin-bottom: 1.2rem;">
                    <label style="display:block; margin-bottom:0.4rem; font-size:0.9rem;">Correo Electrónico</label>
                    <input type="email" id="login-email" required style="width:100%; padding:0.6rem; background:#09090b; color:white; border:1px solid #3f3f46; border-radius:4px; box-sizing:border-box;">
                </div>
                <div style="margin-bottom: 1.5rem;">
                    <label style="display:block; margin-bottom:0.4rem; font-size:0.9rem;">Contraseña</label>
                    <input type="password" id="login-pass" required style="width:100%; padding:0.6rem; background:#09090b; color:white; border:1px solid #3f3f46; border-radius:4px; box-sizing:border-box;">
                </div>
                <button type="submit" style="width:100%; padding:0.7rem; background:var(--primary-color); color:white; border:none; border-radius:4px; font-weight:bold; cursor:pointer;">Ingresar</button>
            </form>
            <p style="margin-top:1.5rem; font-size:0.85rem; text-align:center; color:var(--text-muted);">¿No tienes cuenta? <a href="#" onclick="navigateTo('/register')" style="color:var(--primary-color); text-decoration:none;">Regístrate aquí</a></p>
        </div>
    `;
}

function executeLogin(e) {
    e.preventDefault();
    alert("Login Exitoso. Tu navegador recibirá la cookie JWT de Andrés de manera automática.");
    navigateTo('/');
}