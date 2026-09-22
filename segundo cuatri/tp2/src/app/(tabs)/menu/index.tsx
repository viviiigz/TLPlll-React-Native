import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { platos } from '../../../data/platos';
import DondeEstoy from '../../../components/DondeEstoy';

export default function MenuScreen() {
  return (
    <View style={styles.container}>
      <FlatList
        data={platos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          // requisito G2.5: usar Link para interacciones directas del usuario
          <Link href={`/menu/${item.id}`} asChild>
            <Pressable style={styles.tarjeta}>
              <View>
                <Text style={styles.nombre}>{item.nombre}</Text>
                <Text style={styles.categoria}>{item.categoria.toUpperCase()}</Text>
              </View>
              <Text style={styles.precio}>${item.precio}</Text>
            </Pressable>
          </Link>
        )}
      />
      <DondeEstoy />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  tarjeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000', 
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  nombre: { fontSize: 16, fontWeight: 'bold', color: '#1f2937' },
  categoria: { fontSize: 12, color: '#6b7280', marginTop: 4 },
  precio: { fontSize: 18, fontWeight: 'bold', color: '#10b981' },
});