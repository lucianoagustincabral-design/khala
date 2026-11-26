// =====================================
// KHALA - LÓGICA DE NEGOCIO PURA
// =====================================

const DESCUENTO_TRANSFERENCIA = 0.10; // 10% OFF por transferencia
const CUOTAS_SIN_INTERES = 3;

function calcularSubtotal(items) {
    if (!Array.isArray(items)) return 0;
    return items.reduce((acc, item) => acc + Number(item.precio) * Number(item.cantidad), 0);
}

function calcularCantidadTotal(items) {
    if (!Array.isArray(items)) return 0;
    return items.reduce((acc, item) => acc + Number(item.cantidad), 0);
}

function calcularTotalConPago(subtotal, medioPago) {
    const base = Math.max(0, Number(subtotal) || 0);
    if (medioPago === "transferencia") {
        return Math.round(base * (1 - DESCUENTO_TRANSFERENCIA));
    }
    return base;
}

function calcularValorCuota(total, cuotas = CUOTAS_SIN_INTERES) {
    const monto = Math.max(0, Number(total) || 0);
    if (!cuotas || cuotas <= 0) return monto;
    return Math.round(monto / cuotas);
}

function validarRegistro({ nombre, apellido, email, password, confirmarPassword }) {
    if (!nombre || !nombre.trim() || !apellido || !apellido.trim()) {
        return { valido: false, error: "Completá tu nombre y apellido." };
    }
    if (!email || !email.includes("@") || !email.includes(".")) {
        return { valido: false, error: "Ingresá un correo electrónico válido." };
    }
    if (!password || password.length < 8) {
        return { valido: false, error: "La contraseña debe tener al menos 8 caracteres." };
    }
    if (password !== confirmarPassword) {
        return { valido: false, error: "Las contraseñas no coinciden." };
    }
    return { valido: true, error: null };
    
}
