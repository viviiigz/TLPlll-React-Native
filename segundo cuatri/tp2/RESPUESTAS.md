# Trabajo Práctico N° 2 - Expo Router
**Alumno/a:** González Viviana Elisa Soledad

**Fecha de entrega:** 25-09-26

## Parte A: Estructuras de datos: la pila y la cola

**A1. Conceptos**
a) ¿Qué significan LIFO y FIFO? ¿Cuál corresponde a la pila y cuál a la cola?

**Respuesta:** 
* LIFO (Last In, First Out = "el último elemento que entra es el primero que sale.") corresponde a la pila (stack).  FIFO (First In, First Out = "el primero que llega es el primero que sale") corresponde a la cola (queue)*

b) ¿Por qué extremo entra y por qué extremo sale un elemento en cada estructura?

**Respuesta:**

* Pila (LIFO): el elemento entra y sale por el mismo extremo (la cima o top).  Es decir, apilás por arriba y desapilás por arriba.
Cola (FIFO): el elemento entra por un extremo (el fondo o back) y sale por el otro extremo (el frente o front)

c) Dá un ejemplo de la vida real y otro de una aplicación móvil para cada una.

**Respuesta:**

* **Vida real:** *Pila(LIFO)* - Una pila de platos por lavar: el último que dejaron arriba es el primero que se va a lavar.  
*Cola(FIFO)* - La fila del supermercado: el primero que llegó a la fila es el primero al que atienden.

---
* **Aplicación Móvil:** *Pila(LIFO)* - El botón "atrás" en un navegador o app: cada pantalla que visito se apila, y al dar "atrás" se saca la última pantalla (la cima de la pila).      

  *Cola(FIFO)* -  La cola "Up Next" (Siguiente) de spotify. Cuando agregás varias canciones a la cola de reproducción, cada una entra por el fondo y se reproduce en el orden que agregué, o sea, la primera que puse es la primera que suena

  
**A2. Seguimiento de una pila**

(1) `console.log(p.tope());` ->   Imprime 'Perfil'. El método tope() solo "mira" el elemento de arriba de todo sin sacarlo.

(2) `console.log(p.pop());` ->   Imprime 'Perfil'. El método pop() saca el elemento de arriba de todo y te lo devuelve. La pila queda reducida a ['Inicio', 'Productos'].

(3) `console.log(p.tope());` ->  Imprime 'Productos'. Como 'Perfil' ya salió en el paso anterior, el nuevo tope ahora es 'Productos'.

(4) `console.log(p.vacia);` ->  Imprime false. La pila aún tiene dos elementos, por lo que no está vacía.

*Estado final de la pila (de base a tope):*  ['Inicio', 'Productos']. 


**A3. Seguimiento de una cola**

(1) `console.log(c.frente());` -> Imprime 'Beto'. El método frente() solo "mira" quién es el primero en la fila sin sacarlo


(2) `console.log(c.desencolar());` -> Imprime 'Beto'. El método desencolar() atiende a Beto y lo saca de la fila. La cola queda reducida a ['Caro', 'Dani'].

(3) `console.log(c.vacia);` -> Imprime false. La cola aún tiene a Caro y Dani esperando.

*Estado final de la cola (de frente a final):*   ['Caro', 'Dani']

**A4. Análisis de la implementación**

- a) ¿Qué significa el # y qué problema evita?

*Respuesta:*

El símbolo # convierte a la propiedad (como #items) en un campo privado de la clase. Esto evita que código externo pueda acceder o modificar el array directamente (por ejemplo, impidiendo que alguien haga pila.#items.length = 0). Garantiza el encapsulamiento para que la estructura solo pueda modificarse usando los métodos permitidos (push, pop, etc.).

- b) ¿Qué problema de rendimiento tiene shift() con colas muy grandes? ¿Cómo lo resuelven las colas "serias"?

*Respuesta:*

El método shift() elimina el primer elemento del array, lo que obliga a JavaScript a reasignar los índices de todos los elementos restantes uno por uno hacia atrás. En colas grandes, esto consume mucha memoria y tiempo de procesamiento. Las colas eficientes lo resuelven utilizando un puntero (un índice guardado en una variable) que avanza para indicar cuál es el nuevo "frente", sin necesidad de reacomodar todo el array en cada extracción.

- c) ¿Qué método de array usa la pila para sacar y cuál usa la cola? ¿Por qué no pueden usar el mismo?

*Respuesta:*

La pila usa pop() y la cola usa shift(). No pueden usar el mismo método porque obedecen lógicas contrarias: la pila debe sacar el último elemento que ingresó al final del array (comportamiento LIFO), mientras que la cola está obligada a sacar el elemento más antiguo que se encuentra al principio del array (comportamiento FIFO).

