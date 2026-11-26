// =====================================
// KHALA - LÓGICA DE CHECKOUT
// =====================================

const carritoCheckout = JSON.parse(localStorage.getItem("carrito")) || [];

const checkoutVacio = document.getElementById("checkout-vacio");
const checkoutGrid = document.getElementById("checkout-grid");
const listaResumen = document.getElementById("lista-resumen-checkout");
const elCantidad = document.getElementById("checkout-cantidad");
const elSubtotal = document.getElementById("checkout-subtotal");
const filaDescuento = document.getElementById("fila-descuento");
const elDescuento = document.getElementById("checkout-descuento");
const elTotal = document.getElementById("checkout-total");
const elCuotas = document.getElementById("checkout-cuotas");

const selectPago = document.getElementById("medio-pago");
const infoTransferencia = document.getElementById("info-transferencia");
const infoTarjeta = document.getElementById("info-tarjeta");
const formPedido = document.getElementById("form-checkout");
const seccionComprobante = document.getElementById("orden-confirmada");
const textoComprobante = document.getElementById("resumen-orden-texto");

function formatoARS(valor) {
    return "$" + Number(valor || 0).toLocaleString("es-AR");
}

function autocompletarUsuario() {
    if (typeof obtenerUsuarioActual !== "function") return;
    const usuario = obtenerUsuarioActual();
    if (!usuario) return;

    const inputNombre = document.getElementById("comprador-nombre");
    const inputEmail = document.getElementById("comprador-email");

    if (inputNombre && !inputNombre.value) {
        inputNombre.value = `${usuario.nombre} ${usuario.apellido || ""}`.trim();
    }
    if (inputEmail && !inputEmail.value) {
        inputEmail.value = usuario.email;
    }
}

function renderizarCheckout() {
    if (carritoCheckout.length === 0) {
        if (checkoutVacio) checkoutVacio.hidden = false;
        if (checkoutGrid) checkoutGrid.hidden = true;
        return;
    }

    if (checkoutVacio) checkoutVacio.hidden = true;
    if (checkoutGrid) checkoutGrid.hidden = false;

    if (listaResumen) {
        listaResumen.innerHTML = "";
        carritoCheckout.forEach((item) => {
            const fila = document.createElement("div");
            fila.className = "item-resumen";
            fila.innerHTML = `
                <span>${item.nombre} × ${item.cantidad}</span>
                <strong>${formatoARS(item.precio * item.cantidad)}</strong>
            `;
            listaResumen.appendChild(fila);
        });
    }

    const subtotal = calcularSubtotal(carritoCheckout);
    const cantidad = calcularCantidadTotal(carritoCheckout);
    const medioPago = selectPago ? selectPago.value : "transferencia";
    const total = calcularTotalConPago(subtotal, medioPago);
    const descuento = Math.max(0, subtotal - total);

    if (elCantidad) elCantidad.textContent = cantidad;
    if (elSubtotal) elSubtotal.textContent = formatoARS(subtotal);

    if (filaDescuento && elDescuento) {
        if (medioPago === "transferencia" && descuento > 0) {
            filaDescuento.hidden = false;
            elDescuento.textContent = "-" + formatoARS(descuento);
        } else {
            filaDescuento.hidden = true;
        }
    }

    if (elTotal) elTotal.textContent = formatoARS(total);

    if (infoTransferencia) infoTransferencia.hidden = medioPago !== "transferencia";
    if (infoTarjeta) infoTarjeta.hidden = medioPago !== "tarjeta";

    if (elCuotas) {
        if (medioPago === "tarjeta") {
            const cuota = calcularValorCuota(total, 3);
            elCuotas.textContent = `3 cuotas sin interés de ${formatoARS(cuota)} por mes.`;
        } else {
            elCuotas.textContent = "Envío gratis a todo el país.";
        }
    }
}

if (selectPago) {
    selectPago.addEventListener("change", renderizarCheckout);
}

if (formPedido) {
    formPedido.addEventListener("submit", (e) => {
        e.preventDefault();
        if (carritoCheckout.length === 0) return;

        const subtotal = calcularSubtotal(carritoCheckout);
        const medioPago = selectPago ? selectPago.value : "transferencia";
        const total = calcularTotalConPago(subtotal, medioPago);

        const orden = {
            id: "KHL-" + Date.now(),
            fecha: new Date().toISOString(),
            comprador: {
                nombre: document.getElementById("comprador-nombre").value.trim(),
                email: document.getElementById("comprador-email").value.trim().toLowerCase(),
                telefono: document.getElementById("comprador-telefono").value.trim(),
                direccion: document.getElementById("comprador-direccion").value.trim()
            },
            medioPago,
            subtotal,
            total,
            items: carritoCheckout
        };

        const ordenes = JSON.parse(localStorage.getItem("ordenesKhala")) || [];
        ordenes.push(orden);
        localStorage.setItem("ordenesKhala", JSON.stringify(ordenes));

        localStorage.removeItem("carrito");

        if (checkoutGrid) checkoutGrid.hidden = true;
        if (seccionComprobante && textoComprobante) {
            seccionComprobante.hidden = false;
            textoComprobante.textContent =
                `Número de orden ${orden.id} · Total abonado: ${formatoARS(total)} ` +
                `(${medioPago === "transferencia" ? "Transferencia 10% OFF" : "Tarjeta / Mercado Pago en 3 cuotas"}). ` +
                `Enviaremos los detalles a ${orden.comprador.email}.`;
        }
    });
}

autocompletarUsuario();
renderizarCheckout();