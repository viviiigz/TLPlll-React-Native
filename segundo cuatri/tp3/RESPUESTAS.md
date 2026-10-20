# TP3 - Permisos moviles

Respuestas de las Partes A a F. La idea principal es pedir cada permiso cuando
se necesita una funcion concreta y ofrecer una alternativa si la persona no lo
concede.

## Parte A - Que es un permiso y por que existe

### A1. Conceptos

**a) Que es un permiso? Que papel cumplen la app, el sistema operativo y la persona usuaria?**

Un permiso es una autorizacion para que una app acceda a un recurso protegido
del dispositivo, como la camara, la ubicacion o los contactos. La app declara
que podria necesitarlo y lo solicita cuando va a usar esa funcion. El sistema
operativo controla el acceso y muestra la solicitud. La persona decide si lo
concede o no.

**b) Que es la caja de arena (sandbox) y que relacion tiene con los permisos? Que puede hacer una app sin ningun permiso?**

La sandbox es el espacio aislado donde se ejecuta una app. Evita que una app
acceda libremente a los datos de otras apps o a recursos protegidos del
dispositivo. Sin permisos especiales una app todavia puede mostrar pantallas,
guardar sus propios datos y usar funciones que no requieren autorizacion.

**c) Nombra cuatro razones por las que existen los permisos y da un ejemplo de cada una.**

- **Privacidad:** impedir que una app lea contactos o fotos sin autorizacion.
- **Seguridad:** limitar el acceso a la camara o al microfono.
- **Control de la persona:** permitir aceptar, rechazar o cambiar accesos.
- **Transparencia y responsabilidad:** hacer que la app explique para que
  necesita un dato, por ejemplo usar la ubicacion para mostrar puntos de
  reciclaje cercanos.

**d) En la analogia del portero del edificio, quien es la visita, el portero y el dueño? Que significa que el portero se acuerda de la respuesta?**

La visita es la app, el portero es el sistema operativo y el dueño es la persona
usuaria. Que el portero recuerde la respuesta significa que el sistema conserva
la decision y la usa en solicitudes posteriores. Segun la plataforma y el
permiso, la persona puede cambiarla desde Ajustes o recibir otra oportunidad
de responder.

### A2. Declarar y solicitar

| Pregunta | Declarar (al compilar) | Solicitar (al ejecutar) |
| --- | --- | --- |
| Que se hace? | Se indica que recursos podria usar la app y se agregan los textos de proposito necesarios. | Se consulta el estado y, cuando la persona inicia la funcion, se pide autorizacion. |
| Android | Se agrega al `AndroidManifest.xml`; en Expo se configura en `app.json` o mediante plugins. | Se usa la API de permisos del modulo Expo correspondiente. El sistema muestra el dialogo cuando corresponde. |
| iOS | Se agregan las claves de proposito al `Info.plist`; en Expo se configuran normalmente mediante plugins en `app.json`. | El modulo Expo consulta o solicita el permiso. iOS muestra el dialogo del sistema. |
| Expo | `app.json` o `app.config.ts` y la configuracion de los plugins generan la configuracion nativa. | Se usan los modulos como `expo-camera`, `expo-location` y `expo-notifications`. |
| Que pasa si se omite? | El acceso puede no funcionar; iOS puede cerrar la app si falta un texto de proposito y Android no concede un permiso que no figure en el manifiesto. | La app no tiene acceso hasta que se concede el permiso y debe ofrecer una alternativa. |

### A3. Verdadero o falso

**a) Falso.** El dialogo lo presenta el sistema operativo. La app puede mostrar
antes una explicacion propia, pero no reemplaza el dialogo oficial.

**b) Verdadero.** En un proyecto Expo administrado se configura en
`app.json` o `app.config.ts`; el manifiesto nativo se genera a partir de esa
configuracion.

**c) Falso.** Un cambio en `Info.plist` es nativo y requiere una nueva
compilacion. No se puede incorporar con una actualizacion OTA.

**d) Falso.** Si el permiso no esta declarado en el manifiesto, pedirlo desde
el codigo no hace que Android agregue esa declaracion ni garantiza que aparezca
el dialogo.

**e) Falso.** `expo-permissions` esta obsoleto. En SDK 57 se usan las funciones
de permisos de cada modulo, por ejemplo `expo-camera` o `expo-location`.

**f) Verdadero.** Con acceso limitado a fotos el estado puede figurar como
concedido. La app debe revisar `accessPrivileges` para saber que el acceso es
limitado.

**g) Falso.** Reinstalar no es una forma universal ni confiable de restablecer
el estado. En iOS la decision puede conservarse; para probar se deben usar los
controles de Ajustes o las herramientas de simulador adecuadas.

### A4. Los estados de un permiso

**a) Diagrama de estados**

