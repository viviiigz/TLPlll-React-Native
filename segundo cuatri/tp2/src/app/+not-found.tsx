import { View, Text, StyleSheet } from 'react-native';
import { Link, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops! 404' }} />
      <View style={styles.container}>
        <Text style={styles.titulo}>¡Ups! Te perdiste 
            <Ionicons color="#ef4444" name="alert-circle-outline" size={32}/>
        </Text>
        <Text style={styles.texto}>Esta ruta no existe en el sistema.</Text>
        <Link href="/" style={styles.link}>
          Volver al menú principal
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  texto: { fontSize: 16, color: '#666' },
  link: { marginTop: 20, padding: 15, color: '#3b82f6', fontWeight: 'bold' },
});