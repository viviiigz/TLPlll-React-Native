import { useEffect, useMemo } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Link, Stack, router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  ESPACIADO,
  TAMANIOS,
  type PaletaColores,
} from '../../../../constants/tema';
import { useBiblioteca } from '../../../../context/BibliotecaContext';
import { LIBROS } from '../../../../data/libros';
import { useTema } from '../../../../hooks/useTema';
import { esIsbnValido } from '../../../../lib/validaciones';

function crearEstilos(colores: PaletaColores) {
  return StyleSheet.create({
    contenedor: {
      flex: 1,
      backgroundColor: colores.fondo,
    },
    contenido: {
      padding: ESPACIADO.lg,
      gap: ESPACIADO.lg,
    },
    tarjeta: {
      backgroundColor: colores.superficie,
      borderRadius: TAMANIOS.radioLg,
      borderWidth: 1,
      borderColor: colores.borde,
      padding: ESPACIADO.xl,
      gap: ESPACIADO.md,
    },
    titulo: {
      fontSize: TAMANIOS.textoTitulo,
      fontWeight: '700',
      color: colores.texto,
    },
    autor: {
      fontSize: TAMANIOS.textoLg,
      color: colores.textoSecundario,
    },
    filaDato: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: ESPACIADO.sm,
      borderTopWidth: 1,
      borderTopColor: colores.borde,
    },
    etiqueta: {
      fontSize: TAMANIOS.textoSm,
      color: colores.textoSecundario,
    },
    valor: {
      fontSize: TAMANIOS.textoMd,
      fontWeight: '600',
      color: colores.texto,
    },
    avisoEstado: {
      padding: ESPACIADO.md,
      borderRadius: TAMANIOS.radioMd,
      backgroundColor: colores.alertaFondo,
    },
    textoAvisoEstado: {
      fontSize: TAMANIOS.textoSm,
      color: colores.alerta,
      fontWeight: '600',
    },
    botonPrimario: {
      minHeight: TAMANIOS.areaTactilMinima,
      borderRadius: TAMANIOS.radioMd,
      backgroundColor: colores.primario,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: ESPACIADO.lg,
      paddingVertical: ESPACIADO.md,
      flexDirection: 'row',
      gap: ESPACIADO.sm,
    },
    botonDeshabilitado: {
      minHeight: TAMANIOS.areaTactilMinima,
      borderRadius: TAMANIOS.radioMd,
      backgroundColor: colores.superficieSecundaria,
      borderWidth: 1,
      borderColor: colores.borde,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: ESPACIADO.lg,
      paddingVertical: ESPACIADO.md,
    },
    textoBotonPrimario: {
      fontSize: TAMANIOS.textoMd,
      fontWeight: '700',
      color: colores.primarioTexto,
    },
    textoBotonDeshabilitado: {
      fontSize: TAMANIOS.textoMd,
      fontWeight: '600',
      color: colores.textoSecundario,
    },
    errorContenedor: {
      flex: 1,
      backgroundColor: colores.fondo,
      alignItems: 'center',
      justifyContent: 'center',
      padding: ESPACIADO.xl,
      gap: ESPACIADO.md,
    },
    errorTitulo: {
      fontSize: TAMANIOS.textoXl,
      fontWeight: '700',
      color: colores.texto,
      textAlign: 'center',
    },
    errorMensaje: {
      fontSize: TAMANIOS.textoMd,
      color: colores.textoSecundario,
      textAlign: 'center',
      lineHeight: 22,
    },
    linkVolver: {
      marginTop: ESPACIADO.sm,
      minHeight: TAMANIOS.areaTactilMinima,
      paddingHorizontal: ESPACIADO.xl,
      paddingVertical: ESPACIADO.md,
      borderRadius: TAMANIOS.radioMd,
      backgroundColor: colores.primario,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
}

export default function DetalleLibroPantalla() {
  const colores = useTema();
  const styles = useMemo(() => crearEstilos(colores), [colores]);
  const params = useLocalSearchParams<{ isbn?: string | string[] }>();
  const isbn = Array.isArray(params.isbn) ? params.isbn[0] ?? '' : params.isbn ?? '';

  const {
    registrarVisto,
    obtenerDisponibles,
    obtenerCantidadEspera,
    obtenerPosicionUsuario,
    tienePrestamoActivo,
  } = useBiblioteca();

  const isbnValido = esIsbnValido(isbn);
  const libro = useMemo(
    () => (isbnValido ? LIBROS.find((item) => item.isbn === isbn) ?? null : null),
    [isbn, isbnValido],
  );

  useEffect(() => {
    if (libro) {
      registrarVisto(libro);
    }
  }, [libro, registrarVisto]);

  if (!isbnValido || !libro) {
    const mensajeError = !isbnValido
      ? `El código "${isbn}" no es un ISBN válido. Debe contener exactamente 13 dígitos numéricos.`
      : `No encontramos ningún libro con el ISBN ${isbn} en el catálogo de Biblioteca IPF.`;

    return (
      <View style={styles.errorContenedor}>
        <Stack.Screen options={{ title: 'Libro no encontrado' }} />
        <Ionicons name="alert-circle-outline" size={52} color={colores.error} />
        <Text style={styles.errorTitulo}>Libro no disponible</Text>
        <Text style={styles.errorMensaje}>{mensajeError}</Text>
        <Link href="/" asChild>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Volver al Catálogo"
            style={styles.linkVolver}
          >
            <Text style={styles.textoBotonPrimario}>Volver al Catálogo</Text>
          </Pressable>
        </Link>
      </View>
    );
  }

  const disponibles = obtenerDisponibles(libro);
  const cantidadEspera = obtenerCantidadEspera(libro.isbn);
  const posicionUsuario = obtenerPosicionUsuario(libro.isbn);
  const yaPrestado = tienePrestamoActivo(libro.isbn);
  const yaReservado = yaPrestado || posicionUsuario !== null;

  return (
    <ScrollView
      style={styles.contenedor}
      contentContainerStyle={styles.contenido}
    >
      <Stack.Screen options={{ title: libro.titulo }} />

      <View style={styles.tarjeta}>
        <Text style={styles.titulo}>{libro.titulo}</Text>
        <Text style={styles.autor}>{libro.autor}</Text>

        <View style={styles.filaDato}>
          <Text style={styles.etiqueta}>Año de publicación</Text>
          <Text style={styles.valor}>{libro.anio}</Text>
        </View>

        <View style={styles.filaDato}>
          <Text style={styles.etiqueta}>ISBN-13</Text>
          <Text style={styles.valor}>{libro.isbn}</Text>
        </View>

        <View style={styles.filaDato}>
          <Text style={styles.etiqueta}>Ejemplares disponibles</Text>
          <Text style={styles.valor}>{disponibles}</Text>
        </View>

        <View style={styles.filaDato}>
          <Text style={styles.etiqueta}>Personas en lista de espera</Text>
          <Text style={styles.valor}>{cantidadEspera}</Text>
        </View>

        {yaPrestado ? (
          <View style={styles.avisoEstado}>
            <Text style={styles.textoAvisoEstado}>
              Ya tenés este libro en préstamo. Podés gestionarlo en “Mis reservas”.
            </Text>
          </View>
        ) : posicionUsuario !== null ? (
          <View style={styles.avisoEstado}>
            <Text style={styles.textoAvisoEstado}>
              Estás en la lista de espera (posición #{posicionUsuario}).
            </Text>
          </View>
        ) : null}
      </View>

      {yaReservado ? (
        <View style={styles.botonDeshabilitado}>
          <Text style={styles.textoBotonDeshabilitado}>
            {yaPrestado ? 'Libro en préstamo' : 'Ya estás en lista de espera'}
          </Text>
        </View>
      ) : (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Reservar ${libro.titulo}`}
          style={styles.botonPrimario}
          onPress={() =>
            router.push({
              pathname: '/reservar/[isbn]',
              params: { isbn: libro.isbn },
            })
          }
        >
          <Ionicons
            name="bookmark-outline"
            size={20}
            color={colores.primarioTexto}
          />
          <Text style={styles.textoBotonPrimario}>
            {disponibles > 0 ? 'Reservar' : 'Anotarme en lista de espera'}
          </Text>
        </Pressable>
      )}
    </ScrollView>
  );
}
