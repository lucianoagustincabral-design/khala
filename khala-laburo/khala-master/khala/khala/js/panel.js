function obtenerPedidosKhala() {
    const clavesPosibles = ["pedidosKhala", "comprasKhala"];
    for (const clave of clavesPosibles) {
        const raw = localStorage.getItem(clave);
        if (!raw) continue;
        try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
                return { clave, pedidos: parsed };
            }
        } catch {
            // Ignora JSON mal formado y prueba la siguiente clave
        }
    }
    return { clave: "pedidosKhala", pedidos: [] };
}

function renderizarPedidos(pedidos) {
    const cuerpo = document.getElementById("cuerpo-pedidos");
    const totalPedidos = document.getElementById("total-pedidos");
    if (totalPedidos) totalPedidos.textContent = pedidos.length;
    if (!cuerpo) return;

    cuerpo.innerHTML = "";

    if (pedidos.length === 0) {
        cuerpo.innerHTML = `<tr><td colspan="4">No hay pedidos registrados en localStorage.</td></tr>`;
        return;
    }

    [...pedidos].reverse().forEach((pedido, idx) => {
        const tr = document.createElement("tr");

        const idTexto = pedido.id || `#${pedidos.length - idx}`;
        const fechaTexto = pedido.fecha
            ? new Date(pedido.fecha).toLocaleString("es-AR")
            : "Sin fecha";

        const clienteTexto = pedido.cliente || pedido.email || "Cliente invitado";
        const medioPago = pedido.metodoPago || pedido.medioPago || pedido.pago || "No especificado";

        const items = Array.isArray(pedido.items)
            ? pedido.items
            : Array.isArray(pedido.productos)
            ? pedido.productos
            : [];

        const resumenItems = items.length > 0
            ? items.map((it) => `${it.nombre || it.titulo || "Item"} x${it.cantidad || 1}`).join(", ")
            : `${pedido.cantidadItems || 1} producto(s)`;

        const totalTexto = typeof pedido.total === "number"
            ? `$${pedido.total.toLocaleString("es-AR")}`
            : pedido.total || "$0";

        tr.innerHTML = `
            <td>${idTexto}<br><small>${fechaTexto}</small></td>
            <td>${clienteTexto}<br><small>${medioPago}</small></td>
            <td>${resumenItems}</td>
            <td><strong>${totalTexto}</strong></td>
        `;
        cuerpo.appendChild(tr);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const usuario = obtenerUsuarioActual();

    if (!esUsuarioKhala(usuario)) {
        window.location.href = "../html/index.html";
        return;
    }

    const contenedor = document.getElementById("panel-protegido");
    const bienvenida = document.getElementById("bienvenida-admin");
    const totalEventos = document.getElementById("total-eventos");
    const listaAuditoria = document.getElementById("lista-auditoria");

    if (contenedor) contenedor.style.display = "block";
    if (bienvenida) {
        bienvenida.textContent = `Panel activo — ${usuario.nombre} (${usuario.email})`;
    }

    const { clave: clavePedidos, pedidos } = obtenerPedidosKhala();
    renderizarPedidos(pedidos);

    const eventos = JSON.parse(localStorage.getItem("auditoriaKhala")) || [];
    if (totalEventos) totalEventos.textContent = eventos.length;

    if (listaAuditoria) {
        listaAuditoria.innerHTML = "";
        [...eventos].reverse().forEach((ev) => {
            const li = document.createElement("li");
            const fechaFormateada = new Date(ev.fecha).toLocaleString("es-AR");
            li.textContent = `[${ev.tipo}] ${ev.email} — ${fechaFormateada}`;
            listaAuditoria.appendChild(li);
        });
    }

    document.getElementById("btn-limpiar-pedidos")?.addEventListener("click", () => {
        localStorage.removeItem(clavePedidos);
        renderizarPedidos([]);
    });

    document.getElementById("btn-limpiar-auditoria")?.addEventListener("click", () => {
        localStorage.removeItem("auditoriaKhala");
        if (totalEventos) totalEventos.textContent = "0";
        if (listaAuditoria) listaAuditoria.innerHTML = "";
    });
});