**A5. Programación: una cola eficiente**

```javascript 

class ColaEficiente {
  #items = [];
  #frenteIndex = 0;

  encolar(elemento) {
    this.#items.push(elemento);
  }

  desencolar() {
    if (this.vacia) return undefined;
    const elemento = this.#items[this.#frenteIndex];
    this.#items[this.#frenteIndex] = undefined; 
    this.#frenteIndex++;
    return elemento;
  }

  frente() {
    if (this.vacia) return undefined;
    return this.#items[this.#frenteIndex];
  }

  get vacia() {
    return this.#frenteIndex >= this.#items.length;
  }

  get tamanio() {
    return this.#items.length - this.#frenteIndex;
  }
}

```

**A6. Pila y cola dentro de Expo Router**
a) ¿Qué estructura describe el historial de pantallas de un Stack? ¿Qué pantalla es la visible y qué operación hace "atrás"?

*Respuesta:*
El historial de un Stack se describe con una Pila (LIFO). La pantalla visible para el usuario es siempre la que se encuentra en el tope de la pila. Cuando se ejecuta la acción "atrás", el sistema hace una operación pop, eliminando la pantalla del tope y dejando visible la que había quedado justo debajo.

b) ¿Qué estructura usa Expo Router para las acciones de navegación? ¿Qué pasa si el usuario toca dos links muy rápido?

*Respuesta:*
Expo Router procesa los eventos de navegación utilizando una Cola (FIFO). Si el usuario toca dos links casi en simultáneo, no ocurren al mismo tiempo; ambas acciones se encolan. El sistema desencola y ejecuta primero la primera transición y, cuando termina, procesa el segundo toque en orden de llegada. Esto evita que la aplicación intente renderizar dos pantallas a la vez o se congele.

## Parte B: Rutas basadas en archivos

**B1. Del archivo a la URL**
| Archivo | URL que genera / función |
| --- | --- |
| `src/app/(tabs)/index.tsx` | Genera la URL `/` (raíz). La carpeta `(tabs)` es un grupo y se ignora en la ruta. |
| `src/app/acerca.tsx` | Genera la URL `/acerca`. |
| `src/app/(tabs)/perfil.tsx` | Genera la URL `/perfil`. |
| `src/app/(tabs)/productos/index.tsx` | Genera la URL `/productos`. |
| `src/app/(tabs)/productos/[id].tsx` | Genera la URL dinámica `/productos/[id]` (ej: `/productos/3`). |
| `src/app/docs/[...slug].tsx` | Genera una URL comodín "catch-all" `/docs/...` que atrapa cualquier ruta anidada (ej: `/docs/react/hooks`). |
| `src/app/_layout.tsx` | No genera una URL. Define la estructura visual y de navegación (el "layout") para las pantallas de ese directorio. |
| `src/app/+not-found.tsx` | No genera una URL específica. Es la pantalla de error 404 que atrapa cualquier ruta inexistente. |
| `src/app/Boton.tsx` | Genera un problema/mala práctica. Los nombres en mayúscula suelen ser componentes de React, los cuales no deben ir dentro de `app/` (deberían ir en `components/`). Aunque Expo Router crearía la URL `/Boton`, ensucia el enrutamiento. |   




**B2. De la URL al archivo**
| URL | Archivo | Función |
| --- | --- | --- |
| `/categorias/bebidas` (y cualquier otra) | `src/app/categorias/[categoria].tsx` | Ruta dinámica: `[categoria]` captura cualquier valor como parámetro. |
| `/buscar?q=mate&categoria=kiosco` | `src/app/buscar.tsx` | Ruta estática con query string. El archivo no cambia, solo los parámetros de la URL. |
| `/ayuda/pagos/tarjeta` y `/ayuda/horarios` | `src/app/ayuda/[...slug].tsx` | Catch-all: `[...slug]` atrapa cualquier segmento anidado bajo `/ayuda/`. |
| `/ayuda` (con una pantalla propia) | `src/app/ayuda/index.tsx` | La ruta exacta `/ayuda` sin sub-rutas. Convive con `[...slug].tsx`  |   


**B3. Verdadero o falso**

- a) F

    Justificación: Expo Router utiliza enrutamiento
    basado en archivos. No existe ninguna tabla central de configuración; al crear un archivo .tsx dentro de la carpeta src/app/, la ruta se genera y se registra de forma automática.

- b) F 
    
    Justificación: Los archivos _layout.tsx no son rutas navegables (el usuario no puede ir a /layout). Son componentes de envoltura que sirven para definir la estructura visual y de navegación (como Stacks, Tabs o Drawers) que compartirán todas las pantallas hijas de ese directorio.

