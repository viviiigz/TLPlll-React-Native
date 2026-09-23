import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { platos } from '../../data/platos'; 
import DondeEstoy from '../../components/DondeEstoy';

export default function CategoriaScreen() {
  // extraemos el pae asegurando que ts sepa que es un string
  const { categoria } = useLocalSearchParams<{ categoria: string }>();


  //  lista de las categorías únicas que existen en l bd
  const categoriasValidas = Array.from(new Set(platos.map(p => p.categoria.toLowerCase())));
  const parametroLimpio = categoria?.toLowerCase() || '';
  
  const existeCategoria = categoriasValidas.includes(parametroLimpio);

  // renderizdo condicional d errro
  if (!existeCategoria) {
    return (
      <View style={styles.center}>
        <Text style={styles.tituloError}>¡Categoría no encontrada! 🕵️</Text>
        <Text style={styles.mensajeError}>
          No tenemos ninguna categoría llamada "{categoria}".
        </Text>
        <Pressable style={styles.botonVolver} onPress={() => router.replace('/')}>
          <Text style={styles.textoBoton}>Volver al Menú</Text>
        </Pressable>
      </View>
    );
  }

  // renderizado normal si la cat existe
  const platosDeCategoria = platos.filter(p => p.categoria.toLowerCase() === parametroLimpio);

  return (
    <View style={styles.container}>
      <Text style={styles.tituloPrincipal}>Categoría: {categoria}</Text>
      
      <FlatList
        data={platosDeCategoria}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.tarjetaPlato}>
            <Text style={styles.nombrePlato}>{item.nombre}</Text>
            <Text style={styles.precioPlato}>${item.precio}</Text>
          </View>
        )}
      />

      <Pressable style={styles.botonVolver} onPress={() => router.back()}>
        <Text style={styles.textoBoton}>Volver Atrás</Text>
      </Pressable>

      <DondeEstoy />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f3f4f6' },
  center: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f3f4f6' },
  tituloPrincipal: { fontSize: 26, fontWeight: 'bold', marginBottom: 20, textTransform: 'capitalize' },
  tarjetaPlato: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 10, elevation: 2 },
  nombrePlato: { fontSize: 18, fontWeight: 'bold' },
  precioPlato: { fontSize: 16, color: '#10b981', marginTop: 5 },
  tituloError: { fontSize: 24, fontWeight: 'bold', color: '#ef4444', marginBottom: 10 },
  mensajeError: { fontSize: 16, color: '#4b5563', textAlign: 'center', marginBottom: 30 },
  botonVolver: { backgroundColor: '#3b82f6', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  textoBoton: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});