/**
 * LAYOUT DE TABS  →  src/app/(tabs)/_layout.tsx
 *
 * Cada archivo o carpeta dentro de (tabs) se convierte en una pestaña.
 * Las tabs NO son una pila: cambiar de pestaña no "apila" pantallas,
 * solo cambia cuál está visible. Cada pestaña puede tener su propia pila
 * adentro (mirá la carpeta productos/).
 */
import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router/js-tabs';

import { useAuth } from '@/context/auth';
import { useColores } from '@/hooks/use-colores';

export default function LayoutTabs() {
  const colores = useColores();
  const { usuario } = useAuth();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colores.primario,
        tabBarInactiveTintColor: colores.textoSecundario,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="productos"
        options={{
          title: 'Productos',
          // productos/ tiene su propio Stack con header, así que ocultamos el de la tab
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Ionicons name="storefront" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarBadge: usuario ? undefined : '!',
          tabBarIcon: ({ color, size }) => <Ionicons name="person-circle" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
