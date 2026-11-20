import { useMemo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { EstadoPantalla } from '../../../components/EstadoPantalla';
import { FilaLibro } from '../../../components/FilaLibro';
import {
  ESPACIADO,
  TAMANIOS,
  type PaletaColores,
} from '../../../constants/tema';
import { useLibros } from '../../../hooks/useLibros';
import { useTema } from '../../../hooks/useTema';

function crearEstilos(colores: PaletaColores) {
  return StyleSheet.create({
    lista: {
      flex: 1,
      backgroundColor: colores.fondo,
    },
    contenido: {
      padding: ESPACIADO.lg,
      flexGrow: 1,
    },
    encabezado: {
      marginBottom: ESPACIADO.lg,
      gap: ESPACIADO.xs,
    },
    tituloSeccion: {
      fontSize: TAMANIOS.textoLg,
      fontWeight: '700',
      color: colores.texto,
    },
    subtitulo: {
      fontSize: TAMANIOS.textoSm,
      color: colores.textoSecundario,
    },
  });
}

export default function CatalogoPantalla() {
  const colores = useTema();
  const styles = useMemo(() => crearEstilos(colores), [colores]);
  const { libros, cargando, error, reintentar } = useLibros();

  if (cargando) {
    return (
      <EstadoPantalla
        tipo="cargando"
        mensaje="Cargando el catálogo de la biblioteca..."
      />
    );
  }

  if (error) {
    return (
      <EstadoPantalla
        tipo="error"
        mensaje={error}
        textoAccion="Reintentar"
        onAccion={reintentar}
      />
    );
  }

  return (
    <FlatList
      style={styles.lista}
      contentContainerStyle={styles.contenido}
      data={libros}
      keyExtractor={(item) => item.isbn}
      renderItem={({ item }) => <FilaLibro libro={item} />}
      ListHeaderComponent={
        <View style={styles.encabezado}>
          <Text style={styles.tituloSeccion}>Catálogo disponible</Text>
          <Text style={styles.subtitulo}>
            {libros.length} libros registrados en la biblioteca
          </Text>
        </View>
      }
      ListEmptyComponent={
        <EstadoPantalla
          tipo="vacio"
          mensaje="No hay libros cargados en el catálogo por el momento."
        />
      }
    />
  );
}
