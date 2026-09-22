import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { platos } from '../../../data/platos';
import { useAppContext } from '../../../context/AppContext';
import DondeEstoy from '../../../components/DondeEstoy';

export default function DetallePlato() {
  // leemos el parámetro 'id' de la url (siempre llega como string)
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { agregarAlCarrito } = useAppContext();

  // validación del parámetro
  const plato = platos.find((p) => p.id.toString() === id);

  // si alguien escribe un id que no existe 
  if (!plato) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ title: 'Plato no encontrado' }} />
        <Text style={styles.errorText}>No pudimos encontrar este plato 😢</Text>
        <Pressable style={styles.botonVolver} onPress={() => router.back()}>
          <Text style={styles.textoBoton}>Volver al menú</Text>
        </Pressable>
        <DondeEstoy />
      </View>
    );
  }

  // acción al presionar el botón de agregar
  const handleAgregar = () => {
    agregarAlCarrito(plato); // esto hace el push en la Pila 
    Alert.alert('¡Agregado!', `${plato.nombre} se sumó al carrito.`);
    router.back(); // usamos router.back() para volver a la lista programáticamente
  };

  return (
    <View style={styles.container}>
      {/* título del header = nombre del plato */}
      <Stack.Screen options={{ title: plato.nombre }} />

      <View style={styles.tarjeta}>
        <Text style={styles.categoria}>{plato.categoria.toUpperCase()}</Text>
        <Text style={styles.nombre}>{plato.nombre}</Text>
        <Text style={styles.descripcion}>{plato.descripcion}</Text>
        <Text style={styles.precio}>${plato.precio}</Text>

        <Pressable style={styles.botonAgregar} onPress={handleAgregar}>
          <Text style={styles.textoBoton}>Agregar al carrito 🛒</Text>
        </Pressable>
      </View>

      <DondeEstoy />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f3f4f6' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  tarjeta: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  categoria: { color: '#6b7280', fontSize: 14, fontWeight: 'bold', marginBottom: 5 },
  nombre: { fontSize: 24, fontWeight: 'bold', color: '#1f2937', marginBottom: 10 },
  descripcion: { fontSize: 16, color: '#4b5563', marginBottom: 20, lineHeight: 22 },
  precio: { fontSize: 28, fontWeight: 'bold', color: '#10b981', marginBottom: 30 },
  botonAgregar: {
    backgroundColor: '#3b82f6',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  botonVolver: {
    backgroundColor: '#6b7280',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  textoBoton: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  errorText: { fontSize: 18, color: '#ef4444', fontWeight: 'bold' },
});