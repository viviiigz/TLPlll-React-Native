# Respuestas de Análisis — Trabajo Práctico N° 4: “Biblioteca IPF”

> **Proyecto:** Biblioteca IPF (`Expo SDK 58` · React Native `0.88.1` · TypeScript · Expo Router `~58.0.32`)  
> **Aclaración:** Todas las respuestas citan archivos y números de línea exactos del código implementado en `src/` y `app.json`.

---

## Parte B · Estado, efectos y renderizado

### B1. El ciclo de vida de `useLibros`

#### a) Secuencia render por render al montar el Catálogo

En `src/hooks/useLibros.ts` (líneas 13–16), el hook inicializa `libros = []`, `cargando = true`, `error = null` e `intento = 0`.

**Escenario 1: Carga exitosa (`obtenerLibros()` resuelve)**

| Render | Qué lo provoca | `libros` | `cargando` | `error` | Qué se ve en pantalla |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1 (Montaje)** | Montaje inicial de `src/app/(tabs)/(catalogo)/index.tsx` | `[]` | `true` | `null` | `EstadoPantalla` en modo `cargando` |
| **Efecto iniciado** | `useEffect` (líneas 22–49) llama a `cargarCatalogo()`, que ejecuta `setCargando(true)` y `setError(null)` (mismos valores iniciales → *bailout* de React, sin render extra) y dispara `obtenerLibros()` | `[]` | `true` | `null` | Indicador de carga |
| **2 (Respuesta OK)** | A los 800 ms, `obtenerLibros()` resuelve y ejecuta `setLibros(datos)` y `setCargando(false)` (líneas 32–33), agrupados en un único render por *automatic batching* | `[16 libros]` | `false` | `null` | `FlatList` con los 16 libros |

**Escenario 2: Falla `obtenerLibros()` y la persona toca “Reintentar”**

| Render | Qué lo provoca | `libros` | `cargando` | `error` | Qué se ve en pantalla |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1 (Montaje)** | Montaje inicial del Catálogo | `[]` | `true` | `null` | Indicador de carga |
| **2 (Error)** | `obtenerLibros()` rechaza y el `catch` (líneas 35–41) llama a `setError(...)` y `setCargando(false)` (agrupados) | `[]` | `false` | `"No pudimos cargar..."` | Mensaje de error + botón “Reintentar” |
| **3 (Reintentar)** | `reintentar()` (líneas 18–20) incrementa `intento` (`0 → 1`) | `[]` | `false` | `"No pudimos cargar..."` | Dispara nuevamente el `useEffect` |
| **4 (Nuevo pedido)** | El `useEffect` llama a `setCargando(true)` y `setError(null)` (líneas 26–27) | `[]` | `true` | `null` | Indicador de carga |
| **5 (Respuesta OK)** | `obtenerLibros()` resuelve y actualiza `libros` y `cargando` (líneas 32–33) | `[16 libros]` | `false` | `null` | Lista completa del catálogo |

#### b) Desmontaje del Catálogo y ejecución de la limpieza del efecto

- **¿Se desmonta el Catálogo al cambiar a la pestaña “Mis reservas”?** **No.** El navegador `Tabs` (`src/app/(tabs)/_layout.tsx`) mantiene montadas las pestañas visitadas para conservar estado y scroll.
- **¿Se desmonta al abrir un detalle (`/libro/[isbn]`)?** **No.** El Stack propio de la tab Catálogo (`src/app/(tabs)/(catalogo)/_layout.tsx`) apila `/libro/[isbn]` por encima sin desmontar `index.tsx`.
- **Situaciones reales en las que se ejecuta la limpieza (`return () => { cancelado = true; }`, líneas 47–49 de `src/hooks/useLibros.ts`):**
  1. Cuando el usuario toca **“Reintentar”** y cambia `intento`: React ejecuta primero la limpieza del efecto anterior antes de lanzar el nuevo pedido.
  2. Durante **Fast Refresh** en desarrollo o si el árbol de navegación raíz se desmonta por completo.

#### c) ¿Por qué no se puede pasar una función `async` directamente a `useEffect`?

Una función `async` siempre devuelve una `Promise`, pero `useEffect` espera `undefined` o una función síncrona de limpieza (`() => void`). Si se pasara `useEffect(async () => ..., [])`, TypeScript marca error de tipo y React no puede usar la promesa como función de *cleanup*.

**Cómo se resolvió en `src/hooks/useLibros.ts` (líneas 22–49):** se declara `async function cargarCatalogo()` adentro del efecto, se la invoca con `void cargarCatalogo()`, y el efecto devuelve la función síncrona `() => { cancelado = true; }`.

#### d) Implementación de `reintentar` y array de dependencias