```text
Sin decidir
    | la app solicita
    +---- concedido
    |
    +---- denegado pero se puede volver a pedir
    |          | la app solicita otra vez
    |          +---- concedido
    |          +---- bloqueado / no volver a preguntar
    |
    +---- denegado y bloqueado
               | la persona cambia el permiso en Ajustes
               +---- concedido o vuelve a denegado
```

La diferencia central es que Android puede permitir volver a preguntar despues
de un rechazo y puede dejar de mostrar el dialogo despues de varios rechazos.
iOS normalmente muestra el dialogo del sistema una sola vez por decision; si
se rechaza, para cambiarla hay que ir a Ajustes.

**b) Valores tipicos de Expo**

| Estado | `status` | `canAskAgain` | Puede aparecer el dialogo? |
| --- | --- | --- | --- |
| Sin decidir | `undetermined` | `true` | Si, al solicitarlo. |
| Concedido | `granted` | normalmente `true` | No hace falta solicitarlo. |
| Denegado, se puede volver a pedir | `denied` | `true` | Si. |
| Bloqueado | `denied` | `false` | No; hay que ofrecer Ajustes. |

Los valores exactos dependen del permiso y la plataforma. La app debe consultar
la respuesta real y no asumirla.

## Parte B - Android: tipos de permisos y manifiesto

### B1. Clasificacion de permisos

| Permiso | Tipo | Como se obtiene |
| --- | --- | --- |
| `INTERNET` | Instalacion | Se declara en el manifiesto. No muestra dialogo runtime. |
| `CAMERA` | Tiempo de ejecucion | Se declara y se solicita cuando la persona usa la camara. |
| `VIBRATE` | Instalacion | Se declara; normalmente no requiere dialogo. |
| `SYSTEM_ALERT_WINDOW` | Especial | Se declara y la persona debe habilitarlo en una pantalla especial de Ajustes. No se concede como un permiso runtime normal. |
| `POST_NOTIFICATIONS` | Tiempo de ejecucion | En Android 13 o posterior se solicita; es mejor hacerlo en contexto. |
| `ACCESS_NETWORK_STATE` | Instalacion | Se declara y no muestra dialogo runtime. |
| `READ_CONTACTS` | Tiempo de ejecucion | Se declara y se solicita antes de leer contactos. |
| `SCHEDULE_EXACT_ALARM` | Especial | Se habilita desde una pantalla de acceso especial de Ajustes en las versiones que lo exigen. |
| `RECORD_AUDIO` | Tiempo de ejecucion | Se declara y se solicita antes de grabar o usar sonido de la camara. |
| `MANAGE_EXTERNAL_STORAGE` | Especial | Acceso amplio que requiere habilitacion especial y esta fuertemente restringido por Google Play. |

### B2. Grupos y nombres

**a)** Un grupo reune permisos relacionados y puede permitir que el sistema
presente una decision conjunta. Si la app pide ubicacion aproximada y precisa
juntas, la persona normalmente ve un solo dialogo de ubicacion, con opciones
segun la version de Android.

**b)** El nombre completo lleva el prefijo `android.permission.`. El permiso
de camara es `android.permission.CAMERA`.

**c)** Los permisos `signature` se conceden a apps firmadas con el mismo
certificado que la app que define el permiso (o bajo condiciones del sistema).
No sirven para apps comunes porque una app de terceros no controla la firma de
Android ni la de otras apps.

### B3. Leer el manifiesto

**a)** `INTERNET` se concede sin dialogo al instalar. `CAMERA`,
`ACCESS_COARSE_LOCATION`, `ACCESS_FINE_LOCATION` y `POST_NOTIFICATIONS` deben
estar declarados y ademas pueden requerir una solicitud runtime, segun la
version de Android. `READ_EXTERNAL_STORAGE` era un permiso runtime en las
versiones aplicables. La entrada de `RECORD_AUDIO` se elimina por
`tools:node="remove"`.

**b)** `android:maxSdkVersion="32"` limita esa declaracion a Android API 32 y
anteriores. Desde Android 13 (API 33), el acceso a fotos y videos se separa en
`READ_MEDIA_IMAGES` y `READ_MEDIA_VIDEO`; desde Android 14 tambien puede haber
acceso parcial. Para elegir una sola imagen conviene usar el selector del
sistema y no pedir acceso amplio.

**c)** `tools:node="remove"` elimina del manifiesto final una entrada que una
libreria o manifiesto incluido habia agregado. En `app.json` se puede pedir
asi:

```json
{
  "expo": {
    "android": {
      "blockedPermissions": [
        "android.permission.RECORD_AUDIO"
      ]
    }
  }
}
```

Tambien se puede configurar un plugin para que no agregue ese permiso cuando
el modulo lo permite.

**d)** Un permiso especial que no agrega ninguna libreria se declara en
`expo.android.permissions`:

```json
{
  "expo": {
    "android": {
      "permissions": [
        "android.permission.SCHEDULE_EXACT_ALARM"
      ]
    }
  }
}
```

