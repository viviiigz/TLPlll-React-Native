import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useAppContext } from '../context/AppContext';
import DondeEstoy from '../components/DondeEstoy';

export default function ConfirmarScreen() {
  // recibimos la nota si el usuario pasó por la pantalla anterior
  const { nota } = useLocalSearchParams<{ nota: string }>();
  const { pilaCarrito, confirmarPedido } = useAppContext();
  
  const total = pilaCarrito.aArray().reduce((sum, item) => sum + item.precio, 0);

  const handleConfirmar = () => {
    //confirmarPedido encola los datos y devuelve un número de turno
    const numeroTurno = confirmarPedido(nota || 'Sin aclaraciones');
    
    // Uamos REPLACE para sobreescribir esta pantalla
    // asi el usuario no puede volver atrás y duplicar el pedido
    router.replace(`/turno/${numeroTurno}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Resumen de tu pedido</Text>
      
      <View style={styles.tarjeta}>
        <Text style={styles.texto}>🍽️ Platos en carrito: {pilaCarrito.tamanio}</Text>
        <Text style={styles.texto}>📝 Nota: {nota || 'Ninguna'}</Text>
        <View style={styles.separador} />
        <Text style={styles.total}>Total a pagar: ${total}</Text>
      </View>

      <Pressable style={styles.boton} onPress={handleConfirmar}>
        <Text style={styles.textoBoton}>✅ Confirmar y Enviar a Cocina</Text>
      </Pressable>
      
      <DondeEstoy />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f3f4f6', justifyContent: 'center' },
  titulo: { fontSize: 24, fontWeight: 'bold', color: '#1f2937', marginBottom: 20, textAlign: 'center' },
  tarjeta: { backgroundColor: '#fff', padding: 20, borderRadius: 12, marginBottom: 30, elevation: 2 },
  texto: { fontSize: 16, color: '#4b5563', marginBottom: 10 },
  separador: { height: 1, backgroundColor: '#e5e7eb', marginVertical: 15 },
  total: { fontSize: 22, fontWeight: 'bold', color: '#10b981', textAlign: 'right' },
  boton: { backgroundColor: '#10b981', padding: 18, borderRadius: 8, alignItems: 'center' },
  textoBoton: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});