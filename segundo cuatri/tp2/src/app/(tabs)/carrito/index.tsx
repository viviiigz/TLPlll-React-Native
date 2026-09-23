import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Link, useFocusEffect } from 'expo-router'; // Importamos useFocusEffect
import { useCallback, useState } from 'react'; // Importamos useCallback
import { useAppContext } from '../../../context/AppContext';
import DondeEstoy from '../../../components/DondeEstoy';
import Cargando from '../../../components/Cargando';

export default function CarritoScreen() {
  const { pilaCarrito, deshacerUltimoCarrito, actualizarUI } = useAppContext(); 
  const [estaCargando, setEstaCargando] = useState(true);

  // useFocusEffect se ejecuta CADA VEZ que el usuario entra a la pestaña
  useFocusEffect(
    useCallback(() => {
      setEstaCargando(true); // reinicia el estado de carga al entrar
      const timer = setTimeout(() => setEstaCargando(false), 700);
      
      return () => clearTimeout(timer); 
    }, [])
  );
  
  const items = pilaCarrito.aArray();
  const total = items.reduce((suma, item) => suma + item.precio, 0);

  if (estaCargando) {
    return (
      <View style={styles.center}>
        <Cargando mensaje="Calculando totales..." />
      </View>
    );
  }

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

      <ScrollView style={styles.lista}>
        {items.length === 0 ? (
          <Text style={styles.textoVacio}>Tu carrito está triste y vacío :c</Text>
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
  center: { flex: 1, justifyContent: 'center', backgroundColor: '#f3f4f6' },
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