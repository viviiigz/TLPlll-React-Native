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
a) ¿Qué significa el # y qué problema evita?

*Respuesta:*

El símbolo # convierte a la propiedad (como #items) en un campo privado de la clase. Esto evita que código externo pueda acceder o modificar el array directamente (por ejemplo, impidiendo que alguien haga pila.#items.length = 0). Garantiza el encapsulamiento para que la estructura solo pueda modificarse usando los métodos permitidos (push, pop, etc.).

b) ¿Qué problema de rendimiento tiene shift() con colas muy grandes? ¿Cómo lo resuelven las colas "serias"?

*Respuesta:*

El método shift() elimina el primer elemento del array, lo que obliga a JavaScript a reasignar los índices de todos los elementos restantes uno por uno hacia atrás. En colas grandes, esto consume mucha memoria y tiempo de procesamiento. Las colas eficientes lo resuelven utilizando un puntero (un índice guardado en una variable) que avanza para indicar cuál es el nuevo "frente", sin necesidad de reacomodar todo el array en cada extracción.

c) ¿Qué método de array usa la pila para sacar y cuál usa la cola? ¿Por qué no pueden usar el mismo?

*Respuesta:*

La pila usa pop() y la cola usa shift(). No pueden usar el mismo método porque obedecen lógicas contrarias: la pila debe sacar el último elemento que ingresó al final del array (comportamiento LIFO), mientras que la cola está obligada a sacar el elemento más antiguo que se encuentra al principio del array (comportamiento FIFO).

**A5. Programación: una cola eficiente**
\`\`\`javascript
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
\`\`\`

**A6. Pila y cola dentro de Expo Router**
a) ¿Qué estructura describe el historial de pantallas de un Stack? ¿Qué pantalla es la visible y qué operación hace "atrás"?
*Respuesta:*

b) ¿Qué estructura usa Expo Router para las acciones de navegación? ¿Qué pasa si el usuario toca dos links muy rápido?
*Respuesta:*

## Parte B: Rutas basadas en archivos

**B1. Del archivo a la URL**
*(Completar tabla)*

**B2. De la URL al archivo**
*(Completar tabla)*

**B3. Verdadero o falso**
*(Completar a-h con V o F y justificar falsas)*

## Parte C: Navegar: `<Link>`, router y la pila

**C1. Métodos de router**
*(Completar tabla)*

**C2. Simulación de la pila**
*(Completar 1 al 8)*

**C3. ¿Link o router?**
*(Completar a-e)*

**C4. Escribí el código**
*(Completar a-c)*

**C5. Pensar**
*(Responder)*

## Parte D: Navegadores: Stack, Tabs y Drawer

**D1 a D5**
*(Respuestas de la parte D)*

## Parte E: Rutas dinámicas, parámetros y hooks

**E1 a E5**
*(Respuestas de la parte E)*

## Parte F: Redirecciones, rutas protegidas y deep links

**F1 a F5**
*(Respuestas de la parte F)*