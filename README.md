# 🎓 Sistema de Entradas con QR — Graduación IES Blanca Fernández Ochoa

App web ligera para emitir y validar entradas con código QR. Pensada para la graduación del instituto: se imprimen las entradas con su QR único, se reparten a las familias, y el día del evento se escanean desde uno o varios móviles. **No permite duplicados**: si un QR ya se ha usado, el escáner avisa.

Todo el sistema funciona con servicios gratuitos (plan Spark de Firebase).

🔗 **Web en producción:** https://iesblancafernandezochoa.github.io/graduacion/

---

## 📐 Arquitectura

| Capa | Tecnología |
|---|---|
| **Frontend** | HTML + JavaScript puro (sin frameworks). Funciona como web app desde cualquier navegador moderno (móvil incluido). |
| **Backend / Base de datos** | Firebase Firestore — NoSQL en la nube, sincroniza en tiempo real entre los móviles. |
| **Autenticación** | Firebase Authentication (email + contraseña). |
| **Hosting** | GitHub Pages (HTTPS gratuito). |

### Modelo de datos

Una sola colección en Firestore, `entradas`, con documentos así:

```
entradas/ENT-A7B3K9
├─ usada:    false
├─ usadaEn:  null
└─ creada:   "2026-04-29T10:23:11.000Z"
```

El ID del documento es el propio código de la entrada (lo que va dentro del QR).

---

## 📁 Archivos del proyecto

```
graduacion/
├── index.html        → Página de inicio (elige admin o escanear)
├── admin.html        → Panel de administración
├── scan.html         → Escáner para móvil
├── config.js         → Configuración Firebase (tu firebaseConfig aquí)
├── style.css         → Estilos compartidos
├── firestore.rules   → Reglas de seguridad para pegar en la consola
└── README.md         → Este archivo
```

---

## ⚙️ Configuración paso a paso

### 1. Crear el proyecto en Firebase (5 min)

1. Entra en https://console.firebase.google.com con tu cuenta de Google.
2. **Crear proyecto** → nombre: `graduacion-ies`. Puedes desactivar Google Analytics si no lo necesitas.
3. Una vez dentro del proyecto, en el menú izquierdo:
   - `Build → Authentication → Comenzar` → pestaña **Sign-in method** → habilita **Correo electrónico/contraseña**.
   - `Build → Firestore Database → Crear base de datos` → **modo producción** → región **eur3 (europe-west)**.

### 2. Crear el usuario administrador

1. En `Authentication → Users → Añadir usuario`.
2. Crea un usuario, por ejemplo:
   - **Email:** `admin@graduacion.es`
   - **Contraseña:** una contraseña fuerte.
3. Este usuario se usará tanto en el panel de admin como en los móviles que escanean.

> 💡 Si necesitas que alguien solo escanee en la puerta, crea otro usuario adicional con otra contraseña. Los permisos son los mismos (los controla `firestore.rules`).

### 3. Pegar las reglas de Firestore

