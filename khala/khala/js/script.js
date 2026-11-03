let menu = document.getElementById("menu");
let boton = document.getElementById("boton-menu");

boton.addEventListener("click", function() {
    if (menu.style.display === "none") {
        menu.style.display = "flex";
        boton.textContent = "✕";
    } else {
        menu.style.display = "none";
        boton.textContent = "☰";
    }
})


let contador = 0;

let contadorCarrito = document.querySelector(".carrito-contador");

let botonesAgregar = document.querySelectorAll(".agregar-carrito");

botonesAgregar.forEach(function(botonProducto) {

    botonProducto.addEventListener("click", function() {

        contador = contador + 1;

        contadorCarrito.textContent = contador;

    });

});

let botonCarrito = document.querySelector(".carrito");
let panelCarrito = document.getElementById("panel-carrito");
let cerrarCarrito = document.getElementById("cerrar-carrito");

botonCarrito.addEventListener("click", function(event) {
    event.preventDefault();
    panelCarrito.hidden = false;
});

cerrarCarrito.addEventListener("click", function() {
    panelCarrito.hidden = true;
});
