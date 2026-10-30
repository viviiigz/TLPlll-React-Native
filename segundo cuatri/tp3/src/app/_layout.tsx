import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';

export {
  // capturo errores que puedan suceder en el arbol de navegacion
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

// evito que el splash screen se oculte antes de cargar las fuentes necesarias
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // cargo las fuentes desde la carpeta de assets
  const [loaded, error] = useFonts({
    SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    // aplico el tema segun la preferencia del sistema
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        {/* la barra de pestañas principal con las tres pantallas requeridas */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* pantallas del flujo de creacion y detalle de reportes */}
        <Stack.Screen
          name="reporte/nuevo"
          options={{ title: 'Nuevo Reporte', headerBackTitle: 'Volver' }}
        />
        <Stack.Screen
          name="reporte/escanear"
          options={{ title: 'Escanear QR de Aula', headerBackTitle: 'Volver' }}
        />
        <Stack.Screen
          name="reporte/foto"
          options={{ title: 'Adjuntar Foto', headerBackTitle: 'Volver' }}
        />
        <Stack.Screen
          name="reporte/ubicacion"
          options={{ title: 'Marcar Ubicación', headerBackTitle: 'Volver' }}
        />
        <Stack.Screen
          name="reporte/[id]"
          options={{ title: 'Detalle del Reporte', headerBackTitle: 'Reportes' }}
        />

        {/* pantalla de ajustes de notificaciones */}
        <Stack.Screen
          name="ajustes-app"
          options={{ title: 'Ajustes de la App', headerBackTitle: 'Volver' }}
        />

        {/* pantalla previa a los permisos con comportamiento modal como pide la consigna */}
        <Stack.Screen
          name="permisos/[recurso]"
          options={{
            presentation: 'modal',
            title: 'Permiso Requerido',
            headerShown: false,
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
