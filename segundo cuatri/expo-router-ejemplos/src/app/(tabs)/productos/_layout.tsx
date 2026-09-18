/**
 * STACK ANIDADO  →  src/app/(tabs)/productos/_layout.tsx
 *
 * Esta pestaña tiene su PROPIA pila. Si entrás a un producto, cambiás a
 * "Inicio" y volvés a "Productos", el detalle sigue ahí: cada tab
 * recuerda su historial por separado.
 *
 * Árbol de navegadores:
 *   Stack (raíz) → Tabs → Stack (productos) → index | [id]
 */
import { Stack } from 'expo-router';

export default function LayoutProductos() {
  return (
    <Stack screenOptions={{ headerBackButtonDisplayMode: 'minimal' }}>
      <Stack.Screen name="index" options={{ title: 'Productos' }} />
      <Stack.Screen name="[id]" options={{ title: 'Detalle' }} />
    </Stack>
  );
}
