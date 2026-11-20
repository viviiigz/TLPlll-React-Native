import { Tabs } from 'expo-router/js-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTema } from '../../hooks/useTema';

export default function TabsLayout() {
  const colores = useTema();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colores.primario,
        tabBarInactiveTintColor: colores.textoSecundario,
        tabBarStyle: {
          backgroundColor: colores.superficie,
          borderTopColor: colores.borde,
        },
        headerStyle: { backgroundColor: colores.superficie },
        headerTintColor: colores.texto,
      }}
    >
      <Tabs.Screen
        name="(catalogo)"
        options={{
          title: 'Catálogo',
          headerShown: false,
          tabBarIcon: ({ focused, size }) => (
            <Ionicons
              name={focused ? 'library' : 'library-outline'}
              size={size}
              color={focused ? colores.primario : colores.textoSecundario}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="reservas"
        options={{
          title: 'Mis reservas',
          tabBarIcon: ({ focused, size }) => (
            <Ionicons
              name={focused ? 'bookmark' : 'bookmark-outline'}
              size={size}
              color={focused ? colores.primario : colores.textoSecundario}
            />
          ),
        }}
      />
    </Tabs>
  );
}
