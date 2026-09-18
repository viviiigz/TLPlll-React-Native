/**
 * HOJA INFERIOR  →  src/app/hoja.tsx
 *
 * `presentation: 'formSheet'` + `sheetAllowedDetents: [0.5, 0.9]`
 * muestra la pantalla como una hoja que ocupa el 50% de alto y
 * se puede arrastrar hasta el 90%.
 */
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Boton } from '@/components/boton';
import { Codigo, Parrafo } from '@/components/texto';
import { useColores } from '@/hooks/use-colores';

export default function Hoja() {
  const colores = useColores();

  return (
    <View style={[styles.contenedor, { backgroundColor: colores.superficie }]}>
      <Text style={[styles.titulo, { color: colores.texto }]}>Hoja inferior</Text>
      <Parrafo>
        Arrastrá desde la barrita de arriba para agrandarla. Es la misma idea que un modal, pero
        con <Codigo>presentation: 'formSheet'</Codigo> y alturas permitidas (detents).
      </Parrafo>
      <Parrafo>
        Muy usada para menús de acciones, filtros o un reproductor de música.
      </Parrafo>
      <Boton titulo="Cerrar" icono="chevron-down" onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    padding: 24,
    paddingTop: 32,
    gap: 14,
  },
  titulo: {
    fontSize: 22,
    fontWeight: '800',
  },
});
