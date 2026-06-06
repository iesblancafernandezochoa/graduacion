# Sistema de entradas con QR para graduación

App web ligera para emitir y validar entradas con código QR. Pensada para una graduación de instituto: se imprimen las entradas con su QR único, se reparten a las familias, y el día del evento se escanean desde uno o varios móviles. **No permite duplicados**: si un QR ya se ha usado, el escáner avisa.

Todo el sistema funciona con servicios **gratuitos** (plan Spark de Firebase).

## Arquitectura

- **Frontend**: HTML + JavaScript puro (sin frameworks). Funciona como web app desde cualquier navegador moderno (móvil incluido).
- **Backend / base de datos**: [Firebase Firestore](https://firebase.google.com/docs/firestore) — NoSQL en la nube, sincroniza en tiempo real entre los móviles.
- **Autenticación**: Firebase Authentication (email + contraseña).
- **Hosting (gratis)**: Firebase Hosting o GitHub Pages.

Una sola colección en Firestore, `entradas`, con documentos así:

```
entradas/ENT-A7B3K9
├─ usada:    false
├─ usadaEn:  null
└─ creada:   "2026-04-29T10:23:11.000Z"
```

El **ID del documento es el propio código de la entrada** (lo que va dentro del QR).

---

## Configuración paso a paso

### 1. Crear el proyecto en Firebase (5 min)

1. Entra en <https://console.firebase.google.com> con tu cuenta de Google.
2. **Crear proyecto** → ponle un nombre (p. ej. `graduacion-ies-2026`). Puedes desactivar Google Analytics si no lo necesitas.
3. Una vez dentro del proyecto, en el menú izquierdo:
   - **Build → Authentication** → *Comenzar* → pestaña **Sign-in method** → habilita **Correo electrónico/contraseña**.
   - **Build → Firestore Database** → *Crear base de datos* → modo **producción** → región `eur3 (europe-west)`.

### 2. Crear el usuario administrador

En **Authentication → Users → Añadir usuario**, crea uno (por ejemplo `admin@miinstituto.es`) con una contraseña fuerte. Este será el usuario que use tanto la web de admin como los móviles que escanean.

> Si quieres que en la puerta haya alguien que solo escanee, puedes crear otro usuario adicional con otra contraseña — los permisos en Firestore son los mismos (lo controla `firestore.rules`).

### 3. Pegar las reglas de Firestore

Abre el archivo `firestore.rules` de este proyecto, copia su contenido, ve a la consola de Firebase → **Firestore Database → Reglas**, pégalo y pulsa **Publicar**.

### 4. Obtener tu configuración Firebase

En la consola: **Configuración del proyecto** (engranaje arriba a la izquierda) → **Tus apps** → icono `</>` (Web) → registra una app (cualquier nombre) → copia el bloque `firebaseConfig` que te aparece.

Pégalo en el archivo `config.js` sustituyendo el ejemplo:

```js
window.firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "graduacion-ies-2026.firebaseapp.com",
  projectId: "graduacion-ies-2026",
  ...
};

window.NOMBRE_EVENTO = "Graduación 2026 · IES Mi Centro";
```

### 5. Desplegar la web

Tienes dos opciones gratuitas. La más sencilla:

#### Opción A · Firebase Hosting (recomendado)

```bash
# Solo la primera vez
npm install -g firebase-tools
firebase login

# Dentro de la carpeta del proyecto
cd graduacion-qr
firebase init hosting    # selecciona el proyecto que creaste; carpeta pública: "."
firebase deploy
```

Te dará una URL del tipo `https://graduacion-ies-2026.web.app`.

#### Opción B · GitHub Pages

Sube la carpeta a un repositorio de GitHub y activa **Settings → Pages → Branch: main / root**. URL del tipo `https://tu-usuario.github.io/graduacion-qr/`.

> **Importante**: el escáner pide acceso a la cámara y eso **solo funciona sobre HTTPS** (no sobre `file://` ni `http://`). Tanto Firebase Hosting como GitHub Pages dan HTTPS de serie.

### 6. Autorizar tu dominio en Authentication

En la consola: **Authentication → Settings → Authorized domains** → comprueba que tu dominio (`*.web.app` o `*.github.io`) está en la lista (Firebase Hosting lo añade solo).

---

## Uso

### Antes del evento (admin)

1. Abre la URL del proyecto en el ordenador → **Panel de administración**.
2. Inicia sesión con el usuario admin que creaste.
3. Indica el número de entradas que necesitas (por ejemplo, 250) y pulsa **Crear N entradas**.
4. Pulsa **📄 Descargar PDF imprimible** → te genera un PDF A4 con 10 entradas por página, cada una con su QR y su código.
5. Imprime y recorta. Reparte a las familias.

### El día del evento (puerta)

1. Cada persona que vaya a escanear abre la web en su móvil → **Escanear entradas**.
2. Inicia sesión la primera vez (la sesión queda guardada).
3. Apunta la cámara al QR de la entrada. La app:
   - **✓ verde** + sonido agudo = entrada válida (la marca como usada automáticamente).
   - **⚠ rojo** + sonido grave = entrada YA usada antes (te dice a qué hora).
   - **✗ ámbar** = código no existe en la base de datos (entrada falsa).
4. Si necesitas pausar la cámara, usa el botón **⏸ Pausar**. Si tu móvil tiene varias cámaras, **🔄 Cambiar cámara** alterna entre ellas.

Todos los móviles ven los mismos datos en tiempo real, así que aunque escaneéis dos personas a la vez no podréis colar una entrada repetida.

### Edición sobre la marcha

Si alguien viene con problemas (entrada perdida, QR roto, etc.) entra al panel admin desde el móvil:

- Filtra por código.
- Pulsa **Reactivar** para deshacer una validación o **Marcar usada** manualmente.
- O **✕** para borrar una entrada.

---

## Archivos del proyecto

```
graduacion-qr/
├── index.html        Página de inicio (elige admin o escanear)
├── admin.html        Panel de administración
├── scan.html         Escáner para móvil
├── config.js         ← TU configuración Firebase aquí
├── style.css         Estilos compartidos
├── firestore.rules   Reglas de seguridad para pegar en la consola
└── README.md         Este archivo
```

---

## Coste

Plan **Spark (gratis)** de Firebase, límites diarios:

- Firestore: 50 000 lecturas y 20 000 escrituras al día.
- Authentication: 10 000 usuarios.
- Hosting: 10 GB de transferencia al mes.

Para una graduación con ~300 entradas y unos cientos de escaneos en una noche, vas sobrado.

---

## Notas técnicas

- Los QRs contienen **solo el código** (`ENT-XXXXXX`), nada más. No exponen datos personales.
- El campo `usada` se actualiza con `updateDoc`. Firestore lo aplica de forma atómica, así que aunque dos móviles escaneen el mismo QR a la vez, uno verá `usada=false` y el otro `usada=true` cuando lea.
- Si quieres una garantía aún más fuerte contra dobles validaciones simultáneas, se puede migrar a una **transacción de Firestore** (`runTransaction`) que comprueba y escribe en un solo paso. En la práctica, con 1-2 escáneres el caso es muy improbable.
- La librería de escaneo es [html5-qrcode](https://github.com/mebjas/html5-qrcode), MIT.
- La generación de QR en el PDF usa [qrcodejs](https://github.com/davidshimjs/qrcodejs) y [jsPDF](https://github.com/parallax/jsPDF), ambos MIT.

---

## Posibles mejoras

- Asociar nombre del alumno/familia a cada entrada (ahora se puede añadir manualmente cambiando el modelo).
- Modo offline (PWA con service worker) por si falla la wifi.
- Roles separados admin/scanner con Custom Claims.
- Exportar resultados a CSV al final del evento.

¡Suerte con la graduación! 🎓
