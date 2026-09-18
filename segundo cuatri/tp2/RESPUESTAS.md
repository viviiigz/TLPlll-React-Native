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
(1) `console.log(p.tope());` -> 
(2) `console.log(p.pop());` -> 
(3) `console.log(p.tope());` -> 
(4) `console.log(p.vacia);` -> 
*Estado final de la pila (de base a tope):* 

**A3. Seguimiento de una cola**
(1) `console.log(c.frente());` -> 
(2) `console.log(c.desencolar());` -> 
(3) `console.log(c.vacia);` -> 
*Estado final de la cola (de frente a final):* 

**A4. Análisis de la implementación**
a) ¿Qué significa el # y qué problema evita?
*Respuesta:*

b) ¿Qué problema de rendimiento tiene shift() con colas muy grandes? ¿Cómo lo resuelven las colas "serias"?
*Respuesta:*

c) ¿Qué método de array usa la pila para sacar y cuál usa la cola? ¿Por qué no pueden usar el mismo?
*Respuesta:*

**A5. Programación: una cola eficiente**
\`\`\`javascript
// Tu clase ColaEficiente aquí
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