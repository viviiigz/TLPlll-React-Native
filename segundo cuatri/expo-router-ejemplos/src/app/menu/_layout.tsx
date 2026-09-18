/**
 * DRAWER (menú lateral)  →  src/app/menu/_layout.tsx
 *
 * Igual que Stack y Tabs, el Drawer es un navegador que se usa en un
 * _layout. Cada archivo de la carpeta menu/ es una opción del menú.
 * Se abre con el ícono ☰ o deslizando desde el borde izquierdo.
 */
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { Pressable } from 'react-native';

import { useColores } from '@/hooks/use-colores';

export default function LayoutMenu() {
  const colores = useColores();

  return (
    <Drawer
      screenOptions={{
        drawerActiveTintColor: colores.primario,
        // Botón para salir del Drawer: desapila hasta volver al inicio
        headerRight: () => (
          <Pressable onPress={() => router.dismissTo('/')} hitSlop={12} style={{ marginRight: 16 }}>
            <Ionicons name="close" size={24} color={colores.texto} />
          </Pressable>
        ),
      }}>
      <Drawer.Screen
        name="index"
        options={{
          title: 'Bandeja de entrada',
          drawerIcon: ({ color, size }) => <Ionicons name="mail" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="favoritos"
        options={{
          title: 'Favoritos',
          drawerIcon: ({ color, size }) => <Ionicons name="star" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="papelera"
        options={{
          title: 'Papelera',
          drawerIcon: ({ color, size }) => <Ionicons name="trash" size={size} color={color} />,
        }}
      />
    </Drawer>
  );
}