Declararlo no concede el acceso especial; la persona debe habilitarlo donde
corresponda.

**e)** No conviene editar a mano el manifiesto generado porque Expo Prebuild
puede regenerarlo y perder los cambios. Se configura en `app.json` o en un
config plugin. `blockedPermissions` modifica el manifiesto de la app compilada;
no puede cambiar el manifiesto de Expo Go, que pertenece a la app Expo Go.

### B4. Asi pregunta Android

**a)** No se puede insertar texto libre propio dentro del dialogo estandar de
Android. Hay que explicar el beneficio antes de solicitar el permiso, en una
pantalla de la app y cerca de la funcion que lo necesita.

**b)** “Mientras la app esta en uso” concede acceso cuando la app esta activa.
“Solo esta vez” concede un acceso temporal y la persona podria tener que volver
a autorizar mas adelante. La opcion de una sola vez esta disponible para
permisos como ubicacion y, segun la version, camara o microfono; no es igual en
todas las versiones ni para todos los permisos.

**c)** En Android 11 (API 30) o posterior, dos rechazos pueden hacer que el
sistema trate la decision como “no volver a preguntar”. La respuesta suele ser
`canAskAgain: false`; la app debe dejar de insistir y ofrecer Ajustes.

**d)** Una funcion que ordena lugares por zona o muestra puntos de reciclaje
cercanos puede funcionar con ubicacion aproximada. La navegacion giro a giro
hacia una puerta o el marcado exacto de donde esta una persona necesita mayor
precision.

**e)** Android puede terminar el proceso de la app cuando se revoca un permiso
que la app estaba usando. Al volver del fondo hay que consultar de nuevo el
estado y no asumir que el permiso sigue concedido.

### B5. Android, version por version

| Cambio | Version / API | Que implica para el codigo |
| --- | --- | --- |
| Nacen los permisos en tiempo de ejecucion | Android 6.0 / API 23 | Declarar permisos peligrosos y pedirlos en contexto durante la ejecucion. |
| La ubicacion en segundo plano pasa a ser un permiso aparte | Android 10 / API 29 | Pedir primero ubicacion en primer plano y despues, solo si hace falta, la de segundo plano. |
| Dos rechazos pueden equivaler a “no volver a preguntar” | Android 11 / API 30 | Consultar `canAskAgain` y ofrecer Ajustes cuando el sistema ya no muestra el dialogo. |
| Ubicacion precisa o aproximada | Android 12 / API 31 | Aceptar ambas opciones y adaptar la experiencia si la persona elige aproximada. |
| Las notificaciones pasan a ser un permiso (`POST_NOTIFICATIONS`) | Android 13 / API 33 | Pedir el permiso en contexto; en Android 12 o anterior no aparece este dialogo runtime. |
| Acceso parcial a fotos y videos (“Seleccionar fotos”) | Android 14 / API 34 | No asumir acceso a toda la galeria; usar el selector o soportar acceso limitado. |
| Permiso de red local (`ACCESS_LOCAL_NETWORK`) | Android 17 / API 37 | Para descubrir o contactar dispositivos de la red local, usar el selector de dispositivos del sistema o declarar y solicitar este permiso runtime. |

El `targetSdkVersion` (nivel de API objetivo) indica a Android y a las tiendas
que comportamiento moderno de la plataforma adopta la app. Expo SDK 57 apunta
a Android API 36. Desde el 31 de agosto de 2026 Google Play exige API 36 o
posterior para apps nuevas y actualizaciones generales, con excepciones para
algunas categorias de dispositivos.

## Parte C - iOS: textos de proposito y acceso parcial

### C1. Claves del Info.plist

| Recurso | Clave |
| --- | --- |
| Camara | `NSCameraUsageDescription` |
| Microfono | `NSMicrophoneUsageDescription` |
| Ubicacion en uso | `NSLocationWhenInUseUsageDescription` |
| Ubicacion siempre | `NSLocationAlwaysAndWhenInUseUsageDescription` y tambien la descripcion de ubicacion en uso que corresponda. |
| Fotos (leer) | `NSPhotoLibraryUsageDescription` |
| Fotos (solo guardar) | `NSPhotoLibraryAddUsageDescription` |
| Contactos | `NSContactsUsageDescription` |
| Face ID | `NSFaceIDUsageDescription` |
| Rastreo entre apps (ATT) | `NSUserTrackingUsageDescription` |
| Notificaciones | No tiene una clave de proposito equivalente en `Info.plist`; se solicita con la API de notificaciones. |

### C2. Sin texto, no hay permiso

**a)** Si falta `NSCameraUsageDescription` y la app intenta usar la camara, iOS
puede cerrar la app por acceder a datos protegidos sin una descripcion. Al subir
la build, App Store Connect puede rechazarla con el error `ITMS-90683` por
faltar una cadena de proposito.

