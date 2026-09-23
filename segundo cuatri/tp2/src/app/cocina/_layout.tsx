import { Stack } from 'expo-router';

export default function CocinaLayout() {
  return (
    <Stack>
      {/* headerShown en false para qe el diseño se luzca sin la barra nativa arriba */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}