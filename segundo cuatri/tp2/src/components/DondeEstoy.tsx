import { View, Text, StyleSheet } from 'react-native';
import { usePathname, useSegments, useLocalSearchParams } from 'expo-router';

const DEBUG = true; // cambiar a false para ocultar en producción

export default function DondeEstoy() {
  const pathname = usePathname();
  const segments = useSegments();
  const params = useLocalSearchParams();

  if (!DEBUG) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>¿Dónde estoy?</Text>
      <Text style={styles.texto}>Pathname: {pathname}</Text>
      <Text style={styles.texto}>Segments: {JSON.stringify(segments)}</Text>
      <Text style={styles.texto}>Params: {JSON.stringify(params)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#333',
    margin: 10,
    borderRadius: 8,
  },
  titulo: { color: '#4ade80', fontWeight: 'bold', marginBottom: 5 },
  texto: { color: '#fff', fontSize: 12, marginBottom: 2 },
});