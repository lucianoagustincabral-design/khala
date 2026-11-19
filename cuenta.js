// =====================================
// KHALA - AUTENTICACIÓN (LOGIN / REGISTRO)
// =====================================

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
            email: nuevoUsuario.email
        }));

        registrarEventoAcceso("REGISTRO", nuevoUsuario.email);
        registrarEventoAcceso("LOGIN", nuevoUsuario.email);
        window.location.href = "../html/index.html";
    });
}

if (formLogin) {
    formLogin.addEventListener("submit", (e) => {
        e.preventDefault();

        const email = document.getElementById("email-login").value.trim().toLowerCase();
        const password = document.getElementById("password-login").value;

        const usuarios = JSON.parse(localStorage.getItem("usuariosKhala")) || [];
        const usuario = usuarios.find((u) => u.email === email && u.password === password);

        if (!usuario) {
            if (mensajeCuenta) mensajeCuenta.textContent = "Correo o contraseña incorrectos.";
            return;
        }

        localStorage.setItem("usuarioKhala", JSON.stringify({
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            email: usuario.email
        }));

        registrarEventoAcceso("LOGIN", usuario.email);
        window.location.href = "../html/index.html";
    });
}