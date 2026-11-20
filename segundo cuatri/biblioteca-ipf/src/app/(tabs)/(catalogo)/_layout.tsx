import { useMemo } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  ESPACIADO,
  TAMANIOS,
  type PaletaColores,
} from '../../../constants/tema';
import { useBiblioteca } from '../../../context/BibliotecaContext';
import { useTema } from '../../../hooks/useTema';

function crearEstilos(colores: PaletaColores) {
  return StyleSheet.create({
    botonHeader: {
      minHeight: TAMANIOS.areaTactilMinima,
      minWidth: TAMANIOS.areaTactilMinima,
      paddingHorizontal: ESPACIADO.sm,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: ESPACIADO.xs,
    },
    textoHeader: {
      fontSize: TAMANIOS.textoSm,
      fontWeight: '700',
      color: colores.primario,
    },
  });
}

export default function CatalogoStackLayout() {
  const colores = useTema();
  const styles = useMemo(() => crearEstilos(colores), [colores]);
  const { sesionPersonal } = useBiblioteca();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colores.superficie },
        headerTintColor: colores.texto,
        contentStyle: { backgroundColor: colores.fondo },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Biblioteca IPF',
          headerRight: () => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={
                sesionPersonal
                  ? 'Abrir mostrador del personal'
                  : 'Ingresar como personal'
              }
              style={styles.botonHeader}
              onPress={() =>
                router.push(sesionPersonal ? '/mostrador' : '/login')
              }
            >
              <Ionicons
                name={sesionPersonal ? 'desktop-outline' : 'person-outline'}
                size={18}
                color={colores.primario}
              />
              <Text style={styles.textoHeader}>
                {sesionPersonal ? 'Mostrador' : 'Personal'}
              </Text>
            </Pressable>
          ),
        }}
      />
      <Stack.Screen
        name="libro/[isbn]"
        options={{
          title: 'Detalle del libro',
        }}
      />
    </Stack>
  );
}
