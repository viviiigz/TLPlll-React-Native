import { Drawer } from 'expo-router/drawer';
import { Pressable, Text } from 'react-native';
import { useAppContext } from '../../context/AppContext';
import { router } from 'expo-router';

export default function CocinaLayout() {
  const { logout } = useAppContext();

  const handleCerrarSesion = () => {
    logout();
    router.replace('/');
  };

  return (
    <Drawer
      screenOptions={{
        headerStyle: { backgroundColor: '#1f2937' },
        headerTintColor: '#fff',
        drawerActiveTintColor: '#10b981',
        // Agregamos el botón de salir directamente en el header derecho de todo el Drawer
        headerRight: () => (
          <Pressable onPress={handleCerrarSesion} style={{ marginRight: 15 }}>
            <Text style={{ color: '#ef4444', fontWeight: 'bold' }}>Salir</Text>
          </Pressable>
        ),
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          drawerLabel: '⏳ Pendientes (Cola)',
          title: 'Panel de Cocina',
        }}
      />
      <Drawer.Screen
        name="atendidos"
        options={{
          drawerLabel: '✅ Atendidos (Pila)',
          title: 'Historial de Despachados',
        }}
      />
    </Drawer>
  );
}