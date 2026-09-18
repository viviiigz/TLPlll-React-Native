import Ionicons from '@expo/vector-icons/Ionicons';
import { Link, type Href } from 'expo-router';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View, type PressableProps } from 'react-native';

import { FuenteMono } from '@/constants/theme';
import { useColores } from '@/hooks/use-colores';

type NombreIcono = ComponentProps<typeof Ionicons>['name'];

type Props = {
  href: Href;
  titulo: string;
  descripcion: string;
  /** Texto que se muestra como "ruta" (ej: /productos/[id]). */
  ruta: string;
  icono: NombreIcono;
  color: string;
};

/**
 * Tarjeta que navega usando <Link>.
 * `asChild` hace que Link no dibuje su propio <Text>, sino que le pase
 * sus props (onPress, href...) al componente hijo.
 */
export function TarjetaEjemplo({ href, ...contenido }: Props) {
  return (
    <Link href={href} asChild>
      <ContenidoTarjeta {...contenido} />
    </Link>
  );
}

function ContenidoTarjeta({
  titulo,
  descripcion,
  ruta,
  icono,
  color,
  ...pressableProps
}: Omit<Props, 'href'> & PressableProps) {
  const colores = useColores();

  return (
    <Pressable
      {...pressableProps}
      style={({ pressed }) => [
        styles.tarjeta,
        { backgroundColor: colores.superficie, borderColor: colores.borde },
        pressed && styles.presionada,
      ]}>
      <View style={[styles.icono, { backgroundColor: color + '22' }]}>
        <Ionicons name={icono} size={22} color={color} />
      </View>
      <View style={styles.textos}>
        <Text style={[styles.titulo, { color: colores.texto }]}>{titulo}</Text>
        <Text style={[styles.descripcion, { color: colores.textoSecundario }]}>{descripcion}</Text>
        <Text style={[styles.ruta, { color }]}>{ruta}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colores.textoSecundario} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  presionada: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  icono: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textos: {
    flex: 1,
    gap: 2,
  },
  titulo: {
    fontSize: 16,
    fontWeight: '700',
  },
  descripcion: {
    fontSize: 13,
    lineHeight: 18,
  },
  ruta: {
    fontFamily: FuenteMono,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
});
