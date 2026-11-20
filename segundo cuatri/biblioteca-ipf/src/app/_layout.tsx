import { Stack } from 'expo-router';
import { EstadoPantalla } from '../components/EstadoPantalla';
import {
  BibliotecaProvider,
  useBiblioteca,
} from '../context/BibliotecaContext';
import { useTema } from '../hooks/useTema';

export const unstable_settings = {
  anchor: '(tabs)',
};

function NavegadorRaiz() {
  const colores = useTema();
  const { hidratado } = useBiblioteca();

  if (!hidratado) {
    return (
      <EstadoPantalla
        tipo="cargando"
        mensaje="Preparando Biblioteca IPF..."
      />
    );
  }

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

export default function RootLayout() {
  return (
    <BibliotecaProvider>
      <NavegadorRaiz />
    </BibliotecaProvider>
  );
}
