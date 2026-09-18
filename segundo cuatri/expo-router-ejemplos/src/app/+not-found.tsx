/**
 * PÁGINA 404  →  src/app/+not-found.tsx
 *
 * Los archivos que empiezan con "+" son especiales. Este se muestra
 * cuando ninguna ruta coincide con la URL pedida.
 */
import { Link, usePathname } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Boton } from '@/components/boton';
import { Nota } from '@/components/nota';
import { Pantalla } from '@/components/pantalla';
import { Codigo, Parrafo } from '@/components/texto';
import { FuenteMono } from '@/constants/theme';
import { useColores } from '@/hooks/use-colores';

export default function NoEncontrada() {
  const colores = useColores();
  const pathname = usePathname();

  return (
    <Pantalla>
      <View style={styles.centro}>
        <Text style={[styles.codigo404, { color: colores.primario }]}>404</Text>
        <Parrafo style={styles.texto}>No existe ninguna pantalla para</Parrafo>
        <Text style={[styles.ruta, { color: colores.texto, backgroundColor: colores.codigo }]}>{pathname}</Text>
      </View>

      <Link href="/" asChild>
        <Boton titulo="Volver al inicio" icono="home" />
      </Link>

      <Nota titulo="Archivos especiales">
        <Codigo>_layout.tsx</Codigo> define un navegador,{' '}
        <Codigo>+not-found.tsx</Codigo> atrapa las rutas inexistentes y las carpetas entre
        paréntesis como <Codigo>(tabs)</Codigo> agrupan sin cambiar la URL.
      </Nota>
    </Pantalla>
  );
}

const styles = StyleSheet.create({
  centro: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 24,
  },
  codigo404: {
    fontSize: 88,
    fontWeight: '900',
    letterSpacing: -4,
  },
  texto: {
    textAlign: 'center',
  },
  ruta: {
    fontFamily: FuenteMono,
    fontSize: 15,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
});
