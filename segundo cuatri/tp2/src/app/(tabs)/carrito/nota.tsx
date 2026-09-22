import { View, Text, TextInput, StyleSheet, Pressable } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import DondeEstoy from '../../../components/DondeEstoy';

export default function NotaScreen() {
  const [texto, setTexto] = useState('');

  const guardarNota = () => {
    // vamos directo a la confirmación, pasando la nota como parámetro en la url
    router.push({ pathname: '/confirmar', params: { nota: texto } });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>¿Alguna aclaración para la cocina?</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: La milanesa sin sal, bebida bien fría..."
        value={texto}
        onChangeText={setTexto}
        multiline
      />
      <Pressable style={styles.boton} onPress={guardarNota}>
        <Text style={styles.textoBoton}>Continuar a Confirmación</Text>
      </Pressable>
      <DondeEstoy />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f3f4f6' },
  label: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#1f2937' },
  input: { 
    backgroundColor: '#fff', padding: 15, borderRadius: 8, 
    minHeight: 100, textAlignVertical: 'top', marginBottom: 20,
    borderWidth: 1, borderColor: '#d1d5db'
  },
  boton: { backgroundColor: '#3b82f6', padding: 15, borderRadius: 8, alignItems: 'center' },
  textoBoton: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});