1. Abre `firestore.rules` de este proyecto y copia su contenido.
2. En la consola de Firebase: `Firestore Database → Reglas`.
3. Pega las reglas y pulsa **Publicar**.

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /entradas/{entradaId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 4. Obtener tu configuración Firebase

1. En la consola: **⚙️ Configuración del proyecto** → **Tus apps** → icono `</>` (Web).
2. Registra una app (cualquier nombre, p. ej. `graduacion-web`).
3. **No** marques Firebase Hosting.
4. Copia **solo** el bloque `firebaseConfig`.

### 5. Configurar `config.js`

Edita el archivo `config.js` y pega tu configuración.

> ⚠️ **Importante:** pega **solo** el objeto `window.firebaseConfig`. **NO** pegues las líneas `import { initializeApp }...` de la consola de Firebase. Este proyecto usa CDN, no módulos ES.

```javascript
window.firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "graduacion-ies.firebaseapp.com",
  projectId: "graduacion-ies",
  storageBucket: "graduacion-ies.firestorage.app",
  messagingSenderId: "...",
  appId: "...",
  measurementId: "..."
};

window.NOMBRE_EVENTO = "Graduación 2026 · IES Blanca Fernández Ochoa";
```

### 6. Desplegar en GitHub Pages

1. Sube el proyecto al repositorio de GitHub.
2. Ve a `Settings → Pages`.
3. Configura:
   - **Source:** Deploy from a branch
   - **Branch:** `main`
   - **Folder:** `/ (root)`
4. Pulsa **Save**.
5. En 1-2 minutos tu web estará en:

```
https://iesblancafernandezochoa.github.io/graduacion/
```

> 💡 El escáner pide acceso a la cámara y eso **solo funciona sobre HTTPS**. GitHub Pages lo proporciona de serie.

### 7. Autorizar el dominio en Authentication

1. En la consola: `Authentication → Settings → Authorized domains`.
2. Comprueba que aparece:
   ```
   iesblancafernandezochoa.github.io
   ```
3. Si no aparece, pulsa **Añadir dominio** y añádelo.

---

## 🚀 Uso

### Antes del evento (admin)

1. Abre https://iesblancafernandezochoa.github.io/graduacion/admin.html en el ordenador.
2. Inicia sesión con el usuario admin que creaste.
3. Indica el número de entradas que necesitas (p. ej. 250) y pulsa **Crear N entradas**.
4. Pulsa 📄 **Descargar PDF imprimible** → genera un PDF A4 con 10 entradas por página, cada una con su QR y su código.
5. Imprime y recorta. Reparte a las familias.

### El día del evento (puerta)

1. Cada persona que vaya a escanear abre la web en su móvil → **Escanear entradas**.
2. Inicia sesión la primera vez (la sesión queda guardada).
3. Apunta la cámara al QR de la entrada. La app responde:

| Resultado | Significado |
|---|---|
| ✅ Verde + sonido agudo | Entrada válida (se marca como usada automáticamente) |
| 🔴 Rojo + sonido grave | Entrada **YA usada** antes (te dice a qué hora) |
| 🟡 Ámbar | Código no existe en la base de datos (entrada falsa) |

4. Si necesitas pausar la cámara → botón ⏸ **Pausar**.
5. Si tu móvil tiene varias cámaras → 🔄 **Cambiar cámara**.

> 📡 Todos los móviles ven los mismos datos en tiempo real. Aunque escaneéis dos personas a la vez, no se puede colar una entrada repetida.

### Edición sobre la marcha

Si alguien viene con problemas (entrada perdida, QR roto, etc.) entra al panel admin desde el móvil:

- **Filtra** por código.
- Pulsa **Reactivar** para deshacer una validación.
- Pulsa **Marcar usada** manualmente.
- Pulsa **✕** para borrar una entrada.

---

## 💰 Coste

Plan **Spark (gratis)** de Firebase, límites diarios:

| Servicio | Límite gratuito |
|---|---|
| Firestore lecturas | 50.000 / día |
| Firestore escrituras | 20.000 / día |
| Authentication | 10.000 usuarios |
| Hosting (GitHub Pages) | Ilimitado para repos públicos |

Para una graduación con ~300 entradas y unos cientos de escaneos en una noche, **vas sobrado**.

---

## 🔧 Notas técnicas

- Los QRs contienen **solo el código** (`ENT-XXXXXX`), nada más. No exponen datos personales.
- El campo `usada` se actualiza con `updateDoc`. Firestore lo aplica de forma **atómica**, así que aunque dos móviles escaneen el mismo QR a la vez, uno verá `usada=false` y el otro `usada=true`.
- Si quieres una garantía aún más fuerte contra dobles validaciones simultáneas, se puede migrar a una **transacción de Firestore** (`runTransaction`). En la práctica, con 1-2 escáneres el caso es muy improbable.
- El proyecto usa **CDN** para cargar Firebase (no módulos npm). Por eso `config.js` usa `window.firebaseConfig` en lugar de `import`.

### Librerías utilizadas

| Librería | Uso | Licencia |
|---|---|---|
| [html5-qrcode](https://github.com/mebjas/html5-qrcode) | Escaneo de QR con la cámara | MIT |
| [qrcodejs](https://github.com/davidshimjs/qrcodejs) | Generación de QR en el PDF | MIT |
| [jsPDF](https://github.com/parallax/jsPDF) | Generación del PDF imprimible | MIT |

---

## 💡 Posibles mejoras

- [ ] Asociar **nombre del alumno/familia** a cada entrada.
- [ ] **Modo offline** (PWA con service worker) por si falla la wifi.
- [ ] **Roles separados** admin/scanner con Custom Claims.
- [ ] **Exportar resultados** a CSV al final del evento.
- [ ] **Deploy automático** con GitHub Actions + Firebase Hosting.
- [ ] **Dominio personalizado** del instituto.

---

## 📋 Checklist de puesta en marcha

```
[ ] Proyecto Firebase creado (graduacion-ies)
[ ] Authentication habilitado (email/contraseña)
[ ] Usuario admin creado
[ ] Firestore Database creado (eur3)
[ ] Reglas de Firestore publicadas
[ ] config.js configurado (sin imports)
[ ] GitHub Pages activado
[ ] Dominio autorizado en Authentication
[ ] Login funcionando
[ ] Crear entradas de prueba
[ ] Descargar PDF de prueba
[ ] Escanear QR desde móvil
[ ] Verificar detección de duplicados
```

---

¡Suerte con la graduación! 🎓🎉
