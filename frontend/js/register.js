function renderRegisterView(container) {
    container.innerHTML = `
        <div style="max-width: 400px; margin: 4rem auto; padding: 2rem; background: #1e1e24; border-radius: 8px; border: 1px solid #2e2e38;">
            <h2 style="margin-top:0;">Crear Cuenta</h2>
            <form onsubmit="executeRegister(event)">
                <div style="margin-bottom: 1.2rem;">
                    <label style="display:block; margin-bottom:0.4rem; font-size:0.9rem;">Nombre de Usuario</label>
                    <input type="text" id="reg-user" required style="width:100%; padding:0.6rem; background:#09090b; color:white; border:1px solid #3f3f46; border-radius:4px; box-sizing:border-box;">
                </div>
                <div style="margin-bottom: 1.2rem;">
                    <label style="display:block; margin-bottom:0.4rem; font-size:0.9rem;">Correo Electrónico</label>
                    <input type="email" id="reg-email" required style="width:100%; padding:0.6rem; background:#09090b; color:white; border:1px solid #3f3f46; border-radius:4px; box-sizing:border-box;">
                </div>
                <div style="margin-bottom: 1.5rem;">
                    <label style="display:block; margin-bottom:0.4rem; font-size:0.9rem;">Contraseña</label>
                    <input type="password" id="reg-pass" required style="width:100%; padding:0.6rem; background:#09090b; color:white; border:1px solid #3f3f46; border-radius:4px; box-sizing:border-box;">
                </div>
                <p id="register-error" style="color:#ef4444; font-size:0.85rem; display:none; margin-bottom:1rem;"></p>
                <button type="submit" style="width:100%; padding:0.7rem; background:#22c55e; color:white; border:none; border-radius:4px; font-weight:bold; cursor:pointer;">Registrarme</button>
            </form>
        </div>
    `;
}

async function executeRegister(e) {
    e.preventDefault();

    const username = document.getElementById('reg-user').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-pass').value;
    const errorEl = document.getElementById('register-error');
    errorEl.style.display = 'none';

    try {
        await AuthAPI.register({ username, email, password });
        navigateTo('/login');
    } catch (error) {
        errorEl.textContent = error.message || 'No se pudo completar el registro.';
        errorEl.style.display = 'block';
    }
}
