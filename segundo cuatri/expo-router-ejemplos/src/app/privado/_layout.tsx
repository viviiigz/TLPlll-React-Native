/**
 * LAYOUT DE LA ZONA PRIVADA  →  src/app/privado/_layout.tsx
 *
 * Toda la carpeta privado/ está protegida desde el layout raíz, así que
 * cualquier pantalla que agreguemos acá queda protegida automáticamente.
 */
import { Stack } from 'expo-router';

export default function LayoutPrivado() {
  return (
    <Stack screenOptions={{ headerBackButtonDisplayMode: 'minimal' }}>
      <Stack.Screen name="index" options={{ title: 'Zona privada' }} />
      <Stack.Screen name="ajustes" options={{ title: 'Ajustes de la cuenta' }} />
    </Stack>
  );
}
