// =====================================
// KHALA - AUTENTICACIÓN (LOGIN / REGISTRO)
// =====================================

const USUARIO_KHALA = {
    nombre: "Admin",
    apellido: "Khala",
    email: "admin@khala.com",
    password: "Khala2026!",
    rol: "admin",
    tipo: "khala"
};

const boxLogin = document.getElementById("formulario-login");
const boxRegistro = document.getElementById("formulario-registro");
const btnMostrarRegistro = document.getElementById("mostrar-registro");
const btnMostrarLogin = document.getElementById("mostrar-login");
const formLogin = document.getElementById("form-login");
const formRegistro = document.getElementById("form-registro");
const mensajeCuenta = document.getElementById("mensaje-cuenta");

if (btnMostrarRegistro && btnMostrarLogin && boxLogin && boxRegistro) {
    btnMostrarRegistro.addEventListener("click", () => {
        boxLogin.classList.add("oculto");
        boxRegistro.classList.remove("oculto");
        if (mensajeCuenta) mensajeCuenta.textContent = "";
    });

    btnMostrarLogin.addEventListener("click", () => {
        boxRegistro.classList.add("oculto");
        boxLogin.classList.remove("oculto");
        if (mensajeCuenta) mensajeCuenta.textContent = "";
    });
}

if (formRegistro) {
    formRegistro.addEventListener("submit", (e) => {
        e.preventDefault();

        const datos = {
            nombre: document.getElementById("nombre-registro").value,
            apellido: document.getElementById("apellido-registro").value,
            email: document.getElementById("email-registro").value.trim().toLowerCase(),
            password: document.getElementById("password-registro").value,
            confirmarPassword: document.getElementById("confirmar-password").value
        };

        const validacion = validarRegistro(datos);
        if (!validacion.valido) {
            if (mensajeCuenta) mensajeCuenta.textContent = validacion.error;
            return;
        }

        const usuarios = JSON.parse(localStorage.getItem("usuariosKhala")) || [];
        if (usuarios.some((u) => u.email === datos.email)) {
            if (mensajeCuenta) mensajeCuenta.textContent = "Ese correo ya está registrado.";
            return;
        }

        const nuevoUsuario = {
            nombre: datos.nombre.trim(),
            apellido: datos.apellido.trim(),
            email: datos.email,
            password: datos.password
        };

        usuarios.push(nuevoUsuario);
        localStorage.setItem("usuariosKhala", JSON.stringify(usuarios));

        localStorage.setItem("usuarioKhala", JSON.stringify({
            nombre: nuevoUsuario.nombre,
            apellido: nuevoUsuario.apellido,
            email: nuevoUsuario.email,
            rol: "cliente"
        }));

        if (typeof registrarEventoAcceso === "function") {
            registrarEventoAcceso("REGISTRO", nuevoUsuario.email);
            registrarEventoAcceso("LOGIN", nuevoUsuario.email);
        }

        window.location.href = "index.html";
    });
}

if (formLogin) {
    formLogin.addEventListener("submit", (e) => {
        e.preventDefault();

        const email = document.getElementById("email-login").value.trim().toLowerCase();
        const password = document.getElementById("password-login").value;

        // 1. Acceso especial para cuenta interna de Khala -> va al panel
        if (email === USUARIO_KHALA.email && password === USUARIO_KHALA.password) {
            const sesionAdmin = {
                nombre: USUARIO_KHALA.nombre,
                apellido: USUARIO_KHALA.apellido,
                email: USUARIO_KHALA.email,
                rol: USUARIO_KHALA.rol,
                tipo: USUARIO_KHALA.tipo
            };

            localStorage.setItem("usuarioKhala", JSON.stringify(sesionAdmin));

            if (typeof registrarEventoAcceso === "function") {
                registrarEventoAcceso("LOGIN", sesionAdmin.email);
            }

            window.location.href = "panel.html";
            return;
        }

        // 2. Acceso para clientes registrados -> va a la tienda
        const usuarios = JSON.parse(localStorage.getItem("usuariosKhala")) || [];
        const usuario = usuarios.find((u) => u.email === email && u.password === password);

        if (!usuario) {
            if (mensajeCuenta) mensajeCuenta.textContent = "Correo o contraseña incorrectos.";
            return;
        }

        localStorage.setItem("usuarioKhala", JSON.stringify({
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            email: usuario.email,
            rol: "cliente"
        }));

        if (typeof registrarEventoAcceso === "function") {
            registrarEventoAcceso("LOGIN", usuario.email);
        }

        window.location.href = "index.html";
    });
}