// =====================================
// KHALA - SESIÓN Y AUDITORÍA DE ACCESO
// =====================================

function obtenerUsuarioActual() {
    return JSON.parse(localStorage.getItem("usuarioKhala")) || null;
}

function registrarEventoAcceso(tipo, email) {
    const eventos = JSON.parse(localStorage.getItem("auditoriaKhala")) || [];
    eventos.push({
        tipo, // "REGISTRO" | "LOGIN" | "LOGOUT"
        email,
        fecha: new Date().toISOString()
    });
    localStorage.setItem("auditoriaKhala", JSON.stringify(eventos));
}

function cerrarSesion() {
    const usuario = obtenerUsuarioActual();
    if (usuario) {
        registrarEventoAcceso("LOGOUT", usuario.email);
    }
    localStorage.removeItem("usuarioKhala");
    window.location.href = "../html/index.html";
}

function renderizarHeaderSesion() {
    const contenedorCuenta = document.querySelector(".opciones-cuenta");
    if (!contenedorCuenta) return;

    const usuario = obtenerUsuarioActual();
    if (!usuario) return;

    contenedorCuenta.innerHTML = `
        <span class="usuario-nombre">Hola, ${usuario.nombre}</span>
        <button type="button" id="btn-cerrar-sesion" class="boton-salir">Salir</button>
    `;

    const btnSalir = document.getElementById("btn-cerrar-sesion");
    if (btnSalir) {
        btnSalir.addEventListener("click", cerrarSesion);
    }
}

renderizarHeaderSesion();