import { useMemo } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import {
  ESPACIADO,
  TAMANIOS,
  type PaletaColores,
} from '../constants/tema';
import { useTema } from '../hooks/useTema';
import type { Libro } from '../types';

type PropsTarjetaReciente = {
  libro: Libro;
  onPresionar: () => void;
};

function crearEstilos(colores: PaletaColores) {
  return StyleSheet.create({
    tarjeta: {
      backgroundColor: colores.superficieSecundaria,
      borderRadius: TAMANIOS.radioMd,
      borderWidth: 1,
      borderColor: colores.borde,
      paddingHorizontal: ESPACIADO.md,
      paddingVertical: ESPACIADO.sm,
      minHeight: TAMANIOS.areaTactilMinima,
      justifyContent: 'center',
      gap: ESPACIADO.xs,
    },
    titulo: {
      fontSize: TAMANIOS.textoSm,
      fontWeight: '600',
      color: colores.texto,
    },
    autor: {
      fontSize: TAMANIOS.textoXs,
      color: colores.textoSecundario,
    },
  });
}

export function TarjetaReciente({ libro, onPresionar }: PropsTarjetaReciente) {
  const colores = useTema();
  const styles = useMemo(() => crearEstilos(colores), [colores]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Abrir visto recientemente: ${libro.titulo}`}
      style={styles.tarjeta}
      onPress={onPresionar}
    >
      <Text style={styles.titulo} numberOfLines={1}>
        {libro.titulo}
      </Text>
      <Text style={styles.autor} numberOfLines={1}>
        {libro.autor}
      </Text>
    </Pressable>
  );
}
