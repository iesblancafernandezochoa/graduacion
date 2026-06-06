// ============================================================
// config.js — Configuración del proyecto graduacion-qr
// ============================================================

// --- Firebase (tus claves) ---
window.firebaseConfig = {
    apiKey: "AIzaSyCr2VSL2hQ6QCGAsgTqxhTkgnO1S7-jTXg",
    authDomain: "graduacion-ies-2026.firebaseapp.com",
    projectId: "graduacion-ies-2026",
    storageBucket: "graduacion-ies-2026.firebasestorage.app",
    messagingSenderId: "782813642821",
    appId: "1:782813642821:web:eb1d739925223ba53f232c"
};

// --- Datos del evento ---
window.NOMBRE_EVENTO = "Graduación 2026 · IES Blanca Fernández Ochoa";
window.ADMIN_EMAIL   = "enriquemateos@gmail.com";  // ← Cámbialo por tu email admin real

// --- Logo del instituto ---
// OPCIÓN RECOMENDADA: Descarga el logo PNG y súbelo a tu repositorio
// de GitHub junto al resto de archivos. Luego pon aquí el nombre:
window.LOGO_URL = "blancalogo.png";

// ALTERNATIVA - URL externa (puede fallar por CORS):
// window.LOGO_URL = "https://site.educa.madrid.org/ies.blancafdezochoa.madrid//wp-content/uploads/ies.blancafdezochoa.madrid/2024/08/cropped-BFO-Blanca-Fernandez-Ochoa.png";

// ALTERNATIVA - Logo en base64 (nunca falla):
// Ve a https://www.base64-image.de/, sube el logo PNG, copia el
// resultado y pégalo aquí:
// window.LOGO_BASE64 = "data:image/png;base64,iVBORw0KGgo.....";
