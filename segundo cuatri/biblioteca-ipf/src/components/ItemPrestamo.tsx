import { useMemo } from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import {
  ESPACIADO,
  TAMANIOS,
  type PaletaColores,
} from '../constants/tema';
import { useTema } from '../hooks/useTema';
import { formatearFechaCorta } from '../lib/validaciones';
import type { Prestamo } from '../types';

type PropsItemPrestamo = {
  prestamo: Prestamo;
  alCambiarRecordatorio: (activo: boolean) => void;
  alDevolver: () => void;
};

function crearEstilos(colores: PaletaColores) {
  return StyleSheet.create({
    tarjeta: {
      backgroundColor: colores.superficie,
      borderRadius: TAMANIOS.radioMd,
      borderWidth: 1,
      borderColor: colores.borde,
      padding: ESPACIADO.lg,
      gap: ESPACIADO.md,
    },
    titulo: {
      fontSize: TAMANIOS.textoMd,
      fontWeight: '700',
      color: colores.texto,
    },
    fecha: {
      fontSize: TAMANIOS.textoSm,
      color: colores.textoSecundario,
    },
    filaInterruptor: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: TAMANIOS.areaTactilMinima,
      borderTopWidth: 1,
      borderTopColor: colores.borde,
      paddingTop: ESPACIADO.sm,
    },
    textoInterruptor: {
      fontSize: TAMANIOS.textoSm,
      fontWeight: '600',
      color: colores.texto,
      flex: 1,
    },
    botonDevolver: {
      minHeight: TAMANIOS.areaTactilMinima,
      borderRadius: TAMANIOS.radioMd,
      backgroundColor: colores.errorFondo,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: ESPACIADO.md,
    },
    textoDevolver: {
      fontSize: TAMANIOS.textoSm,
      fontWeight: '700',
      color: colores.error,
    },
  });
}

export function ItemPrestamo({
  prestamo,
  alCambiarRecordatorio,
  alDevolver,
}: PropsItemPrestamo) {
  const colores = useTema();
  const styles = useMemo(() => crearEstilos(colores), [colores]);

  return (
    <View style={styles.tarjeta}>
      <Text style={styles.titulo}>{prestamo.titulo}</Text>
      <Text style={styles.fecha}>
        Devolución límite: {formatearFechaCorta(prestamo.fechaDevolucionISO)}
      </Text>

      <View style={styles.filaInterruptor}>
        <Text style={styles.textoInterruptor}>
          Recordarme antes de devolver (15 s demo)
        </Text>
        <Switch
          value={prestamo.recordatorioActivo}
          onValueChange={alCambiarRecordatorio}
          accessibilityLabel={`Activar recordatorio para ${prestamo.titulo}`}
        />
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Devolver ${prestamo.titulo}`}
        style={styles.botonDevolver}
        onPress={alDevolver}
      >
        <Text style={styles.textoDevolver}>Devolver libro</Text>
      </Pressable>
    </View>
  );
}
