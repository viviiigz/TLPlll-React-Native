/**
 * RUTA CATCH-ALL "/docs/*"  →  src/app/docs/[...slug].tsx
 *
 * Los tres puntos `[...slug]` capturan TODOS los segmentos que siguen:
 *   /docs/guia                 → slug = ['guia']
 *   /docs/guia/expo-router     → slug = ['guia', 'expo-router']
 *   /docs/a/b/c/d              → slug = ['a', 'b', 'c', 'd']
 */
import Ionicons from '@expo/vector-icons/Ionicons';
import { Link, useLocalSearchParams } from 'expo-router';
import { Fragment } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Boton } from '@/components/boton';
import { InfoRuta } from '@/components/info-ruta';
import { Nota } from '@/components/nota';
import { Pantalla } from '@/components/pantalla';
import { Codigo, Titulo } from '@/components/texto';
import { FuenteMono } from '@/constants/theme';
import { useColores } from '@/hooks/use-colores';

const SUGERENCIAS = ['rutas', 'dinamicas', 'layouts', 'tabs', 'stack'];

export default function Documentacion() {
  const colores = useColores();
  const { slug } = useLocalSearchParams<{ slug: string[] }>();

  // Por las dudas normalizamos: siempre trabajamos con un array.
  const partes = Array.isArray(slug) ? slug : slug ? [slug] : [];
  const sugerencia = SUGERENCIAS[partes.length % SUGERENCIAS.length];

  return (
    <Pantalla>
      <Titulo>{partes.at(-1) ?? 'docs'}</Titulo>

      {/* Migas de pan: cada parte es un link al nivel correspondiente */}
      <View style={[styles.migas, { backgroundColor: colores.superficie, borderColor: colores.borde }]}>
        <Ionicons name="folder-open" size={16} color={colores.alerta} />
        <Text style={[styles.miga, { color: colores.textoSecundario }]}>docs</Text>
        {partes.map((parte, i) => (
          <Fragment key={`${parte}-${i}`}>
            <Text style={{ color: colores.textoSecundario }}>/</Text>
            <Link
              href={{ pathname: '/docs/[...slug]', params: { slug: partes.slice(0, i + 1) } }}
              style={[styles.miga, { color: i === partes.length - 1 ? colores.texto : colores.primario }]}>
              {parte}
            </Link>
          </Fragment>
        ))}
      </View>

      <View style={[styles.codigo, { backgroundColor: '#0F172A' }]}>
        <Text style={styles.codigoTexto}>slug = {JSON.stringify(partes)}</Text>
        <Text style={styles.codigoTexto}>slug.length = {partes.length}</Text>
      </View>

      <Link
        href={{ pathname: '/docs/[...slug]', params: { slug: [...partes, sugerencia] } }}
        asChild>
        <Boton titulo={`Entrar a /${sugerencia}`} icono="enter" />
      </Link>

      <Nota titulo="¿Para qué sirve?">
        Para rutas con profundidad variable: carpetas, categorías anidadas, documentación, un
        blog con fechas… Una sola pantalla <Codigo>[...slug].tsx</Codigo> resuelve todas.
      </Nota>

      <Nota tipo="tip" titulo="Diferencia con [id]">
        <Codigo>[id]</Codigo> captura exactamente UN segmento (string).{'\n'}
        <Codigo>[...slug]</Codigo> captura UNO O MÁS segmentos (string[]).
      </Nota>

      <InfoRuta />
    </Pantalla>
  );
}

const styles = StyleSheet.create({
  migas: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  miga: {
    fontFamily: FuenteMono,
    fontSize: 14,
    fontWeight: '700',
  },
  codigo: {
    borderRadius: 12,
    padding: 14,
    gap: 4,
  },
  codigoTexto: {
    color: '#A5F3FC',
    fontFamily: FuenteMono,
    fontSize: 14,
  },
});
