import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Link, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  ESPACIADO,
  TAMANIOS,
  type PaletaColores,
} from '../constants/tema';
import { useTema } from '../hooks/useTema';

function crearEstilos(colores: PaletaColores) {
  return StyleSheet.create({
    contenedor: {
      flex: 1,
      backgroundColor: colores.fondo,
      alignItems: 'center',
      justifyContent: 'center',
      padding: ESPACIADO.xl,
      gap: ESPACIADO.md,
    },
    codigo: {
      fontSize: TAMANIOS.textoTitulo,
      fontWeight: '700',
      color: colores.texto,
    },
    mensaje: {
      fontSize: TAMANIOS.textoMd,
      color: colores.textoSecundario,
      textAlign: 'center',
      lineHeight: 22,
    },
    ruta: {
      fontSize: TAMANIOS.textoSm,
      fontWeight: '600',
      color: colores.error,
      backgroundColor: colores.errorFondo,
      paddingHorizontal: ESPACIADO.md,
      paddingVertical: ESPACIADO.xs,
      borderRadius: TAMANIOS.radioSm,
    },
    boton: {
      marginTop: ESPACIADO.sm,
      minHeight: TAMANIOS.areaTactilMinima,
      paddingHorizontal: ESPACIADO.xl,
      paddingVertical: ESPACIADO.md,
      borderRadius: TAMANIOS.radioMd,
      backgroundColor: colores.primario,
      alignItems: 'center',
      justifyContent: 'center',
    },
    textoBoton: {
      fontSize: TAMANIOS.textoMd,
      fontWeight: '700',
      color: colores.primarioTexto,
    },
  });
}

export default function NoEncontradaPantalla() {
  const colores = useTema();
  const styles = useMemo(() => crearEstilos(colores), [colores]);
  const pathname = usePathname();

  return (
    <View style={styles.contenedor}>
      <Ionicons name="compass-outline" size={56} color={colores.error} />
      <Text style={styles.codigo}>Página no encontrada (404)</Text>
      <Text style={styles.mensaje}>
        La dirección solicitada no existe en Biblioteca IPF:
      </Text>
      <Text style={styles.ruta}>{pathname}</Text>
      <Link href="/" asChild>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Volver al inicio"
          style={styles.boton}
        >
          <Text style={styles.textoBoton}>Volver al Catálogo</Text>
        </Pressable>
      </Link>
    </View>
  );
}
