import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from 'expo-router';
import type { ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Boton } from '@/components/boton';
import { InfoRuta } from '@/components/info-ruta';
import { Nota } from '@/components/nota';
import { Pantalla } from '@/components/pantalla';
import { useColores } from '@/hooks/use-colores';

type Props = {
  titulo: string;
  icono: ComponentProps<typeof Ionicons>['name'];
  color: string;
};

/** Contenido compartido por las tres pantallas del ejemplo de Drawer. */
export function PantallaMenu({ titulo, icono, color }: Props) {
  const colores = useColores();
  const navigation = useNavigation();

  // `openDrawer` solo existe cuando la pantalla está dentro de un Drawer.
  const abrirMenu = () => {
    if ('openDrawer' in navigation && typeof navigation.openDrawer === 'function') {
      navigation.openDrawer();
    }
  };

  return (
    <Pantalla>
      <View style={[styles.ilustracion, { backgroundColor: color + '22' }]}>
        <Ionicons name={icono} size={56} color={color} />
        <Text style={[styles.titulo, { color: colores.texto }]}>{titulo}</Text>
      </View>

      <Boton titulo="Abrir el menú" icono="menu" onPress={abrirMenu} />

      <Nota titulo="Drawer: otro tipo de navegador">
        Como las tabs, el Drawer no apila: elegir otra opción cambia la pantalla visible. Es
        útil cuando hay muchas secciones que no entran en una barra de pestañas.
      </Nota>

      <InfoRuta />
    </Pantalla>
  );
}

const styles = StyleSheet.create({
  ilustracion: {
    alignItems: 'center',
    gap: 10,
    padding: 32,
    borderRadius: 20,
  },
  titulo: {
    fontSize: 22,
    fontWeight: '800',
  },
});
