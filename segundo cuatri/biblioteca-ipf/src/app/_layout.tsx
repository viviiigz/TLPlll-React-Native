import { Stack } from 'expo-router';
import { useTema } from '../hooks/useTema';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colores = useTema();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colores.superficie },
        headerTintColor: colores.texto,
        contentStyle: { backgroundColor: colores.fondo },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
