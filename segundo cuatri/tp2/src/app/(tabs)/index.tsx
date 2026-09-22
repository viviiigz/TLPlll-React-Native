import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import DondeEstoy from '../../components/DondeEstoy'; 

export default function PantallaInicio() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>¡Bienvenido al Comedor IPF!</Text>
      <Text style={styles.subtitulo}>¿Qué querés hacer hoy?</Text>

      <View style={styles.grilla}>
        {/* usamos Link para la navegación directa como pide el requisito G2.5 */}
        <Link href="/menu" style={styles.tarjeta}>🍽️ Menú</Link>
        <Link href="/buscar" style={styles.tarjeta}>🔍 Buscar</Link>
        <Link href="/ayuda" style={styles.tarjeta}>❓ Ayuda</Link>
        <Link href="/login" style={[styles.tarjeta, styles.tarjetaCocina]}>👨‍🍳 Cocina</Link>
      </View>

      {/* componente obligatorio para depuración */}
      <DondeEstoy />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 5 },
  subtitulo: { fontSize: 16, color: '#666', marginBottom: 30 },
  grilla: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 15,
    marginBottom: 40,
  },
  tarjeta: {
    paddingVertical: 20,
    paddingHorizontal: 30,
    backgroundColor: '#3b82f6',
    color: '#fff',
    borderRadius: 12,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    minWidth: 140,
    overflow: 'hidden',
  },
  tarjetaCocina: {
    backgroundColor: '#ef4444', // Rojo para diferenciar el área de empleados
  },
});