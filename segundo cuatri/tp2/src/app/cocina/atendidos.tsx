import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAppContext } from '../../context/AppContext';
import DondeEstoy from '../../components/DondeEstoy';

export default function AtendidosScreen() {
  const { pilaAtendidos, actualizarUI } = useAppContext();

  // .reverse() garantiza que el último pedido atendido (el más reciente) aparezca arriba de todo
  const despachados = pilaAtendidos.aArray().filter(item => item !== undefined).reverse();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Pedidos Atendidos 📋</Text>
        <Text style={styles.subtitulo}>Total despachados hoy: {pilaAtendidos.tamanio}</Text>
      </View>

      <ScrollView style={{ flex: 1 }}>
        {despachados.length === 0 ? (
          <Text style={styles.textoVacio}>Aún no despachaste ningún pedido hoy.</Text>
        ) : (
          despachados.map((item, index) => {
            if (!item) return null;
            
            return (
              <View key={`atendido-${index}-${actualizarUI}`} style={styles.tarjeta}>
                <Text style={styles.turno}>Turno #{item.numeroTurno}</Text>
                <Text style={styles.platos}>
                  {item.platos.length} {item.platos.length === 1 ? 'plato' : 'platos'}
                </Text>
                <Text style={styles.nota}>📝 {item.nota || 'Sin nota'}</Text>
              </View>
            );
          })
        )}
      </ScrollView>

      <DondeEstoy />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f3f4f6' },
  header: { marginBottom: 20, alignItems: 'center' },
  titulo: { fontSize: 28, fontWeight: 'bold', color: '#1f2937' },
  subtitulo: { fontSize: 18, color: '#6b7280', marginTop: 5 },
  tarjeta: { 
    backgroundColor: '#fff', 
    padding: 15, 
    marginBottom: 10, 
    borderRadius: 8, 
    borderLeftWidth: 5, 
    borderLeftColor: '#10b981', 
    elevation: 2 
  },
  turno: { fontSize: 20, fontWeight: 'bold', color: '#1f2937' },
  platos: { fontSize: 16, color: '#4b5563', marginTop: 5 },
  nota: { fontSize: 14, color: '#6b7280', fontStyle: 'italic', marginTop: 5 },
  textoVacio: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#6b7280' },
});