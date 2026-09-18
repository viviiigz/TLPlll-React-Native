/**
 * RUTA "/perfil"  →  src/app/(tabs)/perfil.tsx
 *
 * Punto de entrada del ejemplo de rutas protegidas.
 * La lógica de protección NO está acá: está en src/app/_layout.tsx
 * con <Stack.Protected guard={...}>.
 */
import Ionicons from '@expo/vector-icons/Ionicons';
import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Boton } from '@/components/boton';
import { InfoRuta } from '@/components/info-ruta';
import { Nota } from '@/components/nota';
import { Pantalla } from '@/components/pantalla';
import { Codigo } from '@/components/texto';
import { useAuth } from '@/context/auth';
import { useColores } from '@/hooks/use-colores';

export default function Perfil() {
  const colores = useColores();
  const { usuario, cerrarSesion } = useAuth();

  return (
    <Pantalla>
      <View style={[styles.estado, { backgroundColor: colores.superficie, borderColor: colores.borde }]}>
        <Ionicons
          name={usuario ? 'lock-open' : 'lock-closed'}
          size={40}
          color={usuario ? colores.exito : colores.peligro}
        />
        <Text style={[styles.estadoTitulo, { color: colores.texto }]}>
          {usuario ? `Hola, ${usuario}` : 'Sin sesión'}
        </Text>
        <Text style={{ color: colores.textoSecundario }}>
          guard = {usuario ? 'true' : 'false'}
        </Text>
      </View>

      <Nota titulo="¿Cómo funciona Stack.Protected?">
        Mientras <Codigo>guard</Codigo> sea <Codigo>false</Codigo>, las pantallas de adentro no
        se registran en el navegador: no hay Link ni router.push que llegue a /privado. Cuando
        el guard cambia, las pantallas aparecen o desaparecen solas del historial. Probá iniciar
        sesión: el modal de login se cierra solo porque su guard pasa a false.
      </Nota>

      {usuario ? (
        <>
          <Link href="/privado" asChild>
            <Boton titulo="Entrar a la zona privada" icono="shield-checkmark" />
          </Link>
          <Boton titulo="Cerrar sesión" variante="peligro" icono="log-out" onPress={cerrarSesion} />
        </>
      ) : (
        <Link href="/login" asChild>
          <Boton titulo="Iniciar sesión" icono="log-in" />
        </Link>
      )}

      <InfoRuta />
    </Pantalla>
  );
}

const styles = StyleSheet.create({
  estado: {
    alignItems: 'center',
    gap: 6,
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
  },
  estadoTitulo: {
    fontSize: 22,
    fontWeight: '800',
  },
});
