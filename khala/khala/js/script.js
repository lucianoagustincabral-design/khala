// ==============================
// MENÚ MÓVIL
// ==============================

const menu = document.getElementById("menu");
const botonMenu = document.getElementById("boton-menu");

if (menu && botonMenu) {
    botonMenu.addEventListener("click", function () {
        menu.classList.toggle("activo");
        botonMenu.textContent = menu.classList.contains("activo") ? "✕" : "☰";
    });
}

// ==============================
// ESTADO DEL CARRITO
// ==============================

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

const contadorCarrito = document.querySelector(".carrito-contador");
const botonesAgregar = document.querySelectorAll(".agregar-carrito");
const listaCarritoPagina = document.getElementById("lista-carrito-pagina");
const carritoVacio = document.getElementById("carrito-vacio");
const carritoConProductos = document.getElementById("carrito-con-productos");
const subtotalCarritoPagina = document.getElementById("subtotal-carrito-pagina");
const totalCarritoPagina = document.getElementById("total-carrito-pagina");
const cantidadCarritoPagina = document.getElementById("cantidad-carrito-pagina");
const botonFinalizar = document.getElementById("finalizar-compra");
const notificacionCarrito = document.getElementById("notificacion-carrito");

let temporizadorNotificacion;

function formatearPesos(valor) {
    return "$" + Number(valor || 0).toLocaleString("es-AR");
}

// ==============================
// AGREGAR PRODUCTOS
// ==============================

botonesAgregar.forEach(function (boton) {
    boton.addEventListener("click", function () {
        const producto = boton.closest(".producto");
        if (!producto) return;

        const nombre = producto.querySelector("h3").textContent.trim();
        const precioTexto = producto.querySelector("p").textContent;
        const precio = Number(precioTexto.replace(/\D/g, ""));
        const imagen = producto.querySelector("img").getAttribute("src");

        const productoExistente = carrito.find(function (item) {
            return item.nombre === nombre;
        });

        if (productoExistente) {
            productoExistente.cantidad++;
            if (!productoExistente.imagen) {
                productoExistente.imagen = imagen;
            }
            mostrarNotificacion("Se agregó otra unidad de " + nombre);
        } else {
            carrito.push({
                nombre: nombre,
                precio: precio,
                cantidad: 1,
                imagen: imagen
            });
            mostrarNotificacion(nombre + " se agregó a tu carrito.");
        }

        actualizarCarrito();
    });
});

// ==============================
// ACTUALIZAR CARRITO
// ==============================

function actualizarCarrito() {
    const subtotal = calcularSubtotal(carrito);
    const cantidadTotal = calcularCantidadTotal(carrito);

    if (contadorCarrito) {
        contadorCarrito.textContent = cantidadTotal;
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));

    if (listaCarritoPagina) {
        listaCarritoPagina.innerHTML = "";

        if (carrito.length === 0) {
            if (carritoVacio) carritoVacio.hidden = false;
            if (carritoConProductos) carritoConProductos.hidden = true;
        } else {
            if (carritoVacio) carritoVacio.hidden = true;
            if (carritoConProductos) carritoConProductos.hidden = false;

            carrito.forEach(function (producto, indice) {
                const articulo = document.createElement("article");
                articulo.classList.add("producto-carrito-pagina");

                const imagen = document.createElement("img");
                imagen.src = producto.imagen || "../khala/img/conjunto.webp";
                imagen.alt = producto.nombre;

                const detalle = document.createElement("div");
                detalle.classList.add("producto-carrito-detalle");

                const nombre = document.createElement("h3");
                nombre.textContent = producto.nombre;

                const precio = document.createElement("p");
                precio.textContent = formatearPesos(producto.precio);

                const controles = document.createElement("div");
                controles.classList.add("controles-cantidad");

                const restar = document.createElement("button");
                restar.textContent = "−";
                restar.type = "button";
                restar.classList.add("restar-producto");

                const cantidad = document.createElement("span");
                cantidad.textContent = producto.cantidad;

                const sumar = document.createElement("button");
                sumar.textContent = "+";
                sumar.type = "button";
                sumar.classList.add("sumar-producto");

                const eliminar = document.createElement("button");
                eliminar.textContent = "Eliminar";
                eliminar.type = "button";
                eliminar.classList.add("eliminar-producto-pagina");

                restar.dataset.indice = indice;
                sumar.dataset.indice = indice;
                eliminar.dataset.indice = indice;

                controles.appendChild(restar);
                controles.appendChild(cantidad);
                controles.appendChild(sumar);

                detalle.appendChild(nombre);
                detalle.appendChild(precio);
                detalle.appendChild(controles);
                detalle.appendChild(eliminar);

                articulo.appendChild(imagen);
                articulo.appendChild(detalle);

                listaCarritoPagina.appendChild(articulo);
            });
        }

        if (subtotalCarritoPagina) {
            subtotalCarritoPagina.textContent = formatearPesos(subtotal);
        }
        if (totalCarritoPagina) {
            totalCarritoPagina.textContent = formatearPesos(subtotal);
        }
        if (cantidadCarritoPagina) {
            cantidadCarritoPagina.textContent = cantidadTotal;
        }
    }
}

