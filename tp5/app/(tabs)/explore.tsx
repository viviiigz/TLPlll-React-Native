import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Text, ScrollView, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

export default function FormScreen() {
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    email: '',
    nacimiento: ''
  });

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
      <Animated.View entering={FadeInUp.duration(800)} style={styles.card}>
        <Text style={styles.title}>Tus Datos</Text>
        <Text style={styles.subtitle}>Completa el siguiente formulario</Text>

        <TextInput style={styles.input} placeholder="Nombre" placeholderTextColor="#FFB6C1" value={form.nombre} onChangeText={(text) => setForm({ ...form, nombre: text })} />
        
        <TextInput style={styles.input} placeholder="Apellido" placeholderTextColor="#FFB6C1" value={form.apellido} onChangeText={(text) => setForm({ ...form, apellido: text })} />
        
        <TextInput style={styles.input} placeholder="Nº de Teléfono" placeholderTextColor="#FFB6C1" keyboardType="phone-pad" value={form.telefono} onChangeText={(text) => setForm({ ...form, telefono: text })} />
        
        <TextInput style={styles.input} placeholder="Gmail" placeholderTextColor="#FFB6C1" keyboardType="email-address" autoCapitalize="none" value={form.email} onChangeText={(text) => setForm({ ...form, email: text })} />
        
        <TextInput style={styles.input} placeholder="Fecha de Nacimiento (DD/MM/AAAA)" placeholderTextColor="#FFB6C1" value={form.nacimiento} onChangeText={(text) => setForm({ ...form, nacimiento: text })} />

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Guardar Registro</Text>
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF0F5',
    paddingVertical: 40, // Espacio arriba y abajo para que el scroll respire
  },
  card: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    padding: 25,
    borderRadius: 30,
    shadowColor: '#FF69B4',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF69B4',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 15,
    color: '#FF8C00',
    textAlign: 'center',
    marginBottom: 25,
  },
  input: {
    backgroundColor: '#FFF5F7',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#FFE4E1',
  },
  button: {
    backgroundColor: '#FF69B4',
    borderRadius: 20,
    padding: 18,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});