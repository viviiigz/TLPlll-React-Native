/**
 * MODAL  →  src/app/modal.tsx
 *
 * Es una pantalla más del Stack raíz, pero con `presentation: 'modal'`
 * (configurado en src/app/_layout.tsx). Se apila igual que cualquier
 * otra pantalla: cerrarla es hacer pop.
 */
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Boton } from '@/components/boton';
import { InfoRuta } from '@/components/info-ruta';
import { Nota } from '@/components/nota';
import { Pantalla } from '@/components/pantalla';
import { Codigo } from '@/components/texto';
import { useColores } from '@/hooks/use-colores';

export default function Modal() {
  const colores = useColores();

  return (
    <Pantalla>
      <View style={[styles.ilustracion, { backgroundColor: colores.primarioSuave }]}>
        <Text style={styles.emoji}>🪟</Text>
        <Text style={[styles.titulo, { color: colores.primario }]}>Soy una pantalla modal</Text>
      </View>

      <Nota titulo="Una pantalla, otra forma de mostrarse">
        En iOS aparece desde abajo como una tarjeta; en Android y web se muestra encima del
        contenido. Se cierra con <Codigo>router.back()</Codigo> o deslizando hacia abajo (iOS).
      </Nota>

      <Nota tipo="tip" titulo="¿Cuándo usar un modal?">
        Para tareas cortas que interrumpen el flujo: un formulario, un filtro, confirmar una
        acción, ver un detalle rápido.
      </Nota>

      <Boton titulo="Cerrar modal" icono="close" onPress={() => router.back()} />

      <InfoRuta />
    </Pantalla>
  );
}

const styles = StyleSheet.create({
  ilustracion: {
    alignItems: 'center',
    gap: 8,
    padding: 28,
    borderRadius: 20,
  },
  emoji: {
    fontSize: 56,
  },
  titulo: {
    fontSize: 20,
    fontWeight: '800',
  },
});
