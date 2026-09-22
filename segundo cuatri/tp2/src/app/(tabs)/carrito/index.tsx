import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { useAppContext } from '../../../context/AppContext';
import DondeEstoy from '../../../components/DondeEstoy';

export default function CarritoScreen() {
// le agregamos lo de actualizarUi pq no se estaba renderizando
  const { pilaCarrito, deshacerUltimoCarrito, actualizarUI } = useAppContext();  
  // usamos el método que creaste en tu clase Pila para obtener los items sin mutarla
  const items = pilaCarrito.aArray();
  const total = items.reduce((suma, item) => suma + item.precio, 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.tituloTotal}>Total: ${total}</Text>
        
        {/*botón Deshacer que hace pop() y se deshabilita si está vacío */}
        <Pressable 
          style={[styles.botonDeshacer, pilaCarrito.vacia && styles.botonDeshabilitado]} 
          onPress={deshacerUltimoCarrito}
          disabled={pilaCarrito.vacia}
        >
          <Text style={styles.textoBoton}>↩ Deshacer último</Text>
        </Pressable>
      </View>

      <FlatList
        data={items}
        // usamos el index como key porque en una pila puede haber platos repetidos
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.tarjetaItem}>
            <Text style={styles.nombreItem}>{item.nombre}</Text>
            <Text style={styles.precioItem}>${item.precio}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.textoVacio}>Tu carrito está triste y vacío :c</Text>
        }
      />

      {!pilaCarrito.vacia && (
        <View style={styles.footer}>
          <Link href="/carrito/nota" style={styles.linkNota}>📝 Agregar nota para la cocina</Link>
          
          <Link href="/confirmar" asChild>
            <Pressable style={styles.botonConfirmar}>
              <Text style={styles.textoBoton}>Confirmar Pedido</Text>
            </Pressable>
          </Link>
        </View>
      )}
      
      <DondeEstoy />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6', padding: 15 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  tituloTotal: { fontSize: 24, fontWeight: 'bold', color: '#1f2937' },
  botonDeshacer: { backgroundColor: '#ef4444', padding: 10, borderRadius: 8 },
  botonDeshabilitado: { backgroundColor: '#fca5a5' },
  textoBoton: { color: '#fff', fontWeight: 'bold', textAlign: 'center' },
  tarjetaItem: { 
    flexDirection: 'row', justifyContent: 'space-between', 
    backgroundColor: '#fff', padding: 15, marginBottom: 10, borderRadius: 8 
  },
  nombreItem: { fontSize: 16, color: '#374151' },
  precioItem: { fontSize: 16, fontWeight: 'bold', color: '#10b981' },
  textoVacio: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#6b7280' },
  footer: { marginTop: 15 },
  linkNota: { textAlign: 'center', color: '#3b82f6', marginBottom: 15, fontWeight: 'bold' },
  botonConfirmar: { backgroundColor: '#10b981', padding: 15, borderRadius: 8, alignItems: 'center' },
});