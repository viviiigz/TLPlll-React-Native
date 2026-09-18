import Ionicons from '@expo/vector-icons/Ionicons';
import { useGlobalSearchParams, useLocalSearchParams, usePathname, useSegments } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { FuenteMono } from '@/constants/theme';
import { useColores } from '@/hooks/use-colores';

/**
 * Muestra "dónde estamos" usando los hooks de Expo Router.
 * Se agrega al final de cada ejemplo para que se vea cómo
 * cambian la URL, los segmentos y los parámetros al navegar.
 */
export function InfoRuta() {
  const colores = useColores();
  const pathname = usePathname();
  const segmentos = useSegments();
  const paramsLocales = useLocalSearchParams();
  const paramsGlobales = useGlobalSearchParams();

  const filas = [
    { hook: 'usePathname()', valor: pathname },
    { hook: 'useSegments()', valor: JSON.stringify(segmentos) },
    { hook: 'useLocalSearchParams()', valor: JSON.stringify(paramsLocales) },
    { hook: 'useGlobalSearchParams()', valor: JSON.stringify(paramsGlobales) },
  ];

  return (
    <View style={[styles.caja, { backgroundColor: colores.superficie, borderColor: colores.borde }]}>
      <View style={styles.encabezado}>
        <Ionicons name="locate" size={16} color={colores.primario} />
        <Text style={[styles.titulo, { color: colores.primario }]}>¿Dónde estoy?</Text>
      </View>
      {filas.map((fila) => (
        <View key={fila.hook} style={styles.fila}>
          <Text style={[styles.hook, { color: colores.textoSecundario }]}>{fila.hook}</Text>
          <Text style={[styles.valor, { color: colores.texto }]} selectable>
            {fila.valor}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  caja: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 14,
    gap: 10,
    marginTop: 8,
  },
  encabezado: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  titulo: {
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  fila: {
    gap: 2,
  },
  hook: {
    fontFamily: FuenteMono,
    fontSize: 12,
  },
  valor: {
    fontFamily: FuenteMono,
    fontSize: 13,
    fontWeight: '600',
  },
});
