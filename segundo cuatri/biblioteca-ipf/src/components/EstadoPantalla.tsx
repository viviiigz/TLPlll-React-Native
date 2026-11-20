import { useMemo } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  ESPACIADO,
  TAMANIOS,
  type PaletaColores,
} from '../constants/tema';
import { useTema } from '../hooks/useTema';

type PropsEstadoPantalla = {
  tipo: 'cargando' | 'error' | 'vacio';
  mensaje: string;
  textoAccion?: string;
  onAccion?: () => void;
};

function crearEstilos(colores: PaletaColores) {
  return StyleSheet.create({
    contenedor: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: ESPACIADO.xl,
      backgroundColor: colores.fondo,
      gap: ESPACIADO.md,
    },
    mensaje: {
      fontSize: TAMANIOS.textoMd,
      color: colores.textoSecundario,
      textAlign: 'center',
      lineHeight: 22,
    },
    boton: {
      marginTop: ESPACIADO.sm,
      minHeight: TAMANIOS.areaTactilMinima,
      minWidth: 140,
      paddingHorizontal: ESPACIADO.xl,
      paddingVertical: ESPACIADO.md,
      borderRadius: TAMANIOS.radioMd,
      backgroundColor: colores.primario,
      alignItems: 'center',
      justifyContent: 'center',
    },
    textoBoton: {
      fontSize: TAMANIOS.textoMd,
      fontWeight: '600',
      color: colores.primarioTexto,
    },
  });
}

export function EstadoPantalla({
  tipo,
  mensaje,
  textoAccion,
  onAccion,
}: PropsEstadoPantalla) {
  const colores = useTema();
  const styles = useMemo(() => crearEstilos(colores), [colores]);

  return (
    <View style={styles.contenedor}>
      {tipo === 'cargando' ? (
        <ActivityIndicator size="large" color={colores.primario} />
      ) : (
        <Ionicons
          name={tipo === 'error' ? 'cloud-offline-outline' : 'book-outline'}
          size={44}
          color={tipo === 'error' ? colores.error : colores.textoSecundario}
        />
      )}

      <Text style={styles.mensaje}>{mensaje}</Text>

      {textoAccion && onAccion ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={textoAccion}
          style={styles.boton}
          onPress={onAccion}
        >
          <Text style={styles.textoBoton}>{textoAccion}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
