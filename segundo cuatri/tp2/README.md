# Comedor IPF - React Native II

## Objetivo
Aplicar la teoría de Expo Router (SDK 57) para crear una app con varias pantallas, pasar datos entre ellas y proteger rutas, entendiendo cómo la pila y la cola explican lo que pasa al navegar.

## Árbol de carpetas de src/app y navegadores
* `_layout.tsx` (Raíz): **Stack Navigator**. Envuelve toda la app en el Context Provider y GestureHandlerRootView. Protege rutas con `Stack.Protected`.
  * `(tabs)/_layout.tsx`: **Tabs Navigator** (`expo-router/js-tabs`).
    * `menu/_layout.tsx`: **Stack Navigator** (mantiene las pestañas visibles al entrar al detalle).
    * `carrito/_layout.tsx`: **Stack Navigator** (para ir de los items a la nota manteniendo pestañas).
  * `cocina/_layout.tsx`: **Drawer Navigator** (`expo-router/drawer`). Protegido por sesión en el layout raíz.
  * `confirmar.tsx` y `login.tsx`: Pantallas del Stack Raíz con `presentation: 'modal'`.

## Justificación: replace vs push (Confirmación de pedido)