**b)** iOS muestra normalmente el dialogo de un permiso una sola vez. Si la
persona dice que no, la app no puede forzar otro dialogo; debe explicar como
cambiarlo en Ajustes y ofrecer una alternativa.

**c)** El sistema arma el dialogo y los botones; el texto de proposito lo
escribe quien desarrolla. En Expo se configura en `app.json` o
`app.config.ts`, normalmente mediante las opciones del plugin de cada modulo.

**d)** Una dependencia puede declarar una API protegida aunque nuestra app no
la llame directamente. Apple revisa tambien las capacidades y declaraciones
que llegan desde las dependencias. Hay que identificar la dependencia y su
configuracion, eliminar o desactivar la capacidad que no se usa, o agregar el
texto de proposito correcto si la funcion si se necesita.

### C3. Probador de textos de proposito

| Texto propuesto | Aprobado? | Version mejorada |
| --- | --- | --- |
| “Necesitamos tu ubicacion.” | No. No explica el beneficio. | “Usamos tu ubicacion para mostrarte los puntos de reciclaje cercanos.” |
| “Para mejorar tu experiencia.” | No. Es demasiado general. | “Usamos tu ubicacion para mostrarte las farmacias de turno mas cercanas.” |
| “Usamos tu ubicacion para mostrarte las farmacias de turno mas cercanas.” | Si. Explica el dato y el beneficio concreto. | No hace falta. |
| “La app no funciona sin ubicacion.” | No. No explica un uso concreto y afirma que la app no funciona aunque deberia ofrecer una alternativa. | “Usamos tu ubicacion para indicar donde se encuentra el desperfecto; tambien podes elegir el sector manualmente.” |
| “Ubicacion requerida por el sistema.” | No. No explica para que la necesita la app. | “Usamos tu ubicacion para marcar el lugar del desperfecto en el reporte.” |

### C4. Acceso parcial y gradual

| Caso | Desde que version de iOS | En Expo |
| --- | --- | --- |
| Fotos limitadas (“Seleccionar fotos”) | iOS 14 | `expo-image-picker`; revisar `accessPrivileges` en la respuesta del permiso de biblioteca. El selector del sistema puede evitar pedir acceso amplio para elegir una imagen. |
| Ubicacion aproximada (interruptor “Precisa”) | iOS 14 | `expo-location`; revisar `ios.accuracy` en la respuesta de permiso (`full` o `reduced`). |
| “Permitir una vez” para ubicacion | iOS 13 | `requestForegroundPermissionsAsync()`; es una autorizacion temporal de ubicacion en primer plano. |
| Ubicacion escalonada de “al usar la app” a “Siempre” | iOS 13 | Primero pedir `requestForegroundPermissionsAsync()`; despues, si una funcion real lo justifica, pedir `requestBackgroundPermissionsAsync()`. |
| Notificaciones provisionales | iOS 12 | `expo-notifications` con `requestPermissionsAsync({ ios: { allowProvisional: true } })`; revisar el detalle de iOS en la respuesta para distinguir el estado provisional cuando se informa. |

### C5. Android vs iOS, lado a lado

| Tema | Android | iOS |
| --- | --- | --- |
| Donde se declara | `AndroidManifest.xml`; en Expo se configura en `app.json` y plugins. | `Info.plist`; en Expo se configura mediante `app.json` y plugins. |
| Texto en el dialogo | El dialogo tiene texto controlado por Android. La app explica el beneficio antes de pedirlo. | El sistema arma el dialogo y muestra la descripcion que se configura para el permiso. |
| Oportunidades para preguntar | Puede dejar repetir el pedido; despues de varios rechazos puede bloquearlo. | Normalmente el dialogo del sistema aparece una vez; despues la persona debe ir a Ajustes. |
| “Solo esta vez” / “Permitir una vez” | Android ofrece acceso de una sola vez para algunos permisos y versiones. | iOS ofrece “Permitir una vez” para ciertos permisos, como ubicacion en primer plano. |
| Notificaciones | Desde Android 13 (API 33) se pide `POST_NOTIFICATIONS`; en Android se crea el canal correspondiente. | Se pide con `expo-notifications`; puede haber autorizacion provisional. |
| Ubicacion en segundo plano | Es un permiso separado; se pide despues del permiso de primer plano. | Requiere declarar el modo y el proposito adecuados; se pide despues de explicar el uso y obtener acceso en primer plano. |
| Si falta la declaracion | Android no concede el permiso y puede no mostrar un dialogo util. | Intentar usar el recurso sin la clave de proposito puede cerrar la app; la tienda tambien puede rechazar la build. |

## Parte D - Expo: una API, dos plataformas

### D1. Modulos y funciones

