import { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { EstadoPantalla } from '../components/EstadoPantalla';
import { FilaLibro } from '../components/FilaLibro';
import {
  ESPACIADO,
  TAMANIOS,
  type PaletaColores,
} from '../constants/tema';
import { useBiblioteca } from '../context/BibliotecaContext';
import { useTema } from '../hooks/useTema';
import { buscarLibros } from '../lib/api';
import type { Libro } from '../types';

const DEMORA_DEBOUNCE_MS = 300;

function crearEstilos(colores: PaletaColores) {
  return StyleSheet.create({
    contenedor: {
      flex: 1,
      backgroundColor: colores.fondo,
    },
    barraBusqueda: {
      padding: ESPACIADO.lg,
      backgroundColor: colores.superficie,
      borderBottomWidth: 1,
      borderBottomColor: colores.borde,
    },
    cajaInput: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colores.superficieSecundaria,
      borderRadius: TAMANIOS.radioMd,
      borderWidth: 1,
      borderColor: colores.borde,
      paddingHorizontal: ESPACIADO.md,
      minHeight: TAMANIOS.areaTactilMinima,
      gap: ESPACIADO.sm,
    },
    input: {
      flex: 1,
      fontSize: TAMANIOS.textoMd,
      color: colores.texto,
      paddingVertical: ESPACIADO.sm,
    },
    botonLimpiar: {
      minWidth: TAMANIOS.areaTactilMinima,
      minHeight: TAMANIOS.areaTactilMinima,
      alignItems: 'center',
      justifyContent: 'center',
    },
    contenidoLista: {
      padding: ESPACIADO.lg,
      flexGrow: 1,
    },
    resumen: {
      fontSize: TAMANIOS.textoSm,
      color: colores.textoSecundario,
      marginBottom: ESPACIADO.md,
    },
  });
}

export default function BuscarPantalla() {
  const colores = useTema();
  const styles = useMemo(() => crearEstilos(colores), [colores]);
  const { obtenerDisponibles } = useBiblioteca();
  const params = useLocalSearchParams<{ q?: string | string[] }>();
  const q = Array.isArray(params.q) ? params.q[0] ?? '' : params.q ?? '';

  const [resultados, setResultados] = useState<Libro[]>([]);
  const [cargando, setCargando] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [intento, setIntento] = useState<number>(0);

  useEffect(() => {
    let cancelado = false;
    setCargando(true);
    setError(null);

    const temporizador = setTimeout(() => {
      async function ejecutarBusqueda(): Promise<void> {
        try {
          const datos = await buscarLibros(q);
          if (!cancelado) {
            setResultados(datos);
            setCargando(false);
          }
        } catch {
          if (!cancelado) {
            setError('No pudimos completar la búsqueda. Intentá nuevamente.');
            setCargando(false);
          }
        }
      }

      void ejecutarBusqueda();
    }, DEMORA_DEBOUNCE_MS);

    return () => {
      cancelado = true;
      clearTimeout(temporizador);
    };
  }, [q, intento]);

  function actualizarTexto(texto: string): void {
    router.setParams({ q: texto });
  }

  return (
    <View style={styles.contenedor}>
      <View style={styles.barraBusqueda}>
        <View style={styles.cajaInput}>
          <Ionicons
            name="search-outline"
            size={20}
            color={colores.textoSecundario}
          />
          <TextInput
            style={styles.input}
            value={q}
            onChangeText={actualizarTexto}
            placeholder="Buscar por título o autor..."
            placeholderTextColor={colores.textoSecundario}
            autoCorrect={false}
            returnKeyType="search"
            accessibilityLabel="Buscar por título o autor"
          />
          {q.length > 0 ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Limpiar búsqueda"
              style={styles.botonLimpiar}
              onPress={() => actualizarTexto('')}
            >
              <Ionicons
                name="close-circle"
                size={20}
                color={colores.textoSecundario}
              />
            </Pressable>
          ) : null}
        </View>
      </View>

      {cargando ? (
        <EstadoPantalla tipo="cargando" mensaje="Buscando libros..." />
      ) : error ? (
        <EstadoPantalla
          tipo="error"
          mensaje={error}
          textoAccion="Reintentar"
          onAccion={() => setIntento((prev) => prev + 1)}
        />
      ) : (
        <FlatList
          contentContainerStyle={styles.contenidoLista}
          data={resultados}
          keyExtractor={(item) => item.isbn}
          ListHeaderComponent={
            resultados.length > 0 ? (
              <Text style={styles.resumen}>
                {q.trim().length > 0
                  ? `${resultados.length} resultado${resultados.length === 1 ? '' : 's'} para "${q.trim()}"`
                  : `Mostrando todo el catálogo (${resultados.length} libros)`}
              </Text>
            ) : undefined
          }
          renderItem={({ item }) => (
            <FilaLibro
              libro={item}
              ejemplaresDisponibles={obtenerDisponibles(item)}
              onPresionar={() =>
                router.push({
                  pathname: '/libro/[isbn]',
                  params: { isbn: item.isbn },
                })
              }
            />
          )}
          ListEmptyComponent={
            <EstadoPantalla
              tipo="vacio"
              mensaje={`No encontramos libros que coincidan con "${q.trim()}".`}
            />
          }
        />
      )}
    </View>
  );
}
