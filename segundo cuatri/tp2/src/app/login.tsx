import { View, Text, StyleSheet, TextInput, Pressable, Alert } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { useAppContext } from '../context/AppContext'; 
import DondeEstoy from '../components/DondeEstoy';
import Cargando from '../components/Cargando';

export default function LoginScreen() {
  const [clave, setClave] = useState('');
  const [estaCargando, setEstaCargando] = useState(false);
  
  const { login } = useAppContext(); 

  const ingresar = () => {
    if (clave === '1234') {
      setEstaCargando(true);
      
      setTimeout(() => {
        login(); // actualizar el estado global antes de  navegar
        setEstaCargando(false);
        router.replace('/cocina');
      }, 1500);
      
    } else {
      Alert.alert('Acceso denegado', 'La contraseña es incorrecta. Pista: 1234');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Acceso a Cocina </Text>
      <Text style={styles.subtitulo}>Ingresá tu clave de empleado</Text>

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={clave}
        onChangeText={setClave}
        keyboardType="numeric"
        editable={!estaCargando}
      />

      {estaCargando ? (
        <Cargando mensaje="Verificando credenciales..." />
      ) : (
        <Pressable style={styles.boton} onPress={ingresar}>
          <Text style={styles.textoBoton}>Entrar</Text>
        </Pressable>
      )}

      <Pressable 
        style={[styles.botonVolver, estaCargando && styles.botonDeshabilitado]} 
        onPress={() => router.back()} 
        disabled={estaCargando}
      >
        <Text style={styles.textoVolver}>Volver al Inicio</Text>
      </Pressable>

      <DondeEstoy />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f3f4f6', justifyContent: 'center' },
  titulo: { fontSize: 28, fontWeight: 'bold', color: '#1f2937', marginBottom: 5, textAlign: 'center' },
  subtitulo: { fontSize: 16, color: '#6b7280', marginBottom: 30, textAlign: 'center' },
  input: { 
    backgroundColor: '#fff', padding: 15, borderRadius: 8, 
    fontSize: 18, textAlign: 'center', marginBottom: 20,
    borderWidth: 1, borderColor: '#d1d5db'
  },
  boton: { backgroundColor: '#ef4444', padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 15 },
  textoBoton: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  botonVolver: { padding: 15, alignItems: 'center' },
  textoVolver: { color: '#6b7280', fontSize: 16, fontWeight: 'bold' },
  botonDeshabilitado: { opacity: 0.5 },
});