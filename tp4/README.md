
# Guía Rápida de Optimización en React 🚀

Esta guía resume cuándo y cómo utilizar las herramientas de memoización para mejorar el rendimiento de tus componentes.

> **Regla de oro:** No optimices a ciegas; la optimización prematura suele traer más complejidad que beneficios.

---

## 1. React.memo (Para componentes)

*   **¿Qué hace?** Evita que un componente se vuelva a renderizar si sus props no cambiaron.
*   **¿Cuándo usarlo?** En componentes que se renderizan muchas veces (ej. ítems de una lista larga) y que reciben las mismas props frecuentemente.
*   **Regla de funcionamiento:** El componente debe estar envuelto en `memo(...)`. Si el padre se renderiza, React hará una "comparación superficial" de las props. Si son iguales, el componente hijo no se renderiza.

## 2. useCallback (Para funciones)

*   **¿Qué hace?** Memoriza la referencia de una función para que no cambie en cada renderizado.
*   **¿Cuándo usarlo?** Cuando pasas una función como prop a un componente hijo que ya está optimizado con `React.memo`.
*   **El "Combo":** Si no usas `useCallback` en el padre, la función se vuelve a crear en cada render, el hijo cree que la prop cambió y `React.memo` no sirve de nada.

## 3. useMemo (Para valores calculados)

*   **¿Qué hace?** Memoriza el resultado de un cálculo costoso (filtrar, ordenar, operaciones matemáticas complejas).
*   **¿Cuándo usarlo?** Cuando el cálculo es tan pesado que quieres evitar hacerlo en cada render si sus dependencias no han cambiado.
*   **¿Cuándo NO usarlo?** Para cálculos simples. El hook en sí tiene un costo de memoria, así que para operaciones rápidas es mejor dejar que React las haga normalmente.

---

## Tabla Resumen: El Combo de la Optimización

| Herramienta | ¿Qué memoriza? | Caso típico |
| :--- | :--- | :--- |
| **React.memo** | Un componente entero | Hijos pesados con props estables |
| **useMemo** | Un valor calculado | Cálculos costosos u objetos como prop |
| **useCallback** | Una función | Funciones pasadas a hijos memorizados |

Viviana Gonzalez