En `src/hooks/useLibros.ts` (líneas 16–20 y 49):
```ts
const [intento, setIntento] = useState<number>(0);

const reintentar = useCallback(() => {
  setIntento((anterior) => anterior + 1);
}, []);
```
El efecto depende de `[intento]` (línea 49). Cada toque incrementa el contador, garantizando un valor distinto incluso ante fallos consecutivos (algo que un booleano o el propio `error` no garantiza sin riesgo de bucles al limpiar `error`).

---

### B2. La condición de carrera del buscador

| Momento | Qué pasa | Sin limpieza: qué se ve | Con tu código (`src/app/buscar.tsx`, líneas 85–114): qué se ve |
| :--- | :--- | :--- | :--- |
| **t = 0 ms** | Escribe “bor” → se pide `buscarLibros("bor")`, que tarda 1.400 ms. | Indicador de carga esperando “bor”. | Espera debounce (300 ms) / inicia búsqueda de “bor”. |
| **t = 200 ms** | Escribe “borges” → se pide `buscarLibros("borges")`, que tarda 300 ms. | Indicador de carga (dos pedidos corriendo en paralelo). | La limpieza ejecuta `cancelado = true` y `clearTimeout(temporizador)` (líneas 111–112) descartando “bor”, y agenda “borges”. |
| **t = 500 ms** | Llega la respuesta de “borges”. | Muestra los resultados de **“borges”**. | Muestra los resultados de **“borges”**. |
| **t = 1.400 ms** | Llega la respuesta de “bor”. | **Sobrescribe la pantalla** con resultados viejos de **“bor”** aunque el input dice “borges”. | Si se hubiera disparado “bor”, su `cancelado` vale `true` (línea 95) y se descarta; siguen visibles los resultados de **“borges”**. |

#### a) Qué hace la limpieza del efecto y cuándo se ejecuta

En `src/app/buscar.tsx` (líneas 85–114), cada ejecución del efecto crea su propia bandera local `let cancelado = false;` (línea 86) y un `temporizador` de 300 ms. La limpieza (líneas 110–113) marca `cancelado = true` y ejecuta `clearTimeout(temporizador)`. Se corre automáticamente **justo antes de ejecutar el efecto del nuevo `q`** y al **desmontarse la pantalla `/buscar`**.

#### b) Propuesta del compañero: `if (texto === q) setResultados(datos)`

**No funciona.** Por las **clausuras (closures)** de JavaScript, la función dentro del `.then()` captura el valor de `q` del **render en el que se creó ese efecto** (cuando `q` valía `"bor"`), no el `q` actualizado de renders posteriores. Por eso `texto === q` siempre evalúa `"bor" === "bor"` → `true`, y la respuesta vieja termina pisando la pantalla.

#### c) URL y botón atrás (`router.setParams` vs `router.push`)

- Con **`router.setParams({ q: texto })`** (`src/app/buscar.tsx`, línea 117): actualiza la URL actual (`/buscar?q=...`) **sin apilar pantallas nuevas**. Al tocar atrás, el usuario vuelve directo al Catálogo con un solo toque.
- Con **`router.push`**: cada letra tipeada apilaría una nueva entrada en el Stack; al escribir `"borges"` habría que tocar atrás 6 veces para salir del buscador.

---

### B3. Mutar o reemplazar

#### a) Toca “Anotarme” tres veces: ¿qué muestra y por qué?

Muestra **`Personas en espera: 0`**, porque `espera.encolar('Ana')` muta el objeto `Cola` internamente sin llamar a ningún setter de `useState`, así que React no detecta cambios y no vuelve a renderizar.

#### b) Escribe en un `TextInput` controlado y “salta” a 3

Escribir en el `TextInput` controlado dispara su propio `setState`, lo que fuerza un **re-render** de toda la pantalla. En ese re-render JSX lee `espera.tamanio` de la instancia mutada (que ya tenía 3 elementos) y el número salta de golpe a 3. Un bug intermitente es peor que uno constante porque puede quedar oculto durante las pruebas y aparecer en producción mostrando datos desactualizados al usuario.

#### c) Cómo se resolvió en `BibliotecaContext` y comparación con alternativas

En `src/context/BibliotecaContext.tsx` (líneas 273–279 y 327–333), cada modificación de una `Cola` (y también de la `Pila` en líneas 153–161) clona la estructura antes de actualizar el estado:
```ts
const nuevaCola = colaActual ? colaActual.clonar() : new Cola<string>();
nuevaCola.encolar(USUARIO_ACTUAL);
setColasEspera((prev) => ({ ...prev, [isbn]: nuevaCola }));
```

| Alternativa | Ventaja | Costo |
| :--- | :--- | :--- |
| **Clonar la estructura (elegida)** | Mantiene inmutabilidad de React, compatibilidad con `useMemo` y React Compiler, y encapsulamiento de `#items`. | Copia `O(n)` de los elementos activos en cada cambio (insignificante para colas de biblioteca). |
| **Contador de versión (`version + 1`)** | Evita clonar (`O(1)`). | Rompe la inmutabilidad: la referencia de la instancia nunca cambia, complicando `useEffect` y `React.memo`. |
| **`useReducer`** | Centraliza todas las transiciones en una función pura fácil de testear. | Más código repetitivo (*boilerplate*) de tipos/acciones, y sigue necesitando clonar la `Cola`. |