| Necesidad | Modulo Expo | Hook / funcion |
| --- | --- | --- |
| Escanear un QR con la camara | `expo-camera` | `useCameraPermissions()` |
| Grabar video con sonido | `expo-camera` | `useCameraPermissions()` y permiso de microfono; habilitar microfono en la configuracion nativa. |
| Mostrar farmacias cercanas | `expo-location` | `useForegroundPermissions()` o `requestForegroundPermissionsAsync()` |
| Seguir un envio en segundo plano | `expo-location` | `requestForegroundPermissionsAsync()` y despues `requestBackgroundPermissionsAsync()` |
| Mostrar un recordatorio | `expo-notifications` | `getPermissionsAsync()` / `requestPermissionsAsync()` |
| Grabar una nota de voz | `expo-audio` | `requestRecordingPermissionsAsync()` |
| Galeria propia dentro de la app | `expo-image-picker` | `useMediaLibraryPermissions()` o `requestMediaLibraryPermissionsAsync()` |
| Publicidad personalizada entre apps (iOS) | `expo-tracking-transparency` | `requestTrackingPermissionsAsync()` |

Un tutorial que importa `expo-permissions` esta desactualizado para este
trabajo. Desde SDK 57 se usa la API de permisos del modulo que necesita el
recurso.

### D2. Consultar, pedir y el hook

**a)** `getForegroundPermissionsAsync()` consulta el estado actual y no muestra
un dialogo. `requestForegroundPermissionsAsync()` solicita acceso y puede
mostrarlo si el sistema permite preguntar.

**b)** El hook devuelve el estado actual, una funcion para pedir y otra para
consultar. En el primer render el estado puede ser `null` mientras se carga; la
pantalla debe mostrar un indicador de carga y no suponer que ya esta concedido
o denegado.

**c)** Si `canAskAgain` es `false`, llamar de nuevo a `request...()` no vuelve a
mostrar el dialogo. Hay que ofrecer abrir Ajustes. Llamar en un bucle puede
dejar la pantalla trabada, repetir solicitudes inutiles y generar una mala
experiencia.

### D3. Leer la respuesta

| Respuesta | Que deberia hacer la app |
| --- | --- |
| `null` | Mostrar carga mientras obtiene la respuesta; no iniciar la funcion protegida. |
| `{ status: 'granted', granted: true }` | Usar el recurso solicitado. |
| `{ status: 'undetermined', canAskAgain: true }` | Explicar el beneficio y pedirlo cuando la persona inicie esa funcion. |
| `{ status: 'denied', canAskAgain: true }` | Ofrecer una explicacion y permitir que la persona elija volver a intentarlo. |
| `{ status: 'denied', canAskAgain: false }` | No insistir; ofrecer abrir Ajustes y una alternativa. |
| `{ status: 'granted', accessPrivileges: 'limited' }` | Usar solo los elementos autorizados y explicar como seleccionar mas si hace falta. |
| `{ status: 'granted', android: { accuracy: 'coarse' } }` | Usar ubicacion aproximada; no presentar coordenadas como si fueran exactas. |

Los dos campos mas importantes son `status` (si esta concedido, denegado o sin
decidir) y `canAskAgain` (si el sistema puede volver a mostrar el dialogo).
Para casos parciales tambien hay que mirar `accessPrivileges` o la precision.

### D4. Simulacion del ciclo completo

**Android 14, app recien instalada**

| Paso | Resultado | Dialogo |
| --- | --- | --- |
| 1. `getForegroundPermissionsAsync()` | `undetermined`; `canAskAgain: true` | No. |
| 2. Solicitar y tocar “No permitir” | `denied`; normalmente `canAskAgain: true` tras el primer rechazo | Si, era el primer pedido. |
| 3. Solicitar otra vez y tocar “No permitir” | `denied`; en Android 11 o posterior puede quedar `canAskAgain: false` | Aparece esta vez; despues el sistema puede bloquear nuevos pedidos. |
| 4. Solicitar otra vez | Sigue denegado y bloqueado | No; la app debe llevar a Ajustes. |
| 5. Habilitar en Ajustes y consultar al volver | `granted` | No hace falta dialogo. |
| 6. Volver sin consultar | La app conserva una respuesta vieja y no sabe que el permiso cambio | Debe consultar al volver; no mostrar un estado actualizado sin leerlo. |

**iOS, pasos 1 a 4:** el paso 1 comienza en `undetermined`. En el paso 2 la
persona responde al primer dialogo. Si deniega, queda en `denied` y
`canAskAgain` normalmente es `false`. Por eso el paso 3 cambia respecto de
Android: iOS no muestra el mismo dialogo otra vez y se debe ir a Ajustes. El
paso 4 sigue sin dialogo hasta que cambie la decision en Ajustes.

Si la persona elige “Permitir una vez” para ubicacion, la autorizacion es
temporal. Al finalizar la sesion puede expirar y la proxima vez la app debe
consultar de nuevo y, si hace falta, volver a pedirla.

### D5. Configurar app.json