- c) V

- d) F

    Justificación: Conviene usar siempre npx expo install. Si usas npm install, descargarás la última versión existente de la librería, la cual podría romper tu proyecto. En cambio, npx expo install verifica tu SDK y descarga la versión exacta de la librería que está certificada como 100% compatible con ese SDK.

- e) V

- f) V

- g) V

- h) V


## Parte C: Navegar: `<Link>`, router y la pila

**C1. Métodos de router**
| Método | Qué le hace a la pila |
| --- | --- |
| `router.push(href)` | Apila una nueva pantalla en el tope del historial (hace un *push* clásico). Si la pantalla ya existía más abajo, crea un duplicado arriba de todo. |
| `router.navigate(href)` | Navega de forma inteligente: si la pantalla ya existe en la pila, desapila hasta volver a ella; si no existe, la apila en el tope. |
| `router.replace(href)` | Quita la pantalla actual del tope (pop) y coloca la nueva en su lugar (push). Evita que la pantalla original quede en el historial. |
| `router.back()` | Desapila la pantalla visible actual (hace un *pop*) y retrocede a la pantalla que estaba justo debajo. |
| `router.dismissTo(href)` | Desapila múltiples pantallas de una sola vez hasta que la ruta especificada (`href`) queda en el tope y se vuelve visible. |
| `router.dismissAll()` | Vacía la pila casi por completo, desapilando todo hasta dejar únicamente la primera pantalla (la base del Stack) en el tope. |
| `router.canGoBack()` | No modifica la pila. Solo la "mira" y devuelve un booleano (`true` o `false`) indicando si hay al menos una pantalla debajo a la cual retroceder. |
| `router.setParams({...})` | No agrega ni quita pantallas de la pila. Solo actualiza los parámetros (la información en la URL) de la pantalla actual en el tope. |   

**C2. Simulación de la pila**

| # | Instrucción | Pila resultante (de base a tope) |
| --- | --- | --- |
| 1 | `router.push("/productos/1")` | `[ "/productos", "/productos/1" ]` |
| 2 | `router.push("/productos/2")` | `[ "/productos", "/productos/1", "/productos/2" ]` |
| 3 | `router.navigate("/productos/5")` | `[ "/productos", "/productos/1", "/productos/2", "/productos/5" ]` |
| 4 | `router.push("/perfil")` | `[ "/productos", "/productos/1", "/productos/2", "/productos/5", "/perfil" ]` |
| 5 | `router.replace("/buscar")` | `[ "/productos", "/productos/1", "/productos/2", "/productos/5", "/buscar" ]` |
| 6 | `router.back()` | `[ "/productos", "/productos/1", "/productos/2", "/productos/5" ]` |
| 7 | `router.dismissTo("/productos")` | `[ "/productos" ]` |
| 8 | `router.canGoBack()`  | Devuelve **`false`** (la pila no se modifica, queda en `[ "/productos" ]`) |   

**C3. ¿Link o router?**

- a) El usuario toca la tarjeta de un producto en una lista:
 
    Elección: <Link>

    Método/Prop: href="/productos/1" (usualmente con asChild si envuelve una tarjeta compleja).

    Justificación: Es una navegación directa e intencional del usuario hacia otra pantalla. Usar componentes declarativos como <Link> mejora la accesibilidad y es la norma recomendada para interacciones simples

- b) Se guarda un formulario, la API responde OK y hay que mostrar la pantalla de éxito:

    Elección: router

    Método/Prop: router.push('/exito') o router.replace('/exito').

    Justificación: La navegación es programática; no debe ocurrir inmediatamente cuando el usuario toca el botón, sino que el código debe esperar obligatoriamente a que la API confirme que todo salió bien antes de cambiar de pantalla.

- c) Botón “Cancelar” dentro de un modal:

    Elección: router

    Método/Prop: router.back() o router.dismiss().

    Justificación: Es una acción lógica de cancelación. No necesitas pasarle una URL específica al botón, solo necesitas decirle al sistema "destruí la pantalla actual y volvé a lo que sea que estuviera atrás".

- d) Después de un login exitoso hay que ir a la pantalla principal:

    Elección: router

    Método/Prop: router.replace('/home')

    Justificación: Igual que el caso B, debes esperar la respuesta del servidor. Es obligatorio usar replace para borrar la pantalla de Login del historial; si usaras push, el usuario podría tocar el botón físico "Atrás" de su celular y volvería a la pantalla de ingresar contraseña estando ya logueado.

- e) Volver desde el detalle de un pedido a la lista, que quedó tres pantallas más abajo:

    Elección: router

    Método/Prop: router.dismissTo('/pedidos') (o router.navigate('/pedidos')).

    Justificación: Hacer un <Link href="/pedidos"> podría crear una pantalla duplicada de pedidos en el tope de la pila. Usar dismissTo desarma toda la basura acumulada en el medio y te deja exactamente donde querías, ahorrando memoria.