---

### B4. ¿Dónde vive cada dato?

| Dato | Dónde vive en tu app | Por qué ahí y no en otro lugar |
| :--- | :--- | :--- |
| **Texto del buscador** | **URL** (`useLocalSearchParams` en `src/app/buscar.tsx`, línea 77) | Permite abrir búsquedas por deep link (`bibliotecaipf://buscar?q=borges`) y mantiene la URL sincronizada. |
| **Préstamos y reservas** | **Context** (`BibliotecaContext` + `AsyncStorage`, `src/context/BibliotecaContext.tsx`, líneas 87–151) | Se leen y modifican desde Detalle, Modal de reserva, Mis reservas y Mostrador. |
| **Listas de espera** | **Context** (`colasEspera` con `Cola<string>`, `src/context/BibliotecaContext.tsx`, líneas 92–94) | Compartidas entre Detalle, Modal de reserva, Mis reservas y Mostrador. |
| **Vistos recientemente** | **Context** (`pilaRecientes` con `Pila<Libro>`, `src/context/BibliotecaContext.tsx`, líneas 88–90) | Se apilan al entrar a `/libro/[isbn]` y se leen en el Catálogo (`/`). |
| **Sesión del personal** | **Context** (`sesionPersonal`, `src/context/BibliotecaContext.tsx`, línea 96) | La lee el layout raíz (`src/app/_layout.tsx`) para controlar `Stack.Protected` y el header del Catálogo. |
| **Ejemplares disponibles de un libro** | **Se calcula** (`obtenerDisponibles`, `src/context/BibliotecaContext.tsx`, líneas 164–171) | Evita duplicar estado y desincronizaciones al prestar, devolver o recargar el catálogo. |
| **Estado del permiso de cámara** | **Sistema operativo** (consultado por `usePermiso('camara')`, `src/hooks/usePermiso.ts`) | El usuario puede cambiarlo fuera de la app en Ajustes; el SO es la única fuente de verdad. |
| **Identificador de la notificación programada** | **Context** (`Prestamo.notificacionId`, persistido en `AsyncStorage`) | Se necesita al apagar el interruptor o devolver el libro desde cualquier sesión para cancelar la notificación. |

#### Re-renderizado del Context

Cuando cambia el `value` de `BibliotecaContext`, **todos los componentes que llaman a `useBiblioteca()` se vuelven a renderizar**. Por lo tanto, si el Catálogo usa `useBiblioteca()` y el usuario activa un recordatorio en “Mis reservas”, el Catálogo **sí se re-renderiza**. Para evitarlo se podrían separar contextos independientes (`SesionContext`, `RecientesContext`, `PrestamosContext`), pero en una app de este tamaño (~16 libros) no vale la pena agregar esa complejidad extra; alcanza con memorizar `value` con `useMemo` (líneas 386–434).

---

## Parte C · Navegación y rutas

### C1. La pila en tu app

*(De base a tope → `[Base, ..., Tope]`)*

| # | Acción | Pilas resultantes |
| :--- | :--- | :--- |
| **1** | Abre la app. | **Stack raíz:** `[(tabs)]` <br> **Tab activa:** `(catalogo)` → **Stack de la tab Catálogo:** `[index (/)]` |
| **2** | Toca un libro del Catálogo. | **Stack raíz:** `[(tabs)]` <br> **Stack de la tab Catálogo:** `[index (/), libro/[isbn]]` |
| **3** | Toca “Reservar”. | **Stack raíz:** `[(tabs), reservar/[isbn] (modal)]` <br> **Stack de la tab Catálogo:** `[index (/), libro/[isbn]]` |
| **4** | Toca “Confirmar”. | **Stack raíz:** `[(tabs)]` <br> **Tab activa:** `reservas (/reservas)` <br> **Stack de la tab Catálogo:** `[index (/), libro/[isbn]]` |
| **5** | Toca atrás (Android). | **Stack raíz:** `[(tabs)]` → vuelve a la tab anterior `(catalogo)` (o sale si no hay historial de tabs). **Nunca vuelve al modal `/reservar/[isbn]`.** |
| **6** | Toca la tab “Catálogo”. | **Stack raíz:** `[(tabs)]` <br> **Tab activa:** `(catalogo)` → **Stack de la tab Catálogo:** `[index (/), libro/[isbn]]` |

#### a) Método usado en el paso 4 y comparación

En `src/app/reservar/[isbn].tsx` se usó **`router.dismissTo('/reservas')`**:
- Con **`push`**: dejaría el modal `/reservar/[isbn]` vivo debajo en la pila, y al tocar atrás el usuario volvería a la pantalla de confirmación ya ejecutada.
- Con **`replace`**: reemplazaría la pantalla dentro del Stack raíz, pudiendo dejar la vista fuera del contexto limpio del modal cerrado.
- Con **`dismissTo('/reservas')`**: descarta el modal del Stack raíz y navega directamente a la tab `/reservas`, asegurando que atrás nunca regrese a la confirmación.