```json
{
  "expo": {
    "plugins": [
      [
        "expo-camera",
        {
          "cameraPermission": "Usamos tu camara para leer el codigo QR del aula.",
          "microphonePermission": false,
          "recordAudioAndroid": false
        }
      ],
      [
        "expo-location",
        {
          "locationWhenInUsePermission": "Usamos tu ubicacion para mostrar puntos de reciclaje cercanos."
        }
      ]
    ],
    "android": {
      "blockedPermissions": [
        "android.permission.SYSTEM_ALERT_WINDOW",
        "android.permission.RECORD_AUDIO"
      ]
    }
  }
}
```

La app pide ubicacion solo en primer plano. `expo-camera` incluye soporte de
sonido por defecto en Android, por eso se desactiva `recordAudioAndroid`; en
iOS se establece `microphonePermission: false`. `blockedPermissions` impide
que el permiso de superposicion quede en el manifiesto generado.

### D6. Expo Go no es tu app

**a)** Los textos de proposito no aparecen como propios porque Expo Go es una
app nativa ya compilada con su propio `Info.plist` y manifiesto. La
configuracion del proyecto no modifica esa app instalada.

**b)** En Expo Go se pueden probar muchos flujos de camara, ubicacion en primer
plano, selector del sistema y notificaciones locales. Las notificaciones push
remotas en Android y los permisos o capacidades que necesitan configuracion
nativa propia requieren una development build. La ubicacion en segundo plano
tambien debe validarse en una build configurada para la app.

**c)** Para generar y revisar el proyecto nativo y compilar Android:

```bash
npx expo prebuild --platform android
npx expo run:android
```

**d)** Para Android se puede revocar un permiso de prueba con `adb shell pm
revoke <package> android.permission.CAMERA`; para borrar tambien el estado de
decision se pueden limpiar las flags con `adb shell pm clear-permission-flags
<package> android.permission.CAMERA user-set user-fixed`. Para el simulador de
iOS se puede restablecer privacidad con:

```bash
xcrun simctl privacy booted reset all <bundle-id>
```

## Parte E - Recetas: leer y corregir codigo

### E1. Encontrar los errores (camara)

Problemas del ejemplo: no contempla que el permiso todavia esta cargando; solo
distingue concedido y no concedido; no revisa `canAskAgain`; y no ofrece una
alternativa si la persona rechaza el permiso o lo bloquea.

Una version con los cuatro estados podria ser:

```tsx
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Button, Linking, Text, View } from 'react-native';
import { router } from 'expo-router';

export default function Escanear() {
  const [permiso, pedirPermiso] = useCameraPermissions();

  if (permiso === null) {
    return <Text>Consultando permiso de camara...</Text>;
  }

  if (permiso.granted) {
    return <CameraView style={{ flex: 1 }} facing="back" />;
  }

  if (permiso.canAskAgain) {
    return (
      <View>
        <Text>Usamos la camara para leer el QR del aula.</Text>
        <Button title="Continuar" onPress={() => void pedirPermiso()} />
        <Button
          title="Escribir el codigo del aula"
          onPress={() => router.back()}
        />
      </View>
    );
  }

  return (
    <View>
      <Text>
        El acceso a la camara esta bloqueado. Podes habilitarlo en Ajustes o
        escribir el codigo del aula.
      </Text>
      <Button title="Abrir Ajustes" onPress={() => void Linking.openSettings()} />
      <Button
        title="Escribir el codigo del aula"
        onPress={() => router.back()}
      />
    </View>
  );
}
```

En un archivo real hay que importar `Linking` desde `react-native` para usar
`Linking.openSettings()`. La ruta alternativa tambien puede navegar a una
pantalla o campo de texto para escribir el aula.

### E2. El orden importa (ubicacion)

**a)** Esta mal pedir primero el permiso de segundo plano. En iOS se debe
obtener primero ubicacion en primer plano; en Android 11 o posterior el sistema
tambien requiere una secuencia gradual y una explicacion para el acceso en
segundo plano.

**b) Funcion corregida**

```ts
import * as Location from 'expo-location';

export async function activarSeguimiento() {
  const enUso = await Location.requestForegroundPermissionsAsync();
  if (!enUso.granted) return false;

  const siempre = await Location.requestBackgroundPermissionsAsync();
  return siempre.granted;
}
```

Solo se debe llamar a esta funcion para una necesidad real de seguimiento
mientras la app esta en segundo plano. Para mostrar farmacias cercanas alcanza
la ubicacion en primer plano; pedir segundo plano para eso seria excesivo.
Google Play exige que el uso en segundo plano sea necesario para la funcion
principal, se explique claramente y cumpla sus politicas de ubicacion.

**c) Obtener ubicacion y marcar si es aproximada**