**C4. Escribí el código**

- a) Un <Link> que abra el producto con id 8 usando href como objeto:
```
<Link href={{ pathname: "/productos/[id]",params: { id: 8 } }}>
  Ver Producto
</Link>
```

- b) Un <Link> a /perfil que siempre apile, aunque la pantalla ya exista:
```
<Link href = "/perfil" push>
    Ir a mi perfil
</Link>
```

- c) Un botón (Pressable) propio que funcione como link a /carrito usando asChild:

```
<Link href="/carrito" asChild>
  <Pressable>
    <Text>Ir al carrito</Text>
  </Pressable>
</Link>
```
**C5. Pensar**

- Cada <Link> se convierte en un <a href> real  para que el navegador lo reconozca como un hipervínculo nativo. En escritorio, esto permite al usuario hacer clic derecho para copiar la URL, abrir el enlace en una nueva pestaña o usar Ctrl + Clic. En celular, donde no hay barra de direcciones, el usuario puede mantener presionado el enlace (long-press) para acceder a un menú nativo con opciones como "Abrir en nueva pestaña", "Copiar dirección" o "Compartir", sin necesidad de navegar a la página.


## Parte D: Navegadores: Stack, Tabs y Drawer

**D1**

| Criterio | Stack | Tabs | Drawer |
| --- | --- | --- | --- |
| **¿Apila pantallas?** | Sí. Mantiene el historial hacia atrás. | No. Son rutas paralelas independientes. | No. Funciona igual que los Tabs pero visualmente distinto. |
| **¿Cómo cambia de pantalla el usuario?** | Mediante botones/links en la interfaz, o el botón físico/gesto de "Atrás" del celular. | Tocando los accesos directos en la barra de navegación (generalmente inferior). | Deslizando el dedo desde el borde lateral o tocando el ícono de menú "hamburguesa". |
| **¿Desde dónde se importa en SDK 57?** | `expo-router` | `expo-router` | `expo-router/drawer` |
| **Un caso de uso típico** | Flujos secuenciales: un proceso de compra (checkout) o entrar a ver el detalle de un pedido. | Navegación principal rápida: Inicio, Buscar, Carrito, Perfil. | Menús secundarios con muchas opciones: Configuración, Ayuda, Historial, Términos Legales. |   

**D2. Cada tab tiene su pila**

- ¿Qué pantalla ve? 

    Ve el detalle del producto 4.

- ¿Por qué?

    Porque en Expo Router cada pestaña (Tab) mantiene su propio historial de navegación (Stack) en la memoria de forma independiente. Cambiar a la pestaña Inicio simplemente oculta el Stack de Productos, pero no lo destruye ni lo reinicia. Al volver, retomás la navegación exactamente donde la dejaste.

- ¿Qué app que uses todos los días se comporta así? 

    Instagram, Twitter/X o Spotify. Si entrás al perfil de un artista en la lupa (búsqueda), cambiás al Inicio y luego volvés a tocar la lupa, el perfil del artista sigue abierto esperándote.


**D3. ¿Dónde va cada pantalla?**
    
    La regla para anidar navegadores es simple: si querés que la barra inferior se siga viendo, la pantalla debe ser "hija" de los Tabs. Si querés tapar toda la pantalla, debe estar al nivel del Stack raíz.

- a) El detalle de un producto, que debe mantener visible la barra de pestañas:
    
    Va dentro de una tab (específicamente, en el Stack interno de la pestaña Productos).

- b) Un modal para confirmar una compra, que debe tapar la barra de pestañas: 
    
    Va en el Stack raíz (afuera de la carpeta (tabs)). Al estar por encima en la jerarquía, tapa absolutamente todo.

- c) La pantalla de login que se abre como modal: 

    Va en el Stack raíz. Los flujos de autenticación siempre deben controlar la pantalla completa.

- d) La pantalla “Mis pedidos anteriores” dentro de la sección Perfil:

     Va dentro de una tab (en el Stack interno de la pestaña Perfil). Es una navegación profunda convencional donde el usuario sigue necesitando sus accesos directos principales.