#### b) Paso 6: ¿qué pantalla ve la persona y por qué?

Ve **el detalle del libro (`/libro/[isbn]`)**, porque la tab Catálogo posee su **propio Stack** (`src/app/(tabs)/(catalogo)/_layout.tsx`) que conserva su estado mientras la persona visitó “Mis reservas”. Es el comportamiento correcto en apps móviles porque cada pestaña preserva su lugar de lectura.

---

### C2. El escáner que dispara de más

#### a) Qué pasaría con `router.push` sin protección

`onBarcodeScanned` se dispara en múltiples frames por segundo. Sin protección, encolaría decenas de acciones `PUSH /libro/[isbn]` en la **cola de acciones de navegación** (TP 2), apilando múltiples copias del mismo detalle una encima de otra.

#### b) `useState` vs `useRef`

Se usó **`useRef<boolean>(false)`** (`bloqueadoRef` en `src/app/escanear.tsx`, línea 155). Un `useState` puesto en `true` no alcanza porque `setState` es asíncrono y recién actualiza el valor en el siguiente render; los disparos que llegan en el mismo intervalo siguen leyendo `false` por clausura y navegan varias veces. En cambio, `bloqueadoRef.current = true` (línea 173) bloquea de forma síncrona e inmediata.

#### c) Por qué conviene `replace` del escáner al detalle

En `src/app/escanear.tsx` (línea 181) se usa `router.replace({ pathname: '/libro/[isbn]', params: { isbn: codigo } })`. Si se usara `push`, al tocar atrás desde el detalle el usuario volvería a la cámara activa apuntando al mismo libro en lugar de regresar al Catálogo.

#### d) Si el ISBN leído no está en el catálogo

En `src/app/escanear.tsx` (líneas 175–179 y 226–253), `bloqueadoRef.current` queda en `true`, se guarda el código en `isbnNoEncontrado` y se desactiva temporalmente `onBarcodeScanned` hasta que la persona toca **“Seguir escaneando”** (`seguirEscaneando`, líneas 187–190). Así el aviso aparece una sola vez y no diez veces seguidas.

---

### C3. Deep links y rutas protegidas

| Link (`exp://<IP>:8081/--/...`) | Qué ve la persona | Qué queda debajo en la pila | Qué parte de tu código lo decide |
| :--- | :--- | :--- | :--- |
| `bibliotecaipf://libro/9789875666481` | Detalle de *Ficciones* | Catálogo (`/`) | `src/app/(tabs)/(catalogo)/libro/[isbn].tsx` y `anchor` en `src/app/_layout.tsx` |
| `bibliotecaipf://libro/123` | Mensaje de ISBN inválido + botón “Volver al Catálogo” | Catálogo (`/`) | Validación `esIsbnValido(isbn)` en `src/app/(tabs)/(catalogo)/libro/[isbn].tsx` |
| `bibliotecaipf://buscar?q=borges` | Buscador con `"borges"` y sus resultados | `(tabs)` gracias a `anchor: '(tabs)'` | `src/app/_layout.tsx` (línea 10) y `src/app/buscar.tsx` (línea 77) |
| `bibliotecaipf://mostrador` (sin sesión) | No accede a `/mostrador` (ruta inexistente sin sesión) | `(tabs)` | `<Stack.Protected guard={sesionPersonal}>` en `src/app/_layout.tsx` |
| `bibliotecaipf://reserva` | Pestaña “Mis reservas” (`/reservas`) | `(tabs)` | `<Redirect href="/reservas" />` en `src/app/reserva.tsx` |
| `bibliotecaipf://escanear` (cámara bloqueada) | Estado `bloqueado` con “Abrir Ajustes” + ingreso manual de ISBN | `(tabs)` | `usePermiso('camara')` en `src/app/escanear.tsx` |

#### ¿Por qué `/libro/123` llega al detalle?

Porque Expo Router resuelve rutas por **patrón de URL** (`/libro/[isbn]`), no por existencia en la base de datos. Validar el formato (13 dígitos) y la existencia del libro es responsabilidad de la pantalla `src/app/(tabs)/(catalogo)/libro/[isbn].tsx`.

---

### C4. Foco, montaje y primer plano

#### a) Qué evento detecta cada herramienta

- **`useEffect(..., [])`**: montaje y desmontaje del componente.
- **`useFocusEffect`**: cuándo la pantalla gana o pierde foco dentro del navegador (cambios de tab o volver de otra pantalla).
- **`AppState`**: cuándo la app completa pasa a segundo plano (`background`/`inactive`) y vuelve a primer plano (`active`).

#### b) Escenarios concretos

