import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import { AppProvider, useAppContext } from '../context/AppContext';

function NavegacionRaiz() {
  const { usuario } = useAppContext();
  const conSesion = usuario !== null;

  return (
    <Stack>
      {/* grupo de pestañas */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      
      {/* modales y pantallas del Stack raíz */}
      <Stack.Screen name="confirmar" options={{ presentation: 'modal', title: 'Confirmar Pedido' }} />
      <Stack.Screen name="buscar" options={{ title: 'Buscador' }} />
      <Stack.Screen name="categorias/[categoria]" options={{ title: 'Categoría' }} />
      
      {/* {a pantalla de turno oculta el botón "Atrás" por requerimiento */}
      <Stack.Screen name="turno/[numero]" options={{ title: 'Tu Turno', headerBackVisible: false, gestureEnabled: false }} />
      
      {/* rutas de Ayuda (indice y catch-all) */}
      <Stack.Screen name="ayuda/index" options={{ title: 'Centro de Ayuda' }} />
      <Stack.Screen name="ayuda/[...slug]" options={{ title: 'Artículo de Ayuda' }} />      
      {/* rutas protegidas */}
      <Stack.Protected guard={conSesion}> 
        <Stack.Screen name="cocina" options={{ headerShown: false }} />
      </Stack.Protected>
      
      <Stack.Screen name="pedido" options={{ headerShown: false }} />

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