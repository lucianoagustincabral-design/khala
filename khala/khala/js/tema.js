
// =====================================
// KHALA - MODO CLARO Y OSCURO
// =====================================

const botonTema = document.getElementById("modo-oscuro");
const iconoTema = document.querySelector(".icono-tema");

// Recuperar tema guardado
const temaGuardado = localStorage.getItem("temaKhala");

// Aplicar tema al cargar la página
if (temaGuardado === "oscuro") {
    document.body.classList.add("modo-noche");
} else {
    document.body.classList.remove("modo-noche");
}

// Actualizar icono
function actualizarIconoTema() {

    if (!iconoTema) return;

    if (document.body.classList.contains("modo-noche")) {
        iconoTema.textContent = "☀";
    } else {
        iconoTema.textContent = "☾";
    }
}

// Mostrar icono correcto al iniciar
actualizarIconoTema();

// Cambiar tema al presionar el botón
if (botonTema) {

    botonTema.addEventListener("click", function () {

        document.body.classList.toggle("modo-noche");

        const modoOscuroActivo =
            document.body.classList.contains("modo-noche");

        localStorage.setItem(
            "temaKhala",
            modoOscuroActivo ? "oscuro" : "claro"
        );

        actualizarIconoTema();

    });

}