- **Vuelve de Ajustes tras habilitar notificaciones:** solo se entera **`AppState`** (la pantalla nunca se desmontó ni cambió de foco interno).
- **Va a la pestaña Catálogo y vuelve a “Mis reservas”:** solo se entera **`useFocusEffect`** (la app nunca pasó a segundo plano ni desmontó la tab).

#### c) Cuál/cuáles se usaron en la app

Se usaron **las tres**:
1. `useEffect` al montar en `src/hooks/usePermiso.ts` (líneas 51–76).
2. `AppState` mediante `useRevisarAlVolver` (`src/hooks/useRevisarAlVolver.ts` llamado en `src/hooks/usePermiso.ts`, línea 78).
3. `useFocusEffect` en `src/app/(tabs)/reservas.tsx` (líneas 143–147) y `src/app/escanear.tsx` (líneas 160–165).

Si se hubiera usado solo una (por ejemplo solo `useEffect`), la pantalla mostraría un estado desactualizado al volver desde Ajustes o desde el modal `/permisos/[recurso]`.

---

## Parte D · Permisos en tu app

### D1. Recorrido completo de la cámara (Android 14, app recién instalada)

| # | Acción | Qué muestra tu app | `status` | `canAskAgain` |
| :--- | :--- | :--- | :--- | :--- |
| **1** | Toca “Escanear” por primera vez. | Estado `preguntable` con botón “Habilitar cámara” (lleva a `/permisos/camara` con botón “Continuar”) + ingreso manual. | `'undetermined'` | `true` |
| **2** | “Continuar” → “No permitir”. | Vuelve a `/escanear` en estado `preguntable` con ingreso manual disponible. | `'denied'` | `true` |
| **3** | Toca “Escanear” otra vez. | Estado `preguntable` → `/permisos/camara` sigue mostrando “Continuar”. | `'denied'` | `true` |
| **4** | “Continuar” → “No permitir”. | Al 2° rechazo en Android 14 pasa a estado `bloqueado` con botón “Abrir Ajustes” + ingreso manual. | `'denied'` | `false` |
| **5** | Toca “Escanear” otra vez. | Muestra directamente el estado `bloqueado` con botón “Abrir Ajustes” + ingreso manual. | `'denied'` | `false` |
| **6** | “Abrir Ajustes” → habilita la cámara → vuelve a la app. | `useRevisarAlVolver` re-consulta y muestra `CameraView` lista para leer EAN-13. | `'granted'` | `true` |

#### a) Recorrido en iOS

En **iOS**, cambia ya en el **paso 2**: tras el **primer** “No permitir”, iOS pasa inmediatamente a `status: 'denied'` con `canAskAgain: false`, por lo que desde el paso 3 la app ya muestra el estado `bloqueado` con **“Abrir Ajustes”**.

#### b) Línea de código que decide entre “Continuar” y “Abrir Ajustes”

En `src/hooks/usePermiso.ts` (línea 29):
```ts
return respuesta.canAskAgain ? 'preguntable' : 'bloqueado';
```
Y en `src/app/permisos/[recurso].tsx`:
```ts
const estaBloqueado = estado === 'bloqueado';
const textoBoton = estaBloqueado ? 'Abrir Ajustes' : 'Continuar';
```
Usa **`canAskAgain`**, porque en Android `status` vale `'denied'` tanto después del 1° como del 2° rechazo, pero solo `canAskAgain` distingue si todavía se puede volver a mostrar el diálogo del sistema o si la única salida es `Linking.openSettings()`.

#### c) Paso 6: cómo se entera la app de la vuelta desde Ajustes

A través de `useRevisarAlVolver` (`src/hooks/useRevisarAlVolver.ts`), invocado en `src/hooks/usePermiso.ts` (línea 78). Sin esa suscripción a `AppState`, al volver de Ajustes la app seguiría mostrando el cartel de cámara bloqueada hasta que el usuario salga y vuelva a entrar.

---

### D2. Notificaciones y consistencia

#### a) Si no se cancelara la notificación al devolver antes de los 15 s

La notificación programada en el SO se dispararía igualmente a los 15 segundos recordando devolver un libro que ya fue devuelto.

#### b) Dónde se guarda el identificador y qué pasa si la app se cierra

Se guarda en `Prestamo.notificacionId` dentro de `BibliotecaContext` y se persiste en `AsyncStorage` (`src/context/BibliotecaContext.tsx`, líneas 135–151). Si solo viviera en memoria sin persistencia, al cerrar la app la notificación seguiría programada en el SO pero el identificador se perdería al reabrir, impidiendo cancelarla después; la persistencia en `AsyncStorage` resuelve ese problema.

#### c) Creación del canal `"prestamos"` antes de pedir el permiso

- **Android 13+ (API 33+):** en Expo/Android, el diálogo del permiso `POST_NOTIFICATIONS` requiere que exista al menos un canal creado antes de invocar `requestPermissionsAsync()`, por eso `asegurarCanalPrestamos()` corre primero (`src/hooks/usePermiso.ts`, línea 92).
- **Android 12 (API ≤ 32):** no hay diálogo en tiempo de ejecución (el permiso viene concedido al instalar), aunque el canal sigue siendo obligatorio desde Android 8 para mostrar la notificación.