```ts
import { Platform } from 'react-native';
import * as Location from 'expo-location';

type UbicacionReporte = {
  latitude: number;
  longitude: number;
  aproximada: boolean;
};

export async function obtenerUbicacion(): Promise<UbicacionReporte | null> {
  const permiso = await Location.requestForegroundPermissionsAsync();
  if (!permiso.granted) return null;

  const aproximada =
    (Platform.OS === 'android' && permiso.android?.accuracy === 'coarse') ||
    (Platform.OS === 'ios' && permiso.ios?.accuracy === 'reduced');

  const posicion = await Location.getCurrentPositionAsync({});

  return {
    latitude: posicion.coords.latitude,
    longitude: posicion.coords.longitude,
    aproximada,
  };
}
```

Si la persona deniega, se devuelve `null` para que la pantalla permita elegir
un sector manualmente. En una app de produccion tambien se puede manejar por
separado un error del servicio de ubicacion y mostrar un mensaje; no se debe
presentar ese error como si la persona hubiera denegado el permiso.

### E3. Notificaciones mudas

**a)** En Android 13 (API 33) y posteriores las notificaciones usan
`POST_NOTIFICATIONS`. En Android 14, una causa probable es solicitar antes de
crear un canal de notificaciones. Hay que crear el canal de Android y luego
pedir autorizacion cuando la persona active una funcion que la necesita.

**b)** En Android 12 o anterior no se muestra el dialogo runtime
`POST_NOTIFICATIONS`; aun asi la persona puede desactivar notificaciones desde
los ajustes del sistema o del canal.

**c)** En iOS se puede pedir permiso provisional con
`allowProvisional: true`. Se debe revisar el detalle de `ios.status` en la
respuesta, no tratar todo estado distinto de `denied` como autorizacion
completa. Las notificaciones provisionales se entregan de forma silenciosa en
el centro de notificaciones.

**d)** Conviene pedirlo cuando la persona activa avisos o elige una funcion
cuyo beneficio depende de una notificacion. Un buen momento es activar “Avisame
cuando se resuelva mi reporte”. Un mal momento es mostrar el dialogo apenas se
abre la app sin explicar para que se usara.

### E4. Fotos sin pedir permiso

| Necesidad | Herramienta | Permiso |
| --- | --- | --- |
| Elegir una foto de perfil | `expo-image-picker` con selector del sistema | No hace falta pedir permiso amplio para elegir una imagen. |
| Sacar una foto en el momento | `expo-camera` o captura con camara | Permiso de camara. |
| Editor que muestra toda la galeria | `expo-image-picker` con acceso a biblioteca | Permiso de fotos; puede ser limitado. |
| Adjuntar la foto de un comprobante | `expo-image-picker` con selector del sistema | No hace falta permiso de biblioteca amplio. |

Google Play restringe `READ_MEDIA_IMAGES` y `READ_MEDIA_VIDEO` porque permiten
acceso amplio y persistente a contenido privado. Se deben usar solo si la
funcion principal necesita explorar de forma frecuente toda la biblioteca y
no alcanza el selector del sistema. El selector de fotos del sistema es la
opcion preferible para elegir elementos puntuales.

### E5. Volver de Ajustes

```ts
const estabaAfuera =
  anterior.current === 'background' || anterior.current === 'inactive';

if (estabaAfuera && nuevo === 'active') revisar();

return () => sub.remove();
```

**a)** Los hooks no se enteran automaticamente de un cambio hecho fuera de la
app porque Ajustes es otra aplicacion y el permiso no se actualiza dentro del
estado de React hasta que se consulta otra vez.

**b)** Al hook se le pasa la funcion de consulta, por ejemplo
`consultarPermiso`, que vuelve a ejecutar `getCameraPermissionsAsync()` o la
funcion `consultarPermiso` que devuelve `useCameraPermissions()`.

**c)** No conviene guardar el permiso como un valor permanente en un store
global porque la persona puede cambiarlo en Ajustes mientras la app esta
abierta o en segundo plano. Al volver hay que consultar el sistema y actualizar
el estado.

## Parte F - Buenas practicas y tiendas

### F1. Pedir en contexto

| App y permiso | Cuando pedirlo | Alternativa si lo deniegan |
| --- | --- | --- |
| Delivery - ubicacion | Al tocar “Ver mi pedido en el mapa” o “Usar mi ubicacion”. | Ingresar direccion o barrio manualmente. |
| Billetera virtual - camara | Al elegir escanear un QR o fotografiar un comprobante. | Ingresar el dato o codigo a mano. |
| Red social - contactos | Al tocar “Buscar amigos en mis contactos”. | Buscar por nombre o usuario. |
| Mensajeria - microfono | Al mantener pulsado el boton de grabar audio. | Enviar un mensaje de texto. |
| Turnos medicos - notificaciones | Al activar recordatorios de turnos. | Consultar turnos dentro de la app o por otro canal. |
| Editor de fotos - galeria completa | Solo si se necesita explorar y editar repetidamente toda la biblioteca. | Usar el selector del sistema para elegir fotos puntuales. |

Pedir cuatro permisos al abrir la app sorprende a la persona y facilita que los
rechace sin entender su utilidad. En Android los rechazos pueden dificultar
volver a mostrar el dialogo y en iOS hay que ir a Ajustes despues de denegar.

