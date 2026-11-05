# Mantenimiento IPF

Aplicación móvil para que estudiantes y docentes registren desperfectos del Instituto, indiquen dónde están, adjunten evidencia y consulten su resolución. La app usa Expo Router y ofrece alternativas cuando no se concede un permiso.

## Requisitos

- Node.js y npm.
- Expo Go para probar en un teléfono.
- Para permisos nativos y textos de propósito, probar también en una build nativa.

El proyecto usa Expo SDK 58. La consigna menciona SDK 57; se conserva la versión actual del proyecto para no cambiar dependencias nativas y configuración que ya se probaron durante el desarrollo.

## Cómo ejecutar

Desde la carpeta `segundo cuatri/tp3`:

```bash
npm install
npx expo start
```

Para abrir la versión web:

```bash
npx expo start --web
```

Para probar en Expo Go, iniciar Expo y escanear el QR con el teléfono conectado a la misma red. La dirección local que muestra Expo puede cambiar si el puerto habitual está ocupado.

## Rutas

El grupo `(tabs)` organiza las pestañas sin agregar ese segmento a la URL.

```text
src/app/
├── _layout.tsx                 # navegacion principal y rutas modales
├── +not-found.tsx              # ruta no encontrada
├── ajustes-app.tsx             # preferencia de notificaciones
├── modal.tsx                   # modal de la app
├── (tabs)/
│   ├── _layout.tsx             # pestañas inferiores
│   ├── index.tsx               # / lista de reportes
│   ├── avisos.tsx              # /avisos bandeja interna
│   └── permisos.tsx            # /permisos estado de permisos
├── permisos/
│   └── [recurso].tsx           # /permisos/[recurso] pantalla previa
└── reporte/
    ├── nuevo.tsx               # /reporte/nuevo formulario
    ├── escanear.tsx            # /reporte/escanear lector QR
    ├── foto.tsx                # /reporte/foto adjuntar evidencia
    ├── ubicacion.tsx           # /reporte/ubicacion ubicacion o sector manual
    └── [id].tsx                # /reporte/[id] detalle del reporte
```

La lógica compartida está separada de las pantallas:

```text
src/
├── components/                 # componentes reutilizables
├── hooks/
│   ├── usePermiso.ts           # consulta y solicitud de permisos
│   └── useRevisarAlVolver.ts   # reconsulta al volver de Ajustes
└── lib/
    └── reportesStore.ts        # reportes, borrador, avisos y preferencia
```

## Permisos y alternativas

| Recurso | Módulo | Cuándo se solicita | Alternativa |
| --- | --- | --- | --- |
| Cámara | `expo-camera` | Al escanear un QR o elegir sacar una foto. | Escribir el aula a mano; adjuntar una foto desde el selector. |
| Ubicación | `expo-location` | Al tocar «Usar mi ubicación actual», solo en primer plano. | Elegir manualmente un sector del edificio. |
| Notificaciones | `expo-notifications` | Al activar el interruptor de Ajustes de la App. En Android se crea antes el canal `reportes`. | Consultar la bandeja interna `/avisos`. |
| Fotos | `expo-image-picker` | No se pide permiso amplio: se usa el selector del sistema al elegir una foto. | La foto es opcional; se puede continuar sin adjuntarla. |

El hook común informa `cargando`, `concedido`, `preguntable` o `bloqueado`. El panel de permisos permite volver a consultar el estado; esa acción no vuelve a solicitar autorización. Cerrar la app tampoco revoca permisos: para probar de nuevo el diálogo hay que cambiar el permiso desde Ajustes del dispositivo o desde la configuración del sitio en el navegador.

## Configuración nativa

Los plugins de `app.json` configuran los textos de propósito y el acceso mínimo necesario. Este bloque resumido usa comentarios para explicar las decisiones; los comentarios son solo documentación y no se copian al `app.json`, que debe seguir siendo JSON válido.

```jsonc
{
  "plugins": [
    "expo-router",
    [
      "expo-splash-screen",
      {
        "image": "./assets/images/splash-icon.png",
        "resizeMode": "contain",
        "backgroundColor": "#ffffff"
      }
    ],
    [
      "expo-camera",
      {
        "cameraPermission": "Usamos tu cámara para escanear el código QR del aula y sacar fotos del desperfecto.",
        // no grabamos audio al escanear un qr o sacar una foto
        "microphonePermission": false,
        "recordAudioAndroid": false
      }
    ],
    [
      "expo-location",
      {
        "locationWhenInUsePermission": "Usamos tu ubicación para marcar dónde está el desperfecto en el edificio."
      }
    ],
    // elegir una imagen se hace con el selector del sistema
    [
      "expo-image-picker",
      {
        "photosPermission": "Usamos tus fotos seleccionadas para adjuntar la foto del desperfecto."
      }
    ],
    "expo-notifications"
  ],
  "android": {
    "blockedPermissions": [
      // la app no graba voz ni audio
      "android.permission.RECORD_AUDIO",
      // la app no muestra ventanas sobre otras aplicaciones
      "android.permission.SYSTEM_ALERT_WINDOW"
    ]
  }
}
```

- `RECORD_AUDIO` se bloquea porque la app no graba audio.
- `SYSTEM_ALERT_WINDOW` se bloquea porque la app no dibuja ventanas sobre otras aplicaciones.
- La cámara no solicita micrófono: leer un QR o sacar una foto no requiere grabar sonido.
- El selector del sistema permite elegir una foto sin pedir acceso amplio a toda la galería.

El archivo completo y vigente es `app.json`.

## 