#### d) Entrega desde el mostrador con permiso denegado

En `src/context/BibliotecaContext.tsx` (líneas 347–358):
```ts
const permitido = await tienePermisoNotificaciones();
if (permitido) {
  await enviarNotificacionEntrega(tituloLibro, isbn);
} else {
  const aviso: AvisoInterno = {
    id: `${isbn}-${Date.now()}`,
    mensaje: `Tu reserva de "${tituloLibro}" ya fue entregada desde el mostrador y pasó a tus préstamos.`,
    fechaISO: new Date().toISOString(),
  };
  setAvisosInternos((prev) => [aviso, ...prev]);
}
```
Consulta el permiso **en ese mismo momento** (`getPermissionsAsync()` en `src/lib/notificaciones.ts`) y no usa un valor viejo en memoria, porque el usuario pudo haber revocado o concedido notificaciones en Ajustes en cualquier instante.

---

### D3. Lo que tu app pide y lo que no

| Plataforma | Permiso o clave declarada | Función de la app que lo justifica | ¿Quién lo agrega? |
| :--- | :--- | :--- | :--- |
| **Android** | `android.permission.CAMERA` | Escáner de códigos de barras EAN-13 (`/escanear`) | Plugin `expo-camera` en `app.json` |
| **Android** | `android.permission.POST_NOTIFICATIONS` | Recordatorios de devolución (15 s) y avisos de entrega | Plugin `expo-notifications` en `app.json` |
| **Android** | `android.permission.INTERNET` | Red / Expo | Base de Expo / React Native |
| **iOS** | `NSCameraUsageDescription` | Texto de propósito para leer códigos de barras de libros | Plugin `expo-camera` (`cameraPermission` en `app.json`) |
| **iOS** | Autorización de notificaciones locales (`UserNotifications`) | Recordatorios de devolución y avisos de entrega | `expo-notifications` en tiempo de ejecución |

#### a) Por qué no declara `RECORD_AUDIO`

Porque en `app.json` se configuró `microphonePermission: false`, `recordAudioAndroid: false` en `expo-camera` y `"android.permission.RECORD_AUDIO"` en `android.blockedPermissions`:
```json
"android": {
  "blockedPermissions": [
    "android.permission.RECORD_AUDIO",
    "android.permission.ACCESS_FINE_LOCATION",
    "android.permission.ACCESS_COARSE_LOCATION",
    "android.permission.READ_MEDIA_IMAGES",
    "android.permission.READ_EXTERNAL_STORAGE"
  ]
},
"plugins": [
  [
    "expo-camera",
    {
      "cameraPermission": "Usamos tu cámara para leer el código de barras de los libros y abrir su ficha al instante.",
      "microphonePermission": false,
      "recordAudioAndroid": false
    }
  ]
]
```

#### b) Si mañana piden “elegir una foto de portada desde la galería”

- **Paquete:** `expo-image-picker` (instalado con `npx expo install expo-image-picker`).
- **Permiso:** con `launchImageLibraryAsync()`, Android 13+ (Photo Picker) e iOS 14+ (PHPicker) usan el selector nativo del sistema **sin requerir permiso de acceso completo a toda la galería** (solo se requeriría `READ_EXTERNAL_STORAGE` en Android antiguos o `NSPhotoLibraryUsageDescription` si se usa acceso directo).
- **OTA vs Build nueva:** **hace falta una build nueva**, porque agregar `expo-image-picker` suma código nativo y configuración de config plugin que una actualización OTA (solo JS/assets) no puede incluir.

#### c) Qué no se puede verificar del todo en Expo Go y cómo verificarlo

En Expo Go no se verifican por completo el texto de propósito personalizado en iOS (`NSCameraUsageDescription`), el efecto final de `blockedPermissions` en `AndroidManifest.xml`, ni el deep link con `bibliotecaipf://` (en Expo Go se usa `exp://`), porque Expo Go ejecuta su propio binario precompilado. Se verifican compilando un **Development Build** (`npx expo prebuild` / `eas build --profile development`).

---

## Parte E · Buenas prácticas y decisiones de diseño

### E1. Revisión de código

#### a) Problemas encontrados (10 problemas)

