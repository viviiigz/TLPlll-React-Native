import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  ESPACIADO,
  TAMANIOS,
  type PaletaColores,
} from '../constants/tema';
import { useTema } from '../hooks/useTema';
import type { Libro } from '../types';

type PropsFilaLibro = {
  libro: Libro;
  ejemplaresDisponibles?: number;
  onPresionar?: () => void;
};

function crearEstilos(colores: PaletaColores) {
  return StyleSheet.create({
    tarjeta: {
      backgroundColor: colores.superficie,
      borderRadius: TAMANIOS.radioMd,
      borderWidth: 1,
      borderColor: colores.borde,
      padding: ESPACIADO.lg,
      marginBottom: ESPACIADO.md,
      minHeight: TAMANIOS.areaTactilMinima,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: ESPACIADO.md,
    },
    contenido: {
      flex: 1,
      gap: ESPACIADO.xs,
    },
    titulo: {
      fontSize: TAMANIOS.textoMd,
      fontWeight: '700',
      color: colores.texto,
    },
    autor: {
      fontSize: TAMANIOS.textoSm,
      color: colores.textoSecundario,
    },
    pie: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: ESPACIADO.sm,
      marginTop: ESPACIADO.xs,
    },
    etiquetaDisponible: {
      backgroundColor: colores.exitoFondo,
      paddingHorizontal: ESPACIADO.sm,
      paddingVertical: ESPACIADO.xs,
      borderRadius: TAMANIOS.radioSm,
    },
    textoDisponible: {
      fontSize: TAMANIOS.textoXs,
      fontWeight: '600',
      color: colores.exito,
    },
    etiquetaAgotado: {
      backgroundColor: colores.alertaFondo,
      paddingHorizontal: ESPACIADO.sm,
      paddingVertical: ESPACIADO.xs,
      borderRadius: TAMANIOS.radioSm,
    },
    textoAgotado: {
      fontSize: TAMANIOS.textoXs,
      fontWeight: '600',
      color: colores.alerta,
    },
    anio: {
      fontSize: TAMANIOS.textoXs,
      color: colores.textoSecundario,
    },
  });
}

export function FilaLibro({
  libro,
  ejemplaresDisponibles,
  onPresionar,
}: PropsFilaLibro) {
  const colores = useTema();
  const styles = useMemo(() => crearEstilos(colores), [colores]);
  const disponibles = ejemplaresDisponibles ?? libro.ejemplares;
  const hayEjemplares = disponibles > 0;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Ver detalle de ${libro.titulo} de ${libro.autor}`}
      style={styles.tarjeta}
      onPress={onPresionar}
    >
      <View style={styles.contenido}>
        <Text style={styles.titulo} numberOfLines={2}>
          {libro.titulo}
        </Text>
        <Text style={styles.autor} numberOfLines={1}>
          {libro.autor}
        </Text>
        <View style={styles.pie}>
          <View
            style={
              hayEjemplares ? styles.etiquetaDisponible : styles.etiquetaAgotado
            }
          >
            <Text
              style={
                hayEjemplares ? styles.textoDisponible : styles.textoAgotado
              }
            >
              {hayEjemplares
                ? `${disponibles} disponible${disponibles === 1 ? '' : 's'}`
                : 'Sin ejemplares (lista de espera)'}
            </Text>
          </View>
          <Text style={styles.anio}>{libro.anio}</Text>
        </View>
      </View>
      <Ionicons
        name="chevron-forward"
        size={20}
        color={colores.textoSecundario}
      />
    </Pressable>
  );
}