**D4. Configurar el Stack
Observá el layout y respondé**`
```
src/app/_layout.tsx
import { Stack } from 'expo-router';
export default function LayoutRaiz() {
 return (
 <Stack screenOptions={{ headerBackButtonDisplayMode: 'minimal' }}>
 <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
 <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
 <Stack.Screen
 name="hoja"
 options={{ presentation: 'formSheet', sheetAllowedDetents: [0.5, 0.9] }}
 />
 </Stack>
 );
}
```

-  a) ¿Qué diferencia hay entre screenOptions y las options de un Stack.Screen?

    screenOptions (se coloca en la etiqueta <Stack>) aplica una configuración global para todas las pantallas de ese Stack (ej. poner todas las cabeceras rojas).

    options (se coloca en la etiqueta <Stack.Screen>) aplica configuraciones individuales solo para esa pantalla en particular, y tiene prioridad sobre las globales (las pisa/sobrescribe).

- b) ¿Por qué (tabs) tiene headerShown: false?
    
    Porque el navegador de Tabs (pestañas) ya genera su propia cabecera superior por defecto. Si no ocultas la del Stack padre, la pantalla mostraría dos cabeceras apiladas una arriba de la otra (el "double header problem").

- c) Si existe src/app/perfil-publico.tsx pero no está declarada en el Stack, ¿existe la pantalla? ¿Para qué sirve declararla?

    
    Sí, existe. Expo Router se basa en el sistema de archivos: el simple hecho de crear el archivo ya genera la ruta navegable.

    Sirve declararla en el _layout.tsx usando <Stack.Screen name="perfil-publico"/> únicamente cuando necesitas modificar sus options (por ejemplo, cambiarle el título o la animación de entrada).

- d) Nombrá cuatro valores posibles de presentation. ¿Cuál usarías para una hoja inferior que se abre al 50%?

    Valores: card, modal, transparentModal, fullScreenModal, formSheet.

    Para una hoja inferior (bottom sheet) usarías formSheet (nativo en iOS) o transparentModal (si combinas la pantalla con una vista que ocupa el 50% de la altura y un fondo translúcido).

- e) ¿Cómo cambiarías el título del header desde la propia pantalla de detalle para que diga “Producto 7”?

```
import { Stack } from 'expo-router';

