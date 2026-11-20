import { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EstadoPantalla } from '../components/EstadoPantalla';
import {
  ESPACIADO,
  TAMANIOS,
  type PaletaColores,
} from '../constants/tema';
import { useBiblioteca } from '../context/BibliotecaContext';
import { useTema } from '../hooks/useTema';

function crearEstilos(colores: PaletaColores) {
  return StyleSheet.create({
    pantalla: {
      flex: 1,
      backgroundColor: colores.fondo,
    },
    contenido: {
      padding: ESPACIADO.lg,
      gap: ESPACIADO.md,
      flexGrow: 1,
    },
    barraSuperior: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: ESPACIADO.sm,
      gap: ESPACIADO.md,
    },
    tituloSeccion: {
      fontSize: TAMANIOS.textoLg,
      fontWeight: '700',
      color: colores.texto,
      flex: 1,
    },
    botonCerrarSesion: {
      minHeight: TAMANIOS.areaTactilMinima,
      borderRadius: TAMANIOS.radioMd,
      backgroundColor: colores.errorFondo,
      paddingHorizontal: ESPACIADO.md,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: ESPACIADO.xs,
    },
    textoCerrarSesion: {
      fontSize: TAMANIOS.textoSm,
      fontWeight: '700',
      color: colores.error,
    },
    bannerResultado: {
      backgroundColor: colores.exitoFondo,
      borderRadius: TAMANIOS.radioMd,
      padding: ESPACIADO.md,
      marginBottom: ESPACIADO.sm,
    },
    textoResultado: {
      fontSize: TAMANIOS.textoSm,
      fontWeight: '600',
      color: colores.exito,
    },
    tarjeta: {
      backgroundColor: colores.superficie,
      borderRadius: TAMANIOS.radioMd,
      borderWidth: 1,
      borderColor: colores.borde,
      padding: ESPACIADO.lg,
      marginBottom: ESPACIADO.md,
      gap: ESPACIADO.sm,
    },
    tituloLibro: {
      fontSize: TAMANIOS.textoMd,
      fontWeight: '700',
      color: colores.texto,
    },
    dato: {
      fontSize: TAMANIOS.textoSm,
      color: colores.textoSecundario,
    },
    destacado: {
      fontWeight: '700',
      color: colores.texto,
    },
    botonEntregar: {
      marginTop: ESPACIADO.xs,
      minHeight: TAMANIOS.areaTactilMinima,
      borderRadius: TAMANIOS.radioMd,
      backgroundColor: colores.primario,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: ESPACIADO.md,
    },
    textoEntregar: {
      fontSize: TAMANIOS.textoSm,
      fontWeight: '700',
      color: colores.primarioTexto,
    },
  });
}

export default function MostradorPantalla() {
  const colores = useTema();
  const styles = useMemo(() => crearEstilos(colores), [colores]);
  const {
    obtenerLibrosConEspera,
    entregarAlSiguiente,
    cerrarSesion,
  } = useBiblioteca();

  const [ultimoMensaje, setUltimoMensaje] = useState<string | null>(null);
  const librosConEspera = obtenerLibrosConEspera();

  async function manejarEntrega(isbn: string): Promise<void> {
    const resultado = await entregarAlSiguiente(isbn);
    if (!resultado.entregadoA) {
      setUltimoMensaje('No hay personas en la lista de espera para este libro.');
      return;
    }

    if (resultado.eraUsuarioActual) {
      setUltimoMensaje(
        `Se entregó "${resultado.tituloLibro}" a ${resultado.entregadoA}. Se envió notificación o aviso en Mis reservas.`,
      );
      return;
    }

    setUltimoMensaje(
      `Se entregó "${resultado.tituloLibro}" a ${resultado.entregadoA}.`,
    );
  }

  return (
    <FlatList
      style={styles.pantalla}
      contentContainerStyle={styles.contenido}
      data={librosConEspera}
      keyExtractor={(item) => item.libro.isbn}
      ListHeaderComponent={
        <View>
          <View style={styles.barraSuperior}>
            <Text style={styles.tituloSeccion}>
              Libros con lista de espera ({librosConEspera.length})
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Cerrar sesión del personal"
              style={styles.botonCerrarSesion}
              onPress={cerrarSesion}
            >
              <Ionicons
                name="log-out-outline"
                size={18}
                color={colores.error}
              />
              <Text style={styles.textoCerrarSesion}>Cerrar sesión</Text>
            </Pressable>
          </View>

          {ultimoMensaje ? (
            <View style={styles.bannerResultado}>
              <Text style={styles.textoResultado}>{ultimoMensaje}</Text>
            </View>
          ) : null}
        </View>
      }
      renderItem={({ item }) => (
        <View style={styles.tarjeta}>
          <Text style={styles.tituloLibro}>{item.libro.titulo}</Text>
          <Text style={styles.dato}>
            Siguiente al frente:{' '}
            <Text style={styles.destacado}>{item.frente}</Text>
          </Text>
          <Text style={styles.dato}>
            Personas esperando:{' '}
            <Text style={styles.destacado}>{item.cantidad}</Text>
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Entregar ${item.libro.titulo} al siguiente`}
            style={styles.botonEntregar}
            onPress={() => {
              void manejarEntrega(item.libro.isbn);
            }}
          >
            <Text style={styles.textoEntregar}>Entregar al siguiente</Text>
          </Pressable>
        </View>
      )}
      ListEmptyComponent={
        <EstadoPantalla
          tipo="vacio"
          mensaje="No hay libros con personas en lista de espera en este momento."
        />
      }
    />
  );
}
