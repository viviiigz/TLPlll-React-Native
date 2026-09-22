import { Stack } from 'expo-router';

export default function MenuLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Menú del Día' }} />
      {/* el titulo exacto del detalle se configura dinámicamente en la pantalla [id] */}
      <Stack.Screen name="[id]" options={{ title: 'Cargando...' }} />
    </Stack>
  );
}