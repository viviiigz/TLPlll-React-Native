/**
 * RUTA "/estructuras"  →  src/app/estructuras.tsx
 *
 * Demo de estructuras de datos, sin navegación de por medio:
 *  - PILA (stack): LIFO → se agrega y se saca por el mismo extremo (el tope).
 *  - COLA (queue): FIFO → se agrega al final y se saca por el frente.
 *
 * Las animaciones usan "layout animations" de react-native-reanimated:
 * `entering` / `exiting` animan la entrada y salida de cada ficha y
 * `layout` anima el reacomodo de las que quedan.
 */
import { useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  FadeInDown,
  FadeInRight,
  FadeOutLeft,
  FadeOutUp,
  LinearTransition,
} from 'react-native-reanimated';

import { Boton } from '@/components/boton';
import { Nota } from '@/components/nota';
import { Pantalla } from '@/components/pantalla';
import { Codigo, Parrafo, Subtitulo } from '@/components/texto';
import { ColoresFichas, FuenteMono } from '@/constants/theme';
import { useColores } from '@/hooks/use-colores';

type Ficha = { id: number; valor: number };

const MAXIMO = 6;

export default function Estructuras() {
  const colores = useColores();
  const siguiente = useRef(1);

  const [pila, setPila] = useState<Ficha[]>([]);
  const [cola, setCola] = useState<Ficha[]>([]);
  const [log, setLog] = useState<string[]>([]);

  const nuevaFicha = (): Ficha => {
    const valor = siguiente.current++;
    return { id: valor, valor };
  };

  const registrar = (linea: string) => setLog((anterior) => [linea, ...anterior].slice(0, 5));

  // ---- PILA ----
  const push = () => {
    const ficha = nuevaFicha();
    setPila((p) => [...p, ficha]);
    registrar(`pila.push(${ficha.valor})`);
  };
  const pop = () => {
    const tope = pila.at(-1);
    if (!tope) return;
    setPila((p) => p.slice(0, -1));
    registrar(`pila.pop() → ${tope.valor}`);
  };

  // ---- COLA ----
  const encolar = () => {
    const ficha = nuevaFicha();
    setCola((c) => [...c, ficha]);
    registrar(`cola.encolar(${ficha.valor})`);
  };
  const desencolar = () => {
    const frente = cola[0];
    if (!frente) return;
    setCola((c) => c.slice(1));
    registrar(`cola.desencolar() → ${frente.valor}`);
  };

  const colorDe = (ficha: Ficha) => ColoresFichas[(ficha.valor - 1) % ColoresFichas.length];

  return (
    <Pantalla>
      <Parrafo>
        Las dos guardan elementos en orden. La diferencia está en <Parrafo style={styles.negrita}>por
        dónde salen</Parrafo>.
      </Parrafo>

      {/* ------------------------- PILA ------------------------- */}
      <Subtitulo>Pila · LIFO (Last In, First Out)</Subtitulo>
      <View style={[styles.panel, { backgroundColor: colores.superficie, borderColor: colores.borde }]}>
        <View style={[styles.contenedorPila, { borderColor: colores.textoSecundario }]}>
          {pila.length === 0 && <Text style={[styles.vacio, { color: colores.textoSecundario }]}>vacía</Text>}
          {/* column-reverse: el último elemento del array se dibuja arriba (tope) */}
          {pila.map((ficha, indice) => (
            <Animated.View
              key={ficha.id}
              entering={FadeInDown.springify().damping(15)}
              exiting={FadeOutUp.duration(250)}
              layout={LinearTransition}
              style={[styles.fichaPila, { backgroundColor: colorDe(ficha) }]}>
              <Text style={styles.fichaTexto}>{ficha.valor}</Text>
              {indice === pila.length - 1 && <Text style={styles.etiqueta}>TOPE</Text>}
            </Animated.View>
          ))}
        </View>
        <View style={styles.fila}>
          <View style={styles.mitad}>
            <Boton titulo="push" icono="arrow-down" onPress={push} disabled={pila.length >= MAXIMO} />
          </View>
          <View style={styles.mitad}>
            <Boton titulo="pop" variante="secundario" icono="arrow-up" onPress={pop} disabled={pila.length === 0} />
          </View>
        </View>
      </View>

      {/* ------------------------- COLA ------------------------- */}
      <Subtitulo>Cola · FIFO (First In, First Out)</Subtitulo>
      <View style={[styles.panel, { backgroundColor: colores.superficie, borderColor: colores.borde }]}>
        <View style={styles.extremos}>
          <Text style={[styles.extremo, { color: colores.peligro }]}>← sale (frente)</Text>
          <Text style={[styles.extremo, { color: colores.exito }]}>entra (final) ←</Text>
        </View>
        <View style={[styles.contenedorCola, { borderColor: colores.textoSecundario }]}>
          {cola.length === 0 && <Text style={[styles.vacio, { color: colores.textoSecundario }]}>vacía</Text>}
          {cola.map((ficha) => (
            <Animated.View
              key={ficha.id}
              entering={FadeInRight.springify().damping(15)}
              exiting={FadeOutLeft.duration(250)}
              layout={LinearTransition}
              style={[styles.fichaCola, { backgroundColor: colorDe(ficha) }]}>
              <Text style={styles.fichaTexto}>{ficha.valor}</Text>
            </Animated.View>
          ))}
        </View>
        <View style={styles.fila}>
          <View style={styles.mitad}>
            <Boton titulo="encolar" icono="enter" onPress={encolar} disabled={cola.length >= MAXIMO} />
          </View>
          <View style={styles.mitad}>
            <Boton
              titulo="desencolar"
              variante="secundario"
              icono="exit"
              onPress={desencolar}
              disabled={cola.length === 0}
            />
          </View>
        </View>
      </View>

      {/* ------------------------- LOG ------------------------- */}
      <View style={[styles.log, { backgroundColor: '#0F172A' }]}>
        <Text style={styles.logTitulo}>consola</Text>
        {log.length === 0 && <Text style={styles.logLinea}>› tocá un botón…</Text>}
        {log.map((linea, i) => (
          <Text key={`${linea}-${i}`} style={[styles.logLinea, i === 0 && styles.logUltima]}>
            › {linea}
          </Text>
        ))}
      </View>

      <Nota titulo="¿Y esto qué tiene que ver con la navegación?">
        El historial de un <Codigo>Stack</Codigo> es una pila: la pantalla visible es el tope y
        “atrás” hace pop. Internamente, Expo Router también usa una cola: cada{' '}
        <Codigo>router.push</Codigo> o <Codigo>Link</Codigo> se agrega a una cola de acciones
        que se procesa en orden (FIFO).
      </Nota>

      <Nota tipo="tip" titulo="Ejemplos de la vida real">
        Pila: Ctrl+Z (deshacer), el historial del navegador, una pila de platos.{'\n'}
        Cola: la fila del comedor, la cola de impresión, los mensajes pendientes de enviar.
      </Nota>
    </Pantalla>
  );
}

