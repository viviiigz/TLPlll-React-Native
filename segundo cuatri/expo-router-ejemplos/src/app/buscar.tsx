/**
 * RUTA "/buscar?q=...&categoria=..."  →  src/app/buscar.tsx
 *
 * Los "query params" (lo que va después del ?) NO necesitan corchetes
 * en el nombre del archivo. Se leen igual con useLocalSearchParams()
 * y se actualizan con router.setParams() sin apilar pantallas nuevas.
 */
import { Link, router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { InfoRuta } from '@/components/info-ruta';
import { Nota } from '@/components/nota';
import { Pantalla } from '@/components/pantalla';
import { Codigo, Parrafo } from '@/components/texto';
import { categorias, formatearPrecio, productos, type Categoria } from '@/data/productos';
import { useColores } from '@/hooks/use-colores';

export default function Buscar() {
  const colores = useColores();
  const { q = '', categoria } = useLocalSearchParams<{ q?: string; categoria?: Categoria }>();

  // Estado local para que el cursor del input no "salte" mientras escribimos.
  const [texto, setTexto] = useState(q);

  const cambiarTexto = (nuevo: string) => {
    setTexto(nuevo);
    router.setParams({ q: nuevo || undefined });
  };

  const cambiarCategoria = (nueva: Categoria) => {
    router.setParams({ categoria: nueva === categoria ? undefined : nueva });
  };

  const resultados = productos.filter(
    (p) =>
      p.nombre.toLowerCase().includes(texto.toLowerCase()) &&
      (!categoria || p.categoria === categoria),
  );

  return (
    <Pantalla>
      <TextInput
        value={texto}
        onChangeText={cambiarTexto}
        placeholder="Buscar… (probá: mate, chipá)"
        placeholderTextColor={colores.textoSecundario}
        autoCorrect={false}
        style={[
          styles.input,
          { color: colores.texto, backgroundColor: colores.superficie, borderColor: colores.borde },
        ]}
      />

      <View style={styles.chips}>
        {categorias.map((c) => {
          const activa = c.id === categoria;
          return (
            <Pressable
              key={c.id}
              onPress={() => cambiarCategoria(c.id)}
              style={[
                styles.chip,
                {
                  backgroundColor: activa ? colores.primario : colores.superficie,
                  borderColor: activa ? colores.primario : colores.borde,
                },
              ]}>
              <Text style={{ color: activa ? '#FFFFFF' : colores.texto, fontWeight: '600' }}>
                {c.nombre}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Parrafo>
        {resultados.length} resultado{resultados.length === 1 ? '' : 's'}
      </Parrafo>

      {resultados.map((p) => (
        <Link
          key={p.id}
          href={{ pathname: '/productos/[id]', params: { id: p.id } }}
          style={[styles.resultado, { color: colores.texto, borderColor: colores.borde }]}>
          {p.nombre} · {formatearPrecio(p.precio)}
        </Link>
      ))}

      <Nota titulo="La búsqueda vive en la URL">
        Escribí algo y mirá cómo cambia <Codigo>useLocalSearchParams()</Codigo> abajo. Como el
        estado está en la URL, se puede compartir con un link: rutasipf://buscar?q=mate
      </Nota>

      <InfoRuta />
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
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  resultado: {
    fontSize: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
});
