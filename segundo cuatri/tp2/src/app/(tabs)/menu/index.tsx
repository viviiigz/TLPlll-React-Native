import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { platos } from '../../../data/platos';
import DondeEstoy from '../../../components/DondeEstoy';
import Cargando from '../../../components/Cargando';
import { useState, useEffect } from 'react';

export default function MenuScreen() {
  const [estaCargando, setEstaCargando] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setEstaCargando(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {estaCargando ? (
        <View style={styles.center}>
          <Cargando mensaje="Preparando el menú del día..." />
        </View>
      ) : (
        <FlatList
          data={platos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
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
      )}
      <DondeEstoy />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  center: { flex: 1, justifyContent: 'center' }, 
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