| # | Línea(s) | Clasificación | Por qué sucede | Cómo corregirlo |
| :--- | :--- | :--- | :--- | :--- |
| **1** | 18–20 | Error de ejecución / Rendimiento | `useEffect` sin array de dependencias llama a `obtenerLibros()` en cada render, creando un bucle infinito porque cada respuesta trae un array nuevo. | Usar `useLibros()` con dependencias `[intento]` y limpieza `cancelado = true`. |
| **2** | 19 | Error de ejecución | Promesa sin `.catch()` ni `try/catch`; `obtenerLibros()` falla 1 de cada 5 veces y produce rechazo no controlado. | Capturar el error, guardar `error` en estado y mostrar botón “Reintentar”. |
| **3** | 13–16 | Mala práctica | Pide cámara y notificaciones al abrir el Catálogo sin contexto ni acción del usuario, y sin crear el canal de Android antes de pedir notificaciones. | Pedir cámara solo al ir a `/escanear` (vía `/permisos/camara`) y notificaciones solo al activar “Recordarme” en `/reservas`. |
| **4** | 10 y 22 | Mala práctica (TS) | Uso de `any` en `useState<any[]>` y `{ libro: any }`. | Tipar con `Libro` desde `src/types`. |
| **5** | 22–30 | Rendimiento / Mala práctica | `Fila` está declarada dentro de `Catalogo`: se recrea en cada render y React desmonta/monta cada fila. | Mover `FilaLibro` a `src/components/FilaLibro.tsx` a nivel de módulo. |
| **6** | 33–36 | Rendimiento | Usa `ScrollView` + `.map()` en vez de `FlatList`, renderizando todo sin virtualización ni `ListEmptyComponent`. | Reemplazar por `FlatList` con `ListEmptyComponent`. |
| **7** | 35 | Advertencia / Mala práctica | `key={i}` usa el índice del array. | Usar `keyExtractor={(item) => item.isbn}`. |
| **8** | 25 | Mala práctica | Estilos en línea hardcodeados (`style={{ fontSize: 16, ... }}`). | Usar `StyleSheet.create` y constantes de `src/constants/tema.ts`. |
| **9** | 24 y 37–39 | Mala práctica (Accesibilidad) | Sin `accessibilityRole="button"`, botón de solo ícono sin `accessibilityLabel`, y área táctil menor a 44×44. | Agregar `accessibilityRole`, `accessibilityLabel` y tamaño mínimo `44×44`. |
| **10** | 32–40 | Mala práctica (UX) | No muestra estados de carga, error ni lista vacía. | Renderizar `EstadoPantalla` para `cargando`, `error` y `ListEmptyComponent`. |

#### b) Qué pasa durante el primer minuto (líneas 18–20)

Cada ~800 ms `obtenerLibros()` devuelve un array nuevo → `setLibros(datos)` cambia la referencia → provoca re-render → el `useEffect` sin dependencias vuelve a correr → bucle infinito (~75 peticiones/minuto y ~15 rechazos no capturados/minuto).  
Si devolviera **siempre el mismo array (misma referencia)**, tras la primera carga `Object.is` daría `true` y React haría *bailout* frenando el bucle automático, pero seguiría disparando una petición innecesaria en cada render causado por cualquier otro cambio de estado.

#### c) Pantalla reescrita con los hooks, componentes y constantes de esta app

Implementada en `src/app/(tabs)/(catalogo)/index.tsx`: utiliza `useLibros()`, `useBiblioteca()`, `useTema()`, `EstadoPantalla`, `FilaLibro`, `TarjetaReciente`, `StyleSheet.create` con `ESPACIADO` y `TAMANIOS` de `src/constants/tema.ts`, `FlatList` con `keyExtractor={(item) => item.isbn}` y `ListEmptyComponent`, y botones accesibles para “Buscar” y “Escanear”.

#### d) Rechazo en tienda vs desinstalación por el usuario

- **Rechazo en tienda:** pedir cámara y notificaciones al abrir la app sin contexto ni interacción del usuario (líneas 13–16), lo cual viola las guías de privacidad de App Store (5.1.1) y Google Play.
- **Desinstalación rápida:** el bucle infinito de `useEffect` (líneas 18–20) con errores sin capturar, sumado a los popups intrusivos iniciales.

---

### E2. Organización y acoplamiento

#### a) Grafo de importaciones

```text
src/app/  ──►  src/components/, src/context/, src/hooks/, src/lib/, src/data/, src/constants/, src/types/
src/components/ ──► src/hooks/useTema, src/constants/, src/lib/, src/types/
src/context/    ──► src/estructuras/, src/data/, src/lib/, src/constants/, src/types/
src/hooks/      ──► src/lib/, src/constants/, src/types/
src/lib/        ──► src/data/, src/constants/, src/types/
```

No existe ninguna importación “hacia arriba” (hacia `src/app`). Importar desde `src/app` crearía dependencias circulares y acoplaría lógica reutilizable al enrutador, impidiendo testearla o reutilizarla.

#### b) Si el catálogo viniera de una API real

Solo cambiaría **`src/lib/api.ts`** (1 archivo, o 2 si se agrega una constante de URL base). Eso confirma bajo acoplamiento: las pantallas y `useLibros` solo dependen del contrato `Promise<Libro[]>`.

#### c) `<ConPermiso recurso="camara">...</ConPermiso>` vs `usePermiso` + `/permisos/[recurso]`

