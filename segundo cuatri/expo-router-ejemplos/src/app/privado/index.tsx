/**
 * RUTA PROTEGIDA "/privado"  →  src/app/privado/index.tsx
 */
import Ionicons from '@expo/vector-icons/Ionicons';
import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Boton } from '@/components/boton';
import { InfoRuta } from '@/components/info-ruta';
import { Nota } from '@/components/nota';
import { Pantalla } from '@/components/pantalla';
import { useAuth } from '@/context/auth';
import { useColores } from '@/hooks/use-colores';

export default function ZonaPrivada() {
  const colores = useColores();
  const { usuario, cerrarSesion } = useAuth();

  return (
    <Pantalla>
      <View style={[styles.banner, { backgroundColor: colores.exitoSuave }]}>
        <Ionicons name="shield-checkmark" size={48} color={colores.exito} />
        <Text style={[styles.titulo, { color: colores.exito }]}>Acceso concedido</Text>
        <Text style={{ color: colores.texto }}>Esta pantalla solo existe porque {usuario} inició sesión.</Text>
      </View>

      <Link href="/privado/ajustes" asChild>
        <Boton titulo="Ir a ajustes (otra pantalla protegida)" variante="secundario" icono="settings" />
      </Link>

      <Boton titulo="Cerrar sesión" variante="peligro" icono="log-out" onPress={cerrarSesion} />

      <Nota tipo="tip" titulo="Probá cerrar sesión desde acá">
        Estas pantallas desaparecen del historial y volvés solo a las tabs. Tampoco se puede
        volver con la flecha atrás: ya no existen.
      </Nota>

      <InfoRuta />
    </Pantalla>
  );
}

const styles = StyleSheet.create({
  banner: {
    alignItems: 'center',
    gap: 8,
    padding: 24,
    borderRadius: 20,
  },
  titulo: {
    fontSize: 22,
    fontWeight: '800',
  },
});