const styles = StyleSheet.create({
  negrita: {
    fontWeight: '800',
  },
  panel: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    gap: 12,
  },
  contenedorPila: {
    flexDirection: 'column-reverse',
    alignSelf: 'center',
    width: 180,
    minHeight: 6 * 46 + 16,
    borderWidth: 3,
    borderTopWidth: 0,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    padding: 8,
    gap: 6,
  },
  fichaPila: {
    height: 40,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  contenedorCola: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 72,
    borderTopWidth: 3,
    borderBottomWidth: 3,
    paddingVertical: 8,
    gap: 6,
  },
  fichaCola: {
    width: 44,
    height: 52,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fichaTexto: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  etiqueta: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    opacity: 0.85,
  },
  vacio: {
    textAlign: 'center',
    alignSelf: 'center',
    flex: 1,
    fontStyle: 'italic',
    padding: 12,
  },
  extremos: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  extremo: {
    fontSize: 12,
    fontWeight: '700',
  },
  fila: {
    flexDirection: 'row',
    gap: 10,
  },
  mitad: {
    flex: 1,
  },
  log: {
    borderRadius: 12,
    padding: 14,
    gap: 4,
  },
  logTitulo: {
    color: '#64748B',
    fontFamily: FuenteMono,
    fontSize: 11,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  logLinea: {
    color: '#94A3B8',
    fontFamily: FuenteMono,
    fontSize: 13,
  },
  logUltima: {
    color: '#34D399',
    fontWeight: '700',
  },
});
