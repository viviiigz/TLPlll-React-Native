import { Tabs } from 'expo-router';
import React from 'react';
import { Colors } from '@/constants/theme'; // Asumiendo que usarás tu theme, pero pondré un rosa por defecto
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol'; // O el componente de iconos que estés usando

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FF69B4', // Rosa fuerte (HotPink) para el icono activo
        tabBarInactiveTintColor: '#FFB6C1', // Rosa claro para los inactivos
        tabBarStyle: {
          backgroundColor: '#FFF0F5', // Fondo rosa muy suave (LavenderBlush)
          borderTopWidth: 0,
          elevation: 0, // Quita la sombra dura en Android
          height: 60,
        },
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Login',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Formulario',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="doc.text.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}