### F2. La pantalla previa

**a)** Una buena pantalla previa explica el beneficio concreto, deja claro que
el acceso es opcional y ofrece un boton para continuar con la solicitud del
sistema.

**b)** El boton debe decir “Continuar” porque todavia no concede el permiso; lo
concede el dialogo del sistema. Decir “Permitir” antes de que el sistema
pregunte podria confundir.

**c)** La pauta de Apple exige que la pantalla previa no manipule ni presione
para aceptar. Debe permitir seguir usando la app o cancelar el flujo; no se
debe ocultar una salida accesible detras del dialogo.

**d)** Si el permiso ya esta bloqueado, no se vuelve a prometer que aparecera el
dialogo. Se explica que hay que cambiarlo en Ajustes y el boton principal pasa
a ser “Abrir Ajustes”. Tambien se presenta la alternativa de la funcion.

### F3. Minimo privilegio

**a) Puntos de reciclaje del barrio:** ubicacion aproximada. No hace falta
identificar la posicion exacta de la persona.

**b) Registrar una carrera con el celular en el bolsillo:** la ubicacion en
segundo plano puede ser necesaria mientras la carrera se registra con la
pantalla apagada. Se debe pedir primero en uso, explicar el motivo y obtener
solo el acceso necesario.

**c) Subir una foto del DNI:** selector del sistema. La app necesita una sola
foto, no acceso permanente a toda la galeria.

**d) Escanear el QR del aula:** camara sin microfono. No se graba sonido, asi
que no se justifica solicitar acceso al microfono.

### F4. Tiendas

**a) Requisitos relacionados con permisos y privacidad**

- **Google Play:** pedir solo los permisos que necesita la funcion; para
  permisos sensibles declarar y justificar el uso, y completar las
  declaraciones de privacidad requeridas en Play Console. El acceso a fotos,
  ubicacion en segundo plano y contactos esta sujeto a restricciones
  adicionales.
- **App Store:** incluir textos de proposito claros en `Info.plist`; explicar
  en la ficha y las practicas de privacidad que datos se recogen y para que; y
  usar el permiso de rastreo de ATT cuando se rastrea a la persona entre apps
  o sitios de otras empresas.

**b)** `PrivacyInfo.xcprivacy` es el manifiesto de privacidad de Apple. Describe
ciertos tipos de datos y APIs requeridas que utiliza la app o sus dependencias.
En Expo se configura en `expo.ios.privacyManifests` dentro de `app.json` o
`app.config.ts`, o mediante un config plugin de la dependencia.

**c)** Android 17 (API 37) agrega el permiso runtime
`ACCESS_LOCAL_NETWORK` para proteger el acceso a dispositivos de la red local.
Se puede evitar el permiso usando los selectores de dispositivos del sistema.
Ademas, Google Play anunciaba para el 27/01/2027 exigir una justificacion mas
estricta a las apps que solicitan `READ_CONTACTS`: se debe demostrar que el
acceso amplio es central para la funcion principal; si solo hace falta elegir
algunos contactos, usar el selector del sistema y evitar `READ_CONTACTS`.

### F5. Errores comunes

**a) Xcode: “This app has crashed because it attempted to access privacy-sensitive data without a usage description.”**

Falta la clave de proposito correspondiente en `Info.plist`, por ejemplo
`NSCameraUsageDescription` para la camara. Se agrega un texto claro en la
configuracion del plugin de Expo y se genera una nueva build nativa.

**b) En Expo Go funciona, pero en development build la camara se deniega sin dialogo.**

Expo Go y la development build tienen manifiestos distintos. Hay que revisar
que `expo-camera` este instalado para el SDK del proyecto, que el plugin y el
texto de proposito esten configurados y que se haya recompilado la app despues
de cambiar la configuracion nativa. Si `canAskAgain` es `false`, el sistema no
mostrara otro dialogo y hay que abrir Ajustes.

**c) Despues de habilitar ubicacion en Ajustes, la app sigue diciendo “bloqueado”.**

La app esta mostrando una respuesta vieja. Al volver a primer plano debe
consultar de nuevo el permiso con `getForegroundPermissionsAsync()` y actualizar
el estado.

**d) La pantalla queda en “Pidiendo permiso…” porque pide en cada render.**

La solicitud se esta ejecutando repetidamente al renderizar. Se debe solicitar
solo tras una accion explicita de la persona, como tocar “Continuar”, y
mantener un estado de carga mientras se espera la respuesta. La consulta
inicial se hace una vez al montar o al volver de Ajustes.

**e) Una app de turnos no permite entrar si se deniegan notificaciones.**

Las notificaciones no deben bloquear una funcion que sigue siendo util sin
ellas. Se debe permitir usar la app y mostrar los turnos dentro de la pantalla;
se puede volver a ofrecer activar avisos desde Ajustes de la app.
