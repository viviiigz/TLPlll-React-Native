import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

// funcion auxiliar para mostrar el icono correspondiente a cada tab
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={24} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    // configuro las tres pestañas solicitadas en la consigna
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: useClientOnlyValue(false, true),
      }}>
      {/* 1. tab reportes: inicio con la lista de reportes propios */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Reportes',
          tabBarLabel: 'Reportes',
          tabBarIcon: ({ color }) => <TabBarIcon name="list-alt" color={color as string} />,
          headerRight: () => (
            // agrego un boton en la cabecera para ir rapido a los ajustes de la app
            <Link href={'/ajustes-app' as any} asChild>
              <Pressable style={{ marginRight: 16 }}>
                {({ pressed }) => (
                  <FontAwesome
                    name="cog"
                    size={22}
                    color={Colors[colorScheme ?? 'light'].text}
                    style={{ opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />

      {/* 2. tab avisos: bandeja de notificaciones internas */}
      <Tabs.Screen
        name="avisos"
        options={{
          title: 'Bandeja de Avisos',
          tabBarLabel: 'Avisos',
          tabBarIcon: ({ color }) => <TabBarIcon name="bell-o" color={color as string} />,
        }}
      />

      {/* 3. tab permisos: panel de control de permisos del dispositivo */}
      <Tabs.Screen
        name="permisos"
        options={{
          title: 'Estado de Permisos',
          tabBarLabel: 'Permisos',
          tabBarIcon: ({ color }) => <TabBarIcon name="shield" color={color as string} />,
        }}
      />

    </Tabs>
  );
}
