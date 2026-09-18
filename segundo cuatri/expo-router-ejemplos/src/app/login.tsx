/**
 * RUTA "/login"  →  src/app/login.tsx
 *
 * Está dentro de <Stack.Protected guard={!conSesion}>.
 * Fijate que al iniciar sesión NO llamamos a router.back():
 * el guard pasa a false, la pantalla deja de existir y Expo Router
 * la saca del historial automáticamente.
 */
import { useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';

import { Boton } from '@/components/boton';
import { Nota } from '@/components/nota';
import { Pantalla } from '@/components/pantalla';
import { Codigo, Parrafo, Titulo } from '@/components/texto';
import { useAuth } from '@/context/auth';
import { useColores } from '@/hooks/use-colores';

export default function Login() {
  const colores = useColores();
  const { iniciarSesion } = useAuth();
  const [nombre, setNombre] = useState('');

  return (
    <Pantalla>
      <Titulo>Bienvenido 👋</Titulo>
      <Parrafo>Escribí tu nombre. No hay contraseña: es una sesión de prueba.</Parrafo>

      <TextInput
        value={nombre}
        onChangeText={setNombre}
        placeholder="Tu nombre"
        placeholderTextColor={colores.textoSecundario}
        autoFocus
        returnKeyType="done"
        onSubmitEditing={() => iniciarSesion(nombre)}
        style={[
          styles.input,
          { color: colores.texto, backgroundColor: colores.superficie, borderColor: colores.borde },
        ]}
      />

      <Boton titulo="Ingresar" icono="log-in" onPress={() => iniciarSesion(nombre)} />

      <Nota tipo="tip" titulo="Mirá lo que pasa al ingresar">
        El modal se cierra solo. No hay ningún <Codigo>router.back()</Codigo>: cambió el estado,
        cambió el <Codigo>guard</Codigo> y Expo Router actualizó las rutas disponibles.
      </Nota>
    </Pantalla>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
});
