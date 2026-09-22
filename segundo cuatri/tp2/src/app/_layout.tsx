import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import { AppProvider, useAppContext } from '../context/AppContext';

// Separamos la navegación en un componente interno para poder usar el hook useAppContext()
function NavegacionRaiz() {
  const { usuario } = useAppContext();
  const conSesion = usuario !== null;

  return (
    <Stack>
      {/* Grupo de pestañas (Tabs) base */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      
      {/* Modales y pantallas del Stack raíz */}
      <Stack.Screen name="confirmar" options={{ presentation: 'modal', title: 'Confirmar Pedido' }} />
      <Stack.Screen name="buscar" options={{ title: 'Buscador' }} />
      <Stack.Screen name="categorias/[categoria]" options={{ title: 'Categoría' }} />
      
      {/* La pantalla de turno oculta el botón "Atrás" por requerimiento G2.5 */}
      <Stack.Screen name="turno/[numero]" options={{ title: 'Tu Turno', headerBackVisible: false, gestureEnabled: false }} />
      
      {/* Rutas protegidas (Requisito G2.8) */}
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
  // GestureHandlerRootView es obligatorio en la raíz para que funcione el Drawer (Requisito G3)
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProvider>
        <NavegacionRaiz />
      </AppProvider>
    </GestureHandlerRootView>
  );
}