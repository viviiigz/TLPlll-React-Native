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
  const { hidratado, sesionPersonal } = useBiblioteca();

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
      <Stack.Screen name="buscar" options={{ title: 'Buscar libros' }} />
      <Stack.Screen name="escanear" options={{ title: 'Escanear libro' }} />
      <Stack.Screen
        name="reservar/[isbn]"
        options={{
          title: 'Confirmar reserva',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="permisos/[recurso]"
        options={{
          title: 'Permiso necesario',
          presentation: 'modal',
        }}
      />

      <Stack.Protected guard={!sesionPersonal}>
        <Stack.Screen
          name="login"
          options={{
            title: 'Ingreso de personal',
            presentation: 'modal',
          }}
        />
      </Stack.Protected>

      <Stack.Protected guard={sesionPersonal}>
        <Stack.Screen
          name="mostrador"
          options={{
            title: 'Mostrador de biblioteca',
          }}
        />
      </Stack.Protected>

      <Stack.Screen name="+not-found" options={{ title: 'No encontrada' }} />
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
