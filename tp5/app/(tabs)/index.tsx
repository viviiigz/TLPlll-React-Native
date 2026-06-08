import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      {/* Animación suave de entrada */}
      <Animated.View entering={FadeInDown.duration(800)} style={styles.card}>
        <Text style={styles.title}>¡Bienvenido!</Text>
        <Text style={styles.subtitle}>Inicia sesión para continuar</Text>

        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          placeholderTextColor="#FFB6C1"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="#FFB6C1"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Ingresar</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF0F5', // Fondo general rosa pastel muy clarito
  },
  card: {
    width: '85%',
    backgroundColor: '#FFFFFF',
    padding: 30,
    borderRadius: 30, // Bordes súper suaves
    // Sombra rosa suave
    shadowColor: '#FF69B4',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF69B4',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#FF8C00', // Un tono más cálido para el subtítulo
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#FFF5F7', // Un rosa casi blanco para el fondo del input
    borderRadius: 20, // Bordes suaves
    padding: 18,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#FFE4E1', // Borde rosa claro
  },
  button: {
    backgroundColor: '#FF69B4',
    borderRadius: 20,
    padding: 18,
    alignItems: 'center',
    marginTop: 15,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});