import { View, Text, StyleSheet, TextInput, FlatList, Pressable } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'
import { platos } from '../data/platos';
import DondeEstoy from '../components/DondeEstoy';

export default function BuscarScreen() {
  // leemos los parámetros dinámicos directamente de la URL
  const { q = '', categoria = '' } = useLocalSearchParams<{ q: string; categoria: string }>();

  // funciones que actualizan la URL instantáneamente
  const cambiarTexto = (nuevoTexto: string) => {
    router.setParams({ q: nuevoTexto, categoria });
  };

  const cambiarCategoria = (nuevaCategoria: string) => {
    router.setParams({ q, categoria: nuevaCategoria });
  };

  // el filtrado reacciona en tiempo real a los cambios de la URL
  const platosFiltrados = platos.filter(plato => {
    const coincideTexto = q === '' || plato.nombre.toLowerCase().includes(q.toLowerCase());
    const coincideCategoria = categoria === '' || plato.categoria.toLowerCase() === categoria.toLowerCase();
    return coincideTexto && coincideCategoria;
  });

  const categoriasUnicas = Array.from(new Set(platos.map(p => p.categoria)));

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Buscador 
        <Ionicons color="#1f2937" name="search" size={25}/>
      </Text>
      
      <TextInput
        style={styles.input}
        placeholder="¿Qué tenés ganas de comer?"
        value={q} 
        onChangeText={cambiarTexto} 
      />

      <View style={styles.contenedorFiltros}>
        <Pressable 
          style={[styles.botonFiltro, categoria === '' && styles.filtroActivo]} 
          onPress={() => cambiarCategoria('')}
        >
          <Text style={categoria === '' ? styles.textoFiltroActivo : styles.textoFiltro}>Todas</Text>
        </Pressable>
        
        {categoriasUnicas.map(cat => (
          <Pressable 
            key={cat} 
            style={[styles.botonFiltro, categoria === cat && styles.filtroActivo]} 
            onPress={() => cambiarCategoria(cat)}
          >
            <Text style={[
              { textTransform: 'capitalize' }, 
              categoria === cat ? styles.textoFiltroActivo : styles.textoFiltro
            ]}>
              {cat}
            </Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={platosFiltrados}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={<Text style={styles.textoVacio}>No encontramos platos con esos filtros.</Text>}
        renderItem={({ item }) => (
          <View style={styles.tarjeta}>
            <Text style={styles.nombrePlato}>{item.nombre}</Text>
            <Text style={styles.precioPlato}>${item.precio}</Text>
          </View>
        )}
      />

      <DondeEstoy />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f3f4f6' },
  titulo: { fontSize: 28, fontWeight: 'bold', color: '#1f2937', marginBottom: 15 },
  input: { backgroundColor: '#fff', padding: 15, borderRadius: 10, borderWidth: 1, borderColor: '#d1d5db', fontSize: 16, marginBottom: 15 },
  contenedorFiltros: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 15 },
  botonFiltro: { paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20, backgroundColor: '#e5e7eb' },
  filtroActivo: { backgroundColor: '#3b82f6' },
  textoFiltro: { color: '#4b5563', fontWeight: 'bold' },
  textoFiltroActivo: { color: '#fff', fontWeight: 'bold' },
  tarjeta: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 10, elevation: 2 },
  nombrePlato: { fontSize: 18, fontWeight: 'bold', color: '#1f2937' },
  precioPlato: { fontSize: 16, color: '#10b981', marginTop: 5, fontWeight: 'bold' },
  textoVacio: { textAlign: 'center', color: '#6b7280', fontSize: 16, marginTop: 40 },
});