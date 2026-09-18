/**
 * LAYOUT RAÍZ  →  src/app/_layout.tsx
 *
 * Es el primer archivo que carga Expo Router. Todo lo que está en `src/app`
 * se renderiza "dentro" de este layout.
 *
 * Acá definimos:
 *  - Los providers globales (gestos, sesión, tema).
 *  - El navegador principal: un <Stack> (una PILA de pantallas).
 *  - Las rutas protegidas con <Stack.Protected>.
 */
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { Colores } from '@/constants/theme';
import { AuthProvider, useAuth } from '@/context/auth';

/**
 * `anchor` indica qué pantalla queda "debajo" si alguien abre la app
 * directamente en otra ruta (por ejemplo con un deep link a /modal).
 * Así siempre existe una pantalla a la cual volver.
 */
export const unstable_settings = {
  anchor: '(tabs)',
};

export default function LayoutRaiz() {
  const esquema = useColorScheme();
  const base = esquema === 'dark' ? DarkTheme : DefaultTheme;
  const paleta = esquema === 'dark' ? Colores.dark : Colores.light;

  const tema = {
    ...base,
    colors: { ...base.colors, primary: paleta.primario, background: paleta.fondo, card: paleta.superficie },
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <ThemeProvider value={tema}>
          <NavegacionRaiz />
          <StatusBar style="auto" />
        </ThemeProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

function NavegacionRaiz() {
  const { usuario } = useAuth();
  const conSesion = usuario !== null;

  return (
    <Stack screenOptions={{ headerBackButtonDisplayMode: 'minimal' }}>
      {/* Grupo (tabs): los paréntesis hacen que NO aparezca en la URL */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      {/* Rutas "comunes" que se apilan encima de las tabs */}
      <Stack.Screen name="pila/[nivel]" options={{ title: 'Pila de pantallas' }} />
      <Stack.Screen name="estructuras" options={{ title: 'Pila vs Cola' }} />
      <Stack.Screen name="buscar" options={{ title: 'Buscar productos' }} />
      <Stack.Screen name="docs/[...slug]" options={{ title: 'Documentación' }} />
      <Stack.Screen name="menu" options={{ headerShown: false }} />

      {/* Formas de presentación distintas a la tarjeta normal */}
      <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Soy un modal' }} />
      <Stack.Screen
        name="hoja"
        options={{
          presentation: 'formSheet',
          sheetAllowedDetents: [0.5, 0.9],
          sheetGrabberVisible: true,
          headerShown: false,
        }}
      />

      {/* RUTAS PROTEGIDAS: solo existen cuando `guard` es true */}
      <Stack.Protected guard={conSesion}>
        <Stack.Screen name="privado" options={{ headerShown: false }} />
      </Stack.Protected>

      <Stack.Protected guard={!conSesion}>
        <Stack.Screen name="login" options={{ presentation: 'modal', title: 'Iniciar sesión' }} />
      </Stack.Protected>

      <Stack.Screen name="+not-found" options={{ title: 'Página no encontrada' }} />
    </Stack>
  );
}
