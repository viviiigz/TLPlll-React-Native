import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../../context/AppContext';

export default function TabsLayout() {
  const { pilaCarrito } = useAppContext();

  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#4ade80' }}>
      
      {/* Tab 1: Inicio */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
        }}
      />
      
      {/* Tab 2: Menú */}
      <Tabs.Screen
        name="menu"
        options={{
          title: 'Menú',
          headerShown: false, // Lo ocultamos para que el Stack interno maneje su propio header
          tabBarIcon: ({ color }) => <Ionicons name="restaurant" size={24} color={color} />,
        }}
      />
      
      {/* Tab 3: Carrito */}
      <Tabs.Screen
        name="carrito"
        options={{
          title: 'Carrito',
          headerShown: false,
          tabBarIcon: ({ color }) => <Ionicons name="cart" size={24} color={color} />,
          // Requisito G1: Badge con la cantidad de items
          tabBarBadge: pilaCarrito.vacia ? undefined : pilaCarrito.tamanio, 
        }}
      />
      
    </Tabs>
  );
}