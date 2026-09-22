import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import DondeEstoy from '../../components/DondeEstoy';

export default function TurnoScreen() {
  // Leemos el número de turno que nos mandó la pantalla de confirmación
  const { numero } = useLocalSearchParams<{ numero: string }>();

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>¡Pedido Confirmado! 🎉</Text>
      <Text style={styles.subtitulo}>Tu número para retirar en barra es:</Text>
      
      <View style={styles.tarjetaTurno}>
        <Text style={styles.numero}>{numero}</Text>
      </View>

      <Text style={styles.mensaje}>
        Tu pedido ya fue enviado a la cocina. Te avisaremos cuando esté listo.
      </Text>

      {/* Requisito G2.5: Usamos replace para limpiar el historial y volver al inicio */}
      <Pressable 
        style={styles.botonVolver} 
        onPress={() => router.replace('/')}
      >
        <Text style={styles.textoBoton}>Volver al Inicio</Text>
      </Pressable>

      <DondeEstoy />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center' },
  titulo: { fontSize: 28, fontWeight: 'bold', color: '#10b981', marginBottom: 10, textAlign: 'center' },
  subtitulo: { fontSize: 18, color: '#4b5563', marginBottom: 20, textAlign: 'center' },
  tarjetaTurno: { 
    backgroundColor: '#fff', 
    paddingVertical: 30, 
    paddingHorizontal: 60, 
    borderRadius: 20, 
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    marginBottom: 30 
  },
  numero: { fontSize: 64, fontWeight: '900', color: '#1f2937' },
  mensaje: { fontSize: 16, color: '#6b7280', textAlign: 'center', marginBottom: 40, paddingHorizontal: 20 },
  botonVolver: { backgroundColor: '#3b82f6', paddingVertical: 15, paddingHorizontal: 30, borderRadius: 8 },
  textoBoton: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});