Un componente envoltorio reduce código repetitivo cuando un bloque entero depende del permiso (como la cámara), pero pierde flexibilidad para mostrar una pantalla previa modal (`/permisos/[recurso]`) o combinar controles siempre disponibles (ISBN manual). Además, **no sirve para notificaciones**, porque en `/reservas` el permiso se solicita de forma imperativa al accionar un `Switch` y no al montar una pantalla.

---

### E3. Mapa de fallas

| Situación | Qué ve la persona | Dónde se maneja (archivo y línea) |
| :--- | :--- | :--- |
| `obtenerLibros()` falla | Pantalla de error amigable con botón **“Reintentar”**. | `src/hooks/useLibros.ts` (líneas 35–42) y `src/app/(tabs)/(catalogo)/index.tsx` (líneas 112–120). |
| Se abre `/libro/abc` | Mensaje claro de ISBN inválido (debe tener 13 dígitos) + botón “Volver al Catálogo”. | `src/app/(tabs)/(catalogo)/libro/[isbn].tsx` (líneas 165–201) usando `src/lib/validaciones.ts` (línea 7). |
| Se escanea un ISBN que no está en el catálogo | Aviso amarillo con el ISBN leído y botón **“Seguir escaneando”** (sin repetirse). | `src/app/escanear.tsx` (líneas 175–179 y 237–253). |
| La cámara está bloqueada | Tarjeta “Cámara bloqueada” con botón **“Abrir Ajustes”** e input manual de ISBN. | `src/hooks/usePermiso.ts` (línea 29) y `src/app/escanear.tsx` (líneas 278–299). |
| Las notificaciones están denegadas | Mensaje en `/reservas` (y botón “Abrir Ajustes” si está bloqueado); las entregas aparecen como avisos internos. | `src/app/(tabs)/reservas.tsx` (líneas 165–186 y 256–275) y `src/context/BibliotecaContext.tsx` (líneas 347–358). |
| Se intenta reservar un libro ya reservado | Aviso indicando que ya tiene préstamo activo o posición en espera, sin duplicar. | `src/context/BibliotecaContext.tsx` (líneas 241–256) y `src/app/reservar/[isbn].tsx` (líneas 189–196). |
| “Entregar al siguiente” con la lista de espera vacía | No aparecen libros vacíos en la lista y `Cola.desencolar()` devuelve `undefined` sin fallar. | `src/estructuras/Cola.ts` (líneas 15–18) y `src/app/mostrador.tsx` (líneas 120–125). |
| Login con clave incorrecta | Mensaje de error claro en rojo sin cerrar el modal. | `src/app/login.tsx` (líneas 134–140) y `src/context/BibliotecaContext.tsx` (líneas 373–381). |

---

### E4. Decisiones con argumentos

#### a) Identificador: ¿ISBN o ID numérico propio?

En esta app se usa **ISBN (string de 13 dígitos)** porque el contrato de `Libro` lo define así, mapea directo desde el escáner EAN-13 y evita parseos numéricos con `useLocalSearchParams` (que siempre devuelve `string | string[]`, evitando `NaN` como vimos en el TP 2). En un sistema productivo real, sin embargo, conviene usar un **ID interno propio** (UUID o autoincremental) para soportar libros sin ISBN, apuntes internos y distintas ediciones o múltiples ejemplares físicos del mismo título.

#### b) Estructuras: ¿Clase `Pila` con `#items` o array en estado?

La clase `Pila` con `#items` da encapsulamiento estricto y tests unitarios aislados (`src/estructuras/__tests__/estructuras.test.ts`), pero complica la integración con React porque requiere `clonar()` para cambiar la referencia en `useState`. Para un TP integrador la clase es ideal para practicar abstracción; en producción, para una lista simple de 3 recientes, un array inmutable con `slice` sería más directo.

#### c) Memorización (`useMemo` y `useCallback`)

- **Aporta:** en el `value` de `BibliotecaContext` (`src/context/BibliotecaContext.tsx`, líneas 386–434) y en `revisar` de `usePermiso.ts` (línea 38), que es dependencia de `useEffect` y `useRevisarAlVolver`.
- **Sería ruido:** en cálculos simples (ej. `disponibles > 0`) o handlers locales que pasan directo a un `<Pressable>` sin `React.memo`.
- **Cómo comprobarlo:** midiendo con **React DevTools Profiler** (Flamegraph y motivo de cada render) antes y después de memorizar, en lugar de asumirlo.

#### d) Datos duplicados: ejemplares disponibles

**Se calculan** con `obtenerDisponibles(libro)` (`src/context/BibliotecaContext.tsx`, líneas 164–171) restando los préstamos activos del libro a `libro.ejemplares`. Si se guardara un campo mutable duplicado en el estado del catálogo, cualquier recarga de `obtenerLibros()` o una devolución olvidada desincronizaría ambos valores; derivándolo desde una única fuente de verdad (`prestamos`), el número siempre es consistente.
