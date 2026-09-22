import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { useAppContext } from '../../../context/AppContext';
import DondeEstoy from '../../../components/DondeEstoy';

export default function CarritoScreen() {
  const { pilaCarrito, deshacerUltimoCarrito, actualizarUI } = useAppContext(); 
  
  const items = pilaCarrito.aArray();
  const total = items.reduce((suma, item) => suma + item.precio, 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.tituloTotal}>Total: ${total}</Text>
        
        <Pressable 
          style={[styles.botonDeshacer, pilaCarrito.vacia && styles.botonDeshabilitado]} 
          onPress={deshacerUltimoCarrito}
          disabled={pilaCarrito.vacia}
        >
          <Text style={styles.textoBoton}>↩ Deshacer último</Text>
        </Pressable>
      </View>

      {/*//!usamos ScrollView en lugar de FlatList para evitar los problemas de caché */}
      <ScrollView style={styles.lista}>
        {items.length === 0 ? (
          <Text style={styles.textoVacio}>Tu carrito está triste y vacío</Text>
        ) : (
          items.map((item, index) => (
            <View key={`${item.id}-${index}-${actualizarUI}`} style={styles.tarjetaItem}>
              <Text style={styles.nombreItem}>{item.nombre}</Text>
              <Text style={styles.precioItem}>${item.precio}</Text>
            </View>
          ))
        )}
      </ScrollView>

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
  lista: { flex: 1 },
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