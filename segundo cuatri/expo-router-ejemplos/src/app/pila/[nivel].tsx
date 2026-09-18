/**
 * DEMO DE PILA  →  src/app/pila/[nivel].tsx   (ruta: /pila/1, /pila/2, ...)
 *
 * El Stack guarda las pantallas como una PILA (LIFO: Last In, First Out).
 *  - push     → apila una pantalla nueva arriba de todo.
 *  - navigate → si el destino es la pantalla actual, solo cambia sus parámetros.
 *  - back     → saca la de arriba (pop).
 *  - replace  → cambia la de arriba por otra (la pila no crece).
 *  - dismiss(n) → saca n pantallas de una vez.
 *  - dismissAll → desapila todo hasta la primera pantalla del Stack.
 *
 * Además dibujamos el estado REAL del navegador (navigation.getState()).
 */
import { router, Stack, useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInUp, FadeOutRight, LinearTransition } from 'react-native-reanimated';

import { Boton } from '@/components/boton';
import { InfoRuta } from '@/components/info-ruta';
import { Nota } from '@/components/nota';
import { Pantalla } from '@/components/pantalla';
import { Codigo, Subtitulo } from '@/components/texto';
import { ColoresFichas, FuenteMono } from '@/constants/theme';
import { useColores } from '@/hooks/use-colores';

export default function DemoPila() {
  const colores = useColores();
  const { nivel } = useLocalSearchParams<{ nivel: string }>();
  const n = Number(nivel) || 1;
  const rutas = useRutasDelStack();

  // Invertimos la lista para dibujar el TOPE de la pila arriba de todo.
  const pilaVisual = [...rutas].reverse();

  return (
    <Pantalla>
      <Stack.Screen options={{ title: `Pila · nivel ${n}` }} />

      <View style={[styles.cabecera, { backgroundColor: colores.primarioSuave }]}>
        <Text style={[styles.nivel, { color: colores.primario }]}>{n}</Text>
        <Text style={[styles.cabeceraTexto, { color: colores.texto }]}>
          Estás en <Text style={styles.mono}>/pila/{n}</Text>.{'\n'}Hay {rutas.length} pantallas
          en la pila.
        </Text>
      </View>

      <View style={styles.fila}>
        <View style={styles.mitad}>
          <Boton
            titulo={`push → ${n + 1}`}
            icono="arrow-up-circle"
            onPress={() => router.push({ pathname: '/pila/[nivel]', params: { nivel: n + 1 } })}
          />
        </View>
        <View style={styles.mitad}>
          <Boton
            titulo={`navigate → ${n + 1}`}
            variante="secundario"
            icono="navigate-circle"
            onPress={() => router.navigate({ pathname: '/pila/[nivel]', params: { nivel: n + 1 } })}
          />
        </View>
      </View>
      <View style={styles.fila}>
        <View style={styles.mitad}>
          <Boton
            titulo="back (pop)"
            variante="secundario"
            icono="arrow-down-circle"
            disabled={!router.canGoBack()}
            onPress={() => router.back()}
          />
        </View>
        <View style={styles.mitad}>
          <Boton
            titulo={`replace → ${n + 1}`}
            variante="secundario"
            icono="swap-vertical"
            onPress={() => router.replace({ pathname: '/pila/[nivel]', params: { nivel: n + 1 } })}
          />
        </View>
      </View>
      <View style={styles.fila}>
        <View style={styles.mitad}>
          <Boton
            titulo="dismiss(2)"
            variante="secundario"
            icono="play-skip-back"
            disabled={rutas.length < 3}
            onPress={() => router.dismiss(2)}
          />
        </View>
        <View style={styles.mitad}>
          <Boton
            titulo="dismissAll"
            variante="peligro"
            icono="trash"
            onPress={() => router.dismissAll()}
          />
        </View>
      </View>

      <Subtitulo>Estado real del Stack raíz</Subtitulo>
      <View style={[styles.pila, { borderColor: colores.borde, backgroundColor: colores.superficie }]}>
        {pilaVisual.map((ruta, indice) => {
          const esTope = indice === 0;
          const params = ruta.params as { nivel?: string } | undefined;
          const color = params?.nivel
            ? ColoresFichas[(Number(params.nivel) - 1) % ColoresFichas.length]
            : colores.textoSecundario;

          return (
            <Animated.View
              key={ruta.key}
              entering={FadeInUp.springify().damping(14)}
              exiting={FadeOutRight}
              layout={LinearTransition.springify()}
              style={[
                styles.ficha,
                { backgroundColor: color, opacity: esTope ? 1 : 0.75 },
                esTope && styles.fichaTope,
              ]}>
              <Text style={styles.fichaTexto}>
                {params?.nivel ? `/pila/${params.nivel}` : ruta.name}
              </Text>
              {esTope && <Text style={styles.fichaEtiqueta}>TOPE · visible</Text>}
            </Animated.View>
          );
        })}
        <Text style={[styles.base, { color: colores.textoSecundario }]}>── base de la pila ──</Text>
      </View>

      <Nota titulo="LIFO: el último en entrar es el primero en salir">
        La pantalla visible siempre es el tope. Al tocar atrás (o hacer el gesto de volver) se
        ejecuta un <Codigo>pop</Codigo> y aparece la que estaba debajo, que nunca se desmontó.
      </Nota>

      <Nota tipo="tip" titulo="push vs navigate">
        <Codigo>router.push</Codigo> siempre apila una pantalla nueva. Si el destino es la misma
        pantalla que ya está visible, <Codigo>router.navigate</Codigo> no apila: reutiliza el
        tope y solo le cambia los parámetros. Probá los dos y mirá cuántas fichas quedan.
      </Nota>

      <InfoRuta />
    </Pantalla>
  );
}

/**
 * Lee las rutas del navegador que contiene a esta pantalla (el Stack raíz)
 * y se vuelve a renderizar cada vez que ese estado cambia.
 */
function useRutasDelStack() {
  const navigation = useNavigation();
  const [estado, setEstado] = useState(() => navigation.getState());

  useEffect(() => {
    return navigation.addListener('state', (evento) => {
      setEstado(evento.data.state);
    });
  }, [navigation]);

  return estado?.routes ?? [];
}

const styles = StyleSheet.create({
  cabecera: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 16,
    borderRadius: 20,
  },
  nivel: {
    fontSize: 56,
    fontWeight: '900',
    minWidth: 56,
    textAlign: 'center',
  },
  cabeceraTexto: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  mono: {
    fontFamily: FuenteMono,
    fontWeight: '700',
  },
  fila: {
    flexDirection: 'row',
    gap: 10,
  },
  mitad: {
    flex: 1,
  },
  pila: {
    borderWidth: 2,
    borderTopWidth: 0,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    padding: 10,
    gap: 6,
  },
  ficha: {
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fichaTope: {
    paddingVertical: 16,
  },
  fichaTexto: {
    color: '#FFFFFF',
    fontFamily: FuenteMono,
    fontWeight: '700',
  },
  fichaEtiqueta: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  base: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 4,
  },
});