// ==============================
// MODIFICAR CANTIDAD Y ELIMINAR
// ==============================

function modificarCantidad(indice, cambio) {
    const producto = carrito[indice];
    if (!producto) return;

    producto.cantidad += cambio;
    if (producto.cantidad <= 0) {
        carrito.splice(indice, 1);
    }

    actualizarCarrito();
}

if (listaCarritoPagina) {
    listaCarritoPagina.addEventListener("click", function (event) {
        const indice = Number(event.target.dataset.indice);
        if (Number.isNaN(indice)) return;

        if (event.target.classList.contains("sumar-producto")) {
            modificarCantidad(indice, 1);
        } else if (event.target.classList.contains("restar-producto")) {
            modificarCantidad(indice, -1);
        } else if (event.target.classList.contains("eliminar-producto-pagina")) {
            carrito.splice(indice, 1);
            actualizarCarrito();
        }
    });
}

// ==============================
// IR A CHECKOUT
// ==============================

if (botonFinalizar) {
    botonFinalizar.addEventListener("click", function () {
        if (!Array.isArray(carrito) || carrito.length === 0) {
            mostrarNotificacion("Tu carrito está vacío.");
            return;
        }
        window.location.href = "checkout.html";
    });
}

// ==============================
// NOTIFICACIONES
// ==============================

function mostrarNotificacion(mensaje) {
    if (!notificacionCarrito) return;

    notificacionCarrito.textContent = mensaje;
    notificacionCarrito.hidden = false;
    notificacionCarrito.classList.remove("mostrar");
    void notificacionCarrito.offsetWidth;
    notificacionCarrito.classList.add("mostrar");

    clearTimeout(temporizadorNotificacion);
    temporizadorNotificacion = setTimeout(function () {
        notificacionCarrito.hidden = true;
        notificacionCarrito.classList.remove("mostrar");
    }, 2500);
}

// ==============================
// MODAL DE PRODUCTO
// ==============================

const modalProducto = document.getElementById("modal-producto");
const modalImagen = document.getElementById("modal-imagen");
const modalNombre = document.getElementById("modal-nombre");
const modalPrecio = document.getElementById("modal-precio");
const cerrarModal = document.getElementById("cerrar-modal");
const modalAgregar = document.getElementById("modal-agregar");

let botonProductoSeleccionado;

if (modalProducto && modalImagen && modalNombre && modalPrecio && cerrarModal && modalAgregar) {
    document.querySelectorAll(".producto img").forEach(function (imagen) {
        imagen.addEventListener("click", function () {
            const producto = imagen.closest(".producto");
            if (!producto) return;

            modalImagen.src = imagen.src;
            modalImagen.alt = imagen.alt;
            modalNombre.textContent = producto.querySelector("h3").textContent;
            modalPrecio.textContent = producto.querySelector(".producto-info p").textContent;
            botonProductoSeleccionado = producto.querySelector(".agregar-carrito");
            modalProducto.hidden = false;
        });
    });

    modalAgregar.addEventListener("click", function () {
        if (botonProductoSeleccionado) {
            botonProductoSeleccionado.click();
            modalProducto.hidden = true;
        }
    });

    cerrarModal.addEventListener("click", function () {
        modalProducto.hidden = true;
    });

    modalProducto.addEventListener("click", function (event) {
        if (event.target === modalProducto) {
            modalProducto.hidden = true;
        }
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            modalProducto.hidden = true;
        }
    });
}

// ==============================
// INICIO
// ==============================

actualizarCarrito();