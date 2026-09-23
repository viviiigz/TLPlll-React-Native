import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Link, router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons'; 
import DondeEstoy from '../../components/DondeEstoy';

export default function AyudaIndexScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.encabezado}>
        <Text style={styles.titulo}>Centro de Ayuda</Text>
        <MaterialIcons name="support-agent" size={28} color="#1f2937" />
      </View>
      <Text style={styles.subtitulo}>Seleccioná un tema para más información:</Text>

      <View style={styles.listaLinks}>
        <Link href="/ayuda/pagos" asChild>
          <Pressable style={styles.botonTema}>
            <MaterialIcons name="credit-card" size={24} color="#3b82f6" />
            <Text style={styles.textoTema}>Métodos de Pago</Text>
          </Pressable>
        </Link>
        
        <Link href="/ayuda/pagos/efectivo" asChild>
          <Pressable style={styles.botonTema}>
            <MaterialIcons name="payments" size={24} color="#3b82f6" />
            <Text style={styles.textoTema}>Pagar con Efectivo en Caja</Text>
          </Pressable>
        </Link>

        <Link href="/ayuda/pedidos/demoras/reclamos" asChild>
          <Pressable style={styles.botonTema}>
            <MaterialIcons name="timer" size={24} color="#3b82f6" />
            <Text style={styles.textoTema}>¿Qué hago si mi pedido demora?</Text>
          </Pressable>
        </Link>
      </View>

      <Pressable style={styles.botonVolver} onPress={() => router.replace('/')}>
        <Text style={styles.textoBoton}>Volver al Inicio</Text>
      </Pressable>

      <DondeEstoy />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f3f4f6' },
  encabezado: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  titulo: { fontSize: 28, fontWeight: 'bold', color: '#1f2937' },
  subtitulo: { fontSize: 16, color: '#4b5563', marginBottom: 20 },
  listaLinks: { gap: 10, marginBottom: 30 },
  botonTema: { backgroundColor: '#fff', padding: 15, borderRadius: 8, elevation: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  textoTema: { fontSize: 16, color: '#3b82f6', fontWeight: '500' },
  botonVolver: { backgroundColor: '#6b7280', padding: 15, borderRadius: 8, alignItems: 'center' },
  textoBoton: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});