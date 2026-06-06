# Prompt para que una IA te construya la app

Pega el bloque de abajo en una conversación nueva con Claude, ChatGPT, Gemini, etc. Está pensado para que la IA te entregue todos los archivos listos para subir a Firebase Hosting.

---

## PROMPT (copia desde aquí)

Actúa como un desarrollador web sénior. Necesito que me construyas una **web app gratuita** para validar entradas con código QR en la graduación de un instituto. Dámela en archivos completos y autocontenidos, sin frameworks, lista para desplegar en **Firebase Hosting**. Escribe todos los textos de la interfaz en **español de España**.

### Contexto del problema

- Vamos a imprimir entre 100 y 300 entradas con un QR único cada una y repartirlas a las familias.
- En la puerta del evento, 1 o 2 personas escanearán los QR desde su móvil.
- **No se pueden colar duplicados**: si un QR ya se ha usado, hay que avisar.
- Habrá conexión wifi/datos estable en la puerta.
- El QR contiene **únicamente el código de la entrada**, sin datos personales.

### Stack y servicios (todo gratis)

- HTML + CSS + JavaScript puro (sin React, sin bundlers, sin npm en el frontend).
- **Firebase Firestore** como base de datos (plan Spark, gratis).
- **Firebase Authentication** con email + contraseña.
- **Firebase Hosting** para servir la web.
- Librerías cargadas desde CDN: Firebase SDK v10 modular (gstatic), `html5-qrcode` (unpkg), `jsPDF` y `qrcodejs` (cdnjs).

### Páginas que necesito

1. **`index.html`** — Página de inicio con dos botones: "Escanear entradas" y "Panel de administración".
2. **`admin.html`** — Panel de administración (requiere login):
   - Login con email/contraseña usando Firebase Auth.
   - Estadísticas en vivo: total / disponibles / usadas.
   - Botón "Crear N entradas" que pide un número y crea N documentos con códigos únicos del tipo `ENT-XXXXXX` (6 caracteres alfanuméricos sin caracteres ambiguos como 0/O o 1/I/L). Usar `writeBatch` para crear el lote.
   - Lista filtrable de todas las entradas con estado (Disponible / Usada).
   - Botones por fila para reactivar, marcar como usada o borrar la entrada.
   - Botón "Borrar TODAS las entradas" con doble confirmación.
   - Botón "Marcar todas como NO usadas" (útil para una prueba previa).
   - Botón "Descargar PDF imprimible" que genera un PDF A4 con 10 entradas por página (2 columnas × 5 filas), cada una con su QR (~35 mm), el nombre del evento, la palabra "ENTRADA" y el código en grande. Usar `jsPDF` + `qrcodejs` (cargados dinámicamente al pulsar el botón).
3. **`scan.html`** — Escáner QR (requiere login):
   - Login con las mismas credenciales que admin.
   - Abre la cámara trasera del móvil con `html5-qrcode`. Botones para pausar/reanudar y cambiar de cámara si hay varias.
   - Estadísticas en vivo (disponibles / validadas / total) con `onSnapshot`.
   - Al leer un QR:
     - Si el código existe y `usada=false` → actualiza `usada=true` + `usadaEn=<ISO>` y muestra un cartel grande verde "✓ Entrada VÁLIDA" + sonido agudo (WebAudio) + vibración corta.
     - Si `usada=true` → cartel rojo "⚠ Entrada YA USADA" indicando la hora a la que se validó por primera vez + sonido grave + vibración tipo error.
     - Si el código no existe → cartel ámbar "✗ Entrada NO válida".
   - Anti‑rebote: ignora la misma lectura durante 2 segundos.
   - Mantén un historial de los últimos 15 escaneos en pantalla.

### Modelo de datos

Una sola colección `entradas` en Firestore. Cada documento tiene como ID el propio código (`ENT-XXXXXX`) y los campos:

```
{
  usada:    boolean,
  usadaEn:  string | null,    // ISO 8601 cuando se valida
  creada:   string             // ISO 8601 al crear
}
```

### Reglas de seguridad de Firestore

Genérame un archivo `firestore.rules` que solo permita leer/escribir la colección `entradas` a usuarios autenticados, y bloquee cualquier otra colección por defecto. Usa `rules_version = '2'`.

### Configuración

- Crea un archivo `config.js` separado donde solo se exponga `window.firebaseConfig = { ... }` y `window.NOMBRE_EVENTO = "..."`. Pónlo con valores de ejemplo claramente marcados para que yo los sustituya por los reales.
- Las páginas deben leer `window.NOMBRE_EVENTO` y mostrarlo en el `<title>` y en cabeceras.

### Estilos

Diseño moderno, modo oscuro, mobile‑first (los escáneres se usan desde el móvil). Botones grandes, alto contraste, feedback visual claro (verde / rojo / ámbar) en el resultado del escaneo. Un único `style.css` compartido entre las tres páginas.

### Documentación

Genérame además un `README.md` en castellano con:

1. Pasos para crear el proyecto en la consola de Firebase (Auth, Firestore, crear usuario admin, pegar las reglas).
2. Cómo obtener el bloque `firebaseConfig` y dónde pegarlo.
3. Cómo desplegar con `firebase deploy` y como alternativa GitHub Pages.
4. Aviso de que la cámara solo funciona sobre HTTPS.
5. Resumen de uso (admin antes del evento, escáner el día del evento).

### Entrega

Devuélveme cada archivo en un bloque de código separado y bien etiquetado, en este orden: `index.html`, `admin.html`, `scan.html`, `config.js`, `style.css`, `firestore.rules`, `README.md`. Sin omitir nada y sin "// resto del código aquí". Que sea código completo y funcional.

---

## (fin del prompt)
