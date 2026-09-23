import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import { AppProvider, useAppContext } from '../context/AppContext';

function NavegacionRaiz() {
  const { usuario } = useAppContext();
  const conSesion = usuario !== null;

  return (
    <Stack>
      {/* grupo de pesatñas */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      
      {/* modales y pantallas del Stack raíz */}
      <Stack.Screen name="confirmar" options={{ presentation: 'modal', title: 'Confirmar Pedido' }} />
      <Stack.Screen name="buscar" options={{ title: 'Buscador' }} />
      <Stack.Screen name="categorias/[categoria]" options={{ title: 'Categoría' }} />
      
      {/* Ll pantalla de turno oculta el botón "Atrás" por requerimiento*/}
      <Stack.Screen name="turno/[numero]" options={{ title: 'Tu Turno', headerBackVisible: false, gestureEnabled: false }} />
      
      {/* rutas protegidas */}
      <Stack.Protected guard={conSesion}>
        <Stack.Screen name="cocina" options={{ headerShown: false }} />
      </Stack.Protected>
      
      <Stack.Protected guard={!conSesion}>
        <Stack.Screen name="login" options={{ presentation: 'modal', title: 'Ingreso Cocina' }} />
      </Stack.Protected>
      
      <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
    </Stack>
  );
}

export default function Layout() {
  // GestureHandlerRootView es obligatorio en la raíz para que funcione el Drawer
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProvider>
        <NavegacionRaiz />
      </AppProvider>
    </GestureHandlerRootView>
  );
}