export default function DetalleProducto() {
  return (
    <>
      <Stack.Screen options={{ title: 'Producto 7' }} />
      <Text>Contenido del producto...</Text>
    </>
  );
  // se importa Stack de expo-router y se coloc el componente de configuración directamente dentro del return
}
```

**D5. Tabs y Drawer en SDK 57**

- a) ¿Qué cambió en SDK 57 al importar Tabs? ¿Qué alternativa experimental existe?

    En las versiones más recientes, la importación clásica de Tabs desde expo-router se mantiene, pero Expo está introduciendo componentes de interfaz gráfica universales y nativos. La alternativa experimental suele ser importar desde la nueva biblioteca de componentes de Expo (como los módulos en fase experimental de expo-router/ui o adaptaciones a React Navigation v7) que buscan mejor rendimiento nativo.

- b) ¿Qué dos paquetes necesita el Drawer y qué componente conviene poner en el layout raíz para los gestos?

    Paquetes: react-native-gesture-handler y react-native-reanimated.

    Componente raíz: Envolvemos todo el contenido del layout principal con <GestureHandlerRootView> (aplicándole style={{ flex: 1 }}) para que el sistema reconozca físicamente el gesto de arrastrar el dedo por la pantalla.

-  c) ¿Hace falta instalar @react-navigation/drawer en SDK 57? ¿Por qué?

    Sí, hace falta. Aunque Expo Router facilita el enrutamiento y permite importar Drawer desde expo-router/drawer, no incluye el código pesado de esa librería en su núcleo base. Esto se hace a propósito para no engordar el tamaño de las aplicaciones que solo usan Stack o Tabs. Expo delega esa instalación al desarrollador como una dependencia adicional.

- d) Si hay navegadores anidados, ¿en qué navegador actúa router.back()?

    Actúa siempre en el navegador que está en foco (el más interno o profundo). Por ejemplo, un Stack dentro de una pestaña (Tab), al ejecutar router.back() se desapilará la pantalla del Stack interno. Si el Stack interno ya se vació y no tiene a dónde retroceder, la acción sube al navegador padre para ver si este puede manejar el retroceso


## Parte E: Rutas dinámicas, parámetros y hooks

**E1. Encontrá el error**
- Los productos tienen id numérico ({ id: 3, nombre: "Chipá" }). La pantalla nunca encuentra el
producto. Explicá por qué y corregilo.

```
src/app/(tabs)/productos/[id].tsx
export default function DetalleProducto() {
 const { id } = useLocalSearchParams<{ id: string }>();
 const producto = productos.find((p) => p.id === id);
 if (id === 3) console.log('Es el chipá');
 if (!producto) return <Text>No existe el producto {id}</Text>;
 return <Text>{producto.nombre}</Text>;
}
```

El error ocurre por una diferencia en los tipos de datos. El hook useLocalSearchParams() siempre devuelve cadenas de texto (strings) extraídas de la URL. id vale "3" (texto), pero en el array productos el id es 3 (número). Al usar === , la comparación "3" === 3 resulta en false.

Correccion: 
```
import { Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function DetalleProducto() {
 const { id } = useLocalSearchParams<{ id: string }>();
 
 // Convertimos el string a número
 const idNumerico = Number(id); 
 
 const producto = productos.find((p) => p.id === idNumerico);
 
 if (idNumerico === 3) console.log('Es el chipá');
 
 if (!producto) return <Text>No existe el producto {id}</Text>;
 
 return <Text>{producto.nombre}</Text>;
}
```
**E2. Catch-all**

Para src/app/docs/[...slug].tsx, indicá el valor de slug en cada caso:

| URL | Valor de `slug` que devuelve |
| --- | --- |
| `/docs/react` | `["react"]` |
| `/docs/react/hooks/useState` | `["react", "hooks", "useState"]` |
| `/docs` | Error 404 (o `undefined`). El catch-all `[...]` exige al menos un segmento. Para que funcione con `/docs` vacío, usar corchetes dobles: `[[...slug]].tsx`. |   

**E3. Anatomía de una URL**
- Dada la URL rutasipf://buscar?q=mate&categoria=bebidas:

a) Identificá el scheme, la ruta y los parámetros de búsqueda.

Scheme: rutasipf:// (es el identificador de la app en el dispositivo).

Ruta (path): buscar (corresponde al archivo buscar.tsx).

Parámetros (query params): q=mate y categoria=bebidas.

b) ¿Qué devuelve useLocalSearchParams() en buscar.tsx?

Devuelve un objeto de JavaScript con los parámetros parseados:
{ q: "mate", categoria: "bebidas" }

c) ¿Hacen falta corchetes en el nombre del archivo para recibir q? ¿Por qué?

No. Los corchetes en el nombre de archivo (como [id].tsx) son exclusivos para parámetros de ruta dinámica (cuando el dato es parte de la ruta, ej: /producto/3). Los parámetros de búsqueda que van después del signo de interrogación (?q=mate) son globales y el hook useLocalSearchParams() puede atraparlos en cualquier pantalla estándar sin modificar el nombre del archivo

d) En el buscador, cada vez que el usuario escribe se llama a router.setParams({ q: texto }) en lugar de router.push. Dá dos razones.

Evita llenar el historial: Si uso push, cada letra tipeada apilaría una pantalla nueva. Al querer salir del buscador, el usuario tendría que presionar "Atrás" muchas de veces.

Rendimiento y experiencia: setParams actualiza los parámetros en la pantalla actual de forma silenciosa e instantánea. Usar push forzaría a la aplicación a renderizar la vista de nuevo y dispararía animaciones de transición de navegación en cada tecla presionad


**E4. ¿Dónde estoy?**
- Completá los valores de cada hook en las dos URLs de la app de ejemplo (buscar.tsx está en el
Stack raíz; el detalle está en (tabs)/productos/[id].tsx).

| Hook | En `/productos/3` | En `/buscar?q=chipa` |
| --- | --- | --- |
| `usePathname()` | `"/productos/3"` | `"/buscar"` |
| `useSegments()` | `["(tabs)", "productos", "[id]"]` | `["buscar"]` |
| `useLocalSearchParams()` | `{ id: "3" }` | `{ q: "chipa" }` |   


**E5. Local vs global**

- a) ¿Cuál es la diferencia entre useLocalSearchParams y useGlobalSearchParams? ¿Cuál es la opción por defecto y por qué?

    Diferencia: useLocalSearchParams devuelve únicamente los parámetros que pertenecen a la pantalla actual en la que estás. useGlobalSearchParams devuelve los parámetros de toda la URL global, atrapando incluso los datos de otras pantallas anidadas que están en segundo plano.

    Por defecto: Se debe usar useLocalSearchParams.

    Por qué: Por rendimiento y aislamiento. Evita que la pantalla actual se vuelva a renderizar accidentalmente solo porque cambió un parámetro en otra pestaña o pantalla oculta que no tiene nada que ver con tu vista actual.

- b) ¿Para qué sirve useFocusEffect? Dá un ejemplo de uso.

    Sirve para ejecutar código cada vez que la pantalla vuelve a estar visible para el usuario. Como Expo Router mantiene las pantallas de los Tabs o Stacks "vivas" en la memoria aunque navegues a otra vista, un useEffect normal solo se ejecutaría la primera vez que se carga la pantalla. useFocusEffect se dispara cada vez que entrás a ella.

    Ejemplo de uso: Recargar los datos desde la API al entrar a la pestaña "Mis Pedidos". Si el usuario hizo un pedido, cambió a otra pestaña y luego volvió, useFocusEffect asegura que la lista se actualice para mostrar el estado más reciente, evitando mostrar datos viejos.

- c) La URL /productos/mate abre la pantalla de detalle aunque no exista ese producto. ¿Es un error de Expo Router? ¿De quién es la responsabilidad?

    No es un error de Expo Router. El enrutador cumplió su única función: vio que la URL coincidía con el patrón estructural /productos/[id] y abrió el archivo correspondiente, pasándole la palabra "mate" como parámetro id.

    La responsabilidad es del desarrollador. El código dentro de [id].tsx es el encargado de la lógica de negocio. Debe tomar ese id, ir a buscarlo al array de productos o base de datos y, si no lo encuentra, encargarse de mostrar un mensaje de "Producto no encontrado" o redirigir al usuario.

**F1. Redirect**

- a) ¿Qué hace <Redirect href="/productos" /> y a qué método de router equivale?

    El componente <Redirect href="/ruta"/> navega automáticamente a la ruta indicada en el momento exacto en que se renderiza. Equivale programáticamente a utilizar el método router.replace('/ruta').

- b) ¿Por qué una redirección debe reemplazar y no apilar? Describí el problema que aparecería.

    Debe reemplazar (replace) para no dejar basura en el historial. Si apilara (push), la pantalla de origen (ej. una vista de Login o una ruta prohibida) quedaría guardada en la pila. Si el usuario presiona el botón "Atrás", volvería a esa pantalla, la cual lo volvería a redirigir automáticamente hacia adelante, creando un bucle infinito o un comportamiento errático.


**F2. Stack.Protected**

```
src/app/_layout.tsx
function NavegacionRaiz() {
 const { usuario } = useAuth();
 const conSesion = usuario !== null;
 return (
  <Stack>
   <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
   <Stack.Protected guard={conSesion}>
    <Stack.Screen name="privado" />
   </Stack.Protected>
   <Stack.Protected guard={!conSesion}>
    <Stack.Screen name="login" options={{ presentation: 'modal' }} />
   </Stack.Protected>
  </Stack>
 );
}
```


- a) ¿Qué le pasa a una pantalla cuando su guard es false?

    La pantalla se desmonta por completo y desaparece del árbol de navegación. Expo Router elimina su ruta de la memoria, por lo que es imposible acceder a ella mediante la URL o botones, garantizando que el usuario no pueda verla ni por error.

- b) Al iniciar sesión, el modal de login se    cierra solo, sin llamar a router.back(). ¿Por qué?
    
    Porque al iniciar sesión cambia la variable de estado (conSesion pasa a ser true), lo que obliga a React a volver a renderizar todo el _layout.tsx. Al reevaluarse, el guard={!conSesion} del login pasa a ser false, por lo que el componente del modal simplemente se destruye y desaparece de la pantalla de forma automática.

- c) Aparece el aviso “The action ‘NAVIGATE’ … was not handled by any navigator”. ¿Qué lo causa y cómo se evita?

    Causa: Ocurre si intentás forzar la navegación por código (ej. ejecutando router.push('/privado')) hacia una pantalla que en ese momento está oculta porque su guard es false.

    Cómo se evita: No uses métodos de navegación manuales para entrar o salir de flujos protegidos. Dejá que el simple cambio de estado (ej. setUsuario(datos)) sea el que actualice el layout y te muestre las pantallas correspondientes.

- d) ¿Qué ventaja tiene Stack.Protected (o layout condicional) frente a poner un <Redirect> condicional en cada pantalla?

    Centraliza toda la seguridad en un único archivo (_layout.tsx), evitando que te olvides de proteger una pantalla nueva en el futuro. Además, mejora la experiencia del usuario al evitar el parpadeo visual (flicker) que ocurre cuando una pantalla usa <Redirect>, ya que esta llega a dibujarse durante una fracción de segundo antes de expulsarte.


**F3. 404, anchor y rutas tipadas**

Explicá brevemente para qué sirve cada uno y en qué archivo se define:

- a) +not-found.tsx

    Para qué sirve: Es la pantalla de error genérica (404) que se muestra automáticamente cuando el usuario intenta navegar a una ruta que no existe o a un enlace roto.

    Dónde se define: Directamente en la raíz de la carpeta de la aplicación, es decir, en src/app/+not-found.tsx.

- b) export const unstable_settings = { anchor: "(tabs)" }

    Para qué sirve: Configura el comportamiento de la aplicación cuando se entra desde un enlace profundo. Asegura que el grupo de pestañas ((tabs)) se cargue como base en el historial ("ancla"), garantizando que la barra de navegación inferior se renderice correctamente en segundo plano para que el usuario pueda usarla tras abrir el enlace.

    Dónde se define: En los archivos de diseño (_layout.tsx), habitualmente en el layout raíz o en el que envuelve directamente a las rutas implicadas.

- c) typedRoutes: ¿qué pasa si escribís <Link href="/prodcutos" />? ¿Dónde se generan los tipos?

    Qué pasa: TypeScript lo detecta en tiempo de desarrollo y marca el enlace con un error (subrayado rojo). Al usar el tipado estricto, valida que el destino coincida con una ruta real, evitando enlaces rotos antes de ejecutar la app.

    Dónde se generan: Expo Router genera estos tipos automáticamente de forma constante en la carpeta oculta del proyecto, dentro del archivo .expo/types/router.d.ts.

**F4. Deep links**
- La app tiene "scheme": "comedoripf" en app.json y la compu de desarrollo tiene la IP 192.168.1.20.
Escribí la URL que abre el plato 7 (/menu/7) en cada caso:

| Dónde | URL |
| --- | --- |
| App instalada (build propia) | `comedoripf://menu/7` |
| Expo Go en desarrollo | `exp://192.168.1.20:8081/--/menu/7` |
| Web (`npx expo start --web`) | `http://localhost:8081/menu/7` (o usando tu IP: `http://192.168.1.20:8081/menu/7`) |   


- ¿Qué significa la parte /--/ en la URL de Expo Go?

    Funciona como un separador. Le indica a la aplicación de Expo Go que todo lo que está a la izquierda es la dirección para conectarse al servidor de desarrollo (la IP de tu compu), y todo lo que está a la derecha es la ruta interna de la app a la que el usuario quiere navegar (el enlace profundo real).

- ¿Por qué el scheme propio no funciona dentro de Expo Go?

    Porque Expo Go es una aplicación nativa precompilada que ya está instalada en tu celular, por lo que solo tiene registrado ante el sistema operativo su propio scheme oficial (exp://). Android e iOS no permiten registrar un scheme nuevo (como comedoripf://) de forma dinámica o "al vuelo". Para que el celular reconozca un scheme personalizado, es obligatorio compilar tu propia versión de la aplicación (crear una Development Build o el APK/AAB final).



**F5. Errores comunes**

- a) Al usar <Link> con un componente hijo (como <Pressable>) aparece: “You are passing an array of styles to a child of <Link>”.

    Causa: Por defecto, el componente <Link> intenta envolver su contenido y gestionar los estilos. Si le ponés adentro un componente nativo (como un Pressable o un View) que recibe un arreglo de estilos (ej: style={[styles.boton, styles.activo]}), el Link no sabe cómo inyectarle correctamente sus propiedades de navegación y estilos a ese arreglo, generando un conflicto.

    Solución: Agregarle la propiedad asChild al Link (ej: <Link asChild href="/ruta">). Esto le dice a Expo Router: "No intentes envolver a mi componente, simplemente pasale tus poderes de navegación al hijo que te puse adentro".

- b) Un compañero creó src/app/TarjetaProducto.tsx para reutilizar un componente y ahora la app tiene una ruta nueva.

    Causa: Expo Router usa un enrutamiento estricto basado en archivos. Absolutamente cualquier archivo .tsx o .jsx que crees dentro de la carpeta app/ (salvo los que empiezan con _ o +) se convierte automáticamente en una pantalla navegable (en este caso, generó la ruta /TarjetaProducto).

    Solución: Mover los componentes reutilizables fuera de la carpeta app/. La convención es crear una carpeta separada, por ejemplo src/components/TarjetaProducto.tsx, y luego importarlo en las pantallas que lo necesiten.

- c) Después de iniciar sesión se usa router.push("/") y, al tocar atrás, el usuario vuelve al login.

    Causa: El método push apila la pantalla de Inicio encima de la de Login. Al quedar el Login en el historial, el usuario puede retroceder hacia él presionando el botón físico "Atrás" de su celular.

    Solución: Cambiar router.push("/") por router.replace("/"). El método replace destruye la pantalla actual (Login) y pone la nueva (Inicio) en su lugar, eliminando la posibilidad de volver atrás a una vista que no corresponde.

- d) Expo Go dice que el proyecto es incompatible después de instalar un paquete con npm install.

    Causa: Usar npm install descarga la última versión existente de una librería. Esa versión nueva puede depender de código nativo (Android/iOS) que la versión de tu Expo Go (ej. SDK 57) no tiene o no soporta.

    Solución: Desinstalar el paquete y volver a instalarlo usando npx expo install nombre-del-paquete. Este comando lee qué versión de SDK estás usando y descarga automáticamente la versión exacta de la librería que está certificada para funcionar con tu proyecto.