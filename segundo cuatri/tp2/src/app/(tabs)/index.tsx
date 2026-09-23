import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import DondeEstoy from '../../components/DondeEstoy'; 

export default function PantallaInicio() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>¡Bienvenido al Comedor IPF!</Text>
      <Text style={styles.subtitulo}>¿Qué querés hacer hoy?</Text>

      <View style={styles.grilla}>
        <Link href="/menu" asChild>
          <Pressable style={styles.tarjeta}>
            <MaterialIcons name="restaurant" size={24} color="#fff" />
            <Text style={styles.textoTarjeta}>Menú</Text>
          </Pressable>
        </Link>
        
        <Link href="/buscar" asChild>
          <Pressable style={styles.tarjeta}>
            <MaterialIcons name="search" size={24} color="#fff" />
            <Text style={styles.textoTarjeta}>Buscar</Text>
          </Pressable>
        </Link>
        
        <Link href="/ayuda" asChild>
          <Pressable style={styles.tarjeta}>
            <MaterialIcons name="help-outline" size={24} color="#fff" />
            <Text style={styles.textoTarjeta}>Ayuda</Text>
          </Pressable>
        </Link>
        
<Link href="/login" asChild>
  <Pressable style={StyleSheet.flatten([styles.tarjeta, styles.tarjetaCocina])}>
    <MaterialIcons name="soup-kitchen" size={24} color="#fff" />
    <Text style={styles.textoTarjeta}>Cocina</Text>
  </Pressable>
</Link>
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
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    minWidth: 140,
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8, 
  },
  textoTarjeta: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tarjetaCocina: {
    backgroundColor: '#ef4444', // Rojo para diferenciar el área de empleados
  },
});