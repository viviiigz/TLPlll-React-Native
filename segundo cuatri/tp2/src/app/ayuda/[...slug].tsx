import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import DondeEstoy from '../../components/DondeEstoy';

export default function AyudaArticuloScreen() {
  const { slug } = useLocalSearchParams<{ slug: string[] }>();
  
  // transformamos el array de la URL en un texto legible
  const rutaMapeada = slug ? slug.join(' > ') : 'Tema general';

  return (
    <View style={styles.container}>
      <View style={styles.encabezado}>
        <MaterialIcons name="menu-book" size={32} color="#1f2937" />
        <Text style={styles.titulo}>Artículo de Ayuda</Text>
      </View>
      
      <View style={styles.tarjeta}>
        <Text style={styles.etiquetaRuta}>Estás leyendo sobre:</Text>
        <Text style={styles.rutaString}>{rutaMapeada}</Text>
        
        <Text style={styles.contenido}>
          Acá iría el contenido detallado. Al utilizar una ruta catch-all, esta única pantalla es capaz de gestionar infinitos niveles de profundidad para los artículos de ayuda.
        </Text>
      </View>

      <Pressable style={styles.botonVolver} onPress={() => router.back()}>
        <MaterialIcons name="arrow-back" size={20} color="#fff" />
        <Text style={styles.textoBoton}>Volver a Temas</Text>
      </Pressable>

      <DondeEstoy />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f3f4f6' },
  encabezado: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
  titulo: { fontSize: 28, fontWeight: 'bold', color: '#1f2937' },
  tarjeta: { backgroundColor: '#fff', padding: 20, borderRadius: 10, elevation: 2, marginBottom: 20 },
  etiquetaRuta: { fontSize: 14, color: '#6b7280', marginBottom: 5 },
  rutaString: { fontSize: 18, fontWeight: 'bold', color: '#10b981', marginBottom: 15, textTransform: 'capitalize' },
  contenido: { fontSize: 16, color: '#4b5563', lineHeight: 24 },
  botonVolver: { backgroundColor: '#3b82f6', padding: 15, borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  textoBoton: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});