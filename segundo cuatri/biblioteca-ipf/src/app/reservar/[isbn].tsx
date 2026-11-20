import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  DIAS_PRESTAMO,
  ESPACIADO,
  TAMANIOS,
  type PaletaColores,
} from '../../constants/tema';
import { useBiblioteca } from '../../context/BibliotecaContext';
import { LIBROS } from '../../data/libros';
import { useTema } from '../../hooks/useTema';
import {
  esIsbnValido,
  formatearFechaCorta,
  sumarDiasISO,
} from '../../lib/validaciones';

function crearEstilos(colores: PaletaColores) {
  return StyleSheet.create({
    contenedor: {
      flex: 1,
      backgroundColor: colores.fondo,
      padding: ESPACIADO.xl,
      justifyContent: 'center',
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
    encabezadoIcono: {
      alignItems: 'center',
      marginBottom: ESPACIADO.xs,
    },
    titulo: {
      fontSize: TAMANIOS.textoXl,
      fontWeight: '700',
      color: colores.texto,
      textAlign: 'center',
    },
    libroTitulo: {
      fontSize: TAMANIOS.textoLg,
      fontWeight: '600',
      color: colores.primario,
      textAlign: 'center',
    },
    descripcion: {
      fontSize: TAMANIOS.textoMd,
      color: colores.textoSecundario,
      textAlign: 'center',
      lineHeight: 22,
    },
    cajaDetalle: {
      backgroundColor: colores.superficieSecundaria,
      borderRadius: TAMANIOS.radioMd,
      padding: ESPACIADO.md,
      gap: ESPACIADO.xs,
    },
    textoDetalle: {
      fontSize: TAMANIOS.textoSm,
      color: colores.texto,
      textAlign: 'center',
      fontWeight: '600',
    },
    cajaError: {
      backgroundColor: colores.errorFondo,
      borderRadius: TAMANIOS.radioMd,
      padding: ESPACIADO.md,
    },
    textoError: {
      fontSize: TAMANIOS.textoSm,
      color: colores.error,
      textAlign: 'center',
      fontWeight: '600',
    },
    acciones: {
      gap: ESPACIADO.md,
      marginTop: ESPACIADO.sm,
    },
    botonPrimario: {
      minHeight: TAMANIOS.areaTactilMinima,
      borderRadius: TAMANIOS.radioMd,
      backgroundColor: colores.primario,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: ESPACIADO.lg,
      paddingVertical: ESPACIADO.md,
    },
    textoPrimario: {
      fontSize: TAMANIOS.textoMd,
      fontWeight: '700',
      color: colores.primarioTexto,
    },
    botonSecundario: {
      minHeight: TAMANIOS.areaTactilMinima,
      borderRadius: TAMANIOS.radioMd,
      backgroundColor: colores.superficie,
      borderWidth: 1,
      borderColor: colores.borde,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: ESPACIADO.lg,
      paddingVertical: ESPACIADO.md,
    },
    textoSecundario: {
      fontSize: TAMANIOS.textoMd,
      fontWeight: '600',
      color: colores.texto,
    },
  });
}

export default function ReservarModalPantalla() {
  const colores = useTema();
  const styles = useMemo(() => crearEstilos(colores), [colores]);
  const params = useLocalSearchParams<{ isbn?: string | string[] }>();
  const isbn = Array.isArray(params.isbn) ? params.isbn[0] ?? '' : params.isbn ?? '';

  const {
    obtenerDisponibles,
    obtenerCantidadEspera,
    obtenerPosicionUsuario,
    tienePrestamoActivo,
    reservarLibro,
  } = useBiblioteca();

  const [mensajeError, setMensajeError] = useState<string | null>(null);

  const libro = useMemo(
    () =>
      esIsbnValido(isbn)
        ? LIBROS.find((item) => item.isbn === isbn) ?? null
        : null,
    [isbn],
  );

  if (!libro) {
    return (
      <View style={styles.contenedor}>
        <View style={styles.tarjeta}>
          <View style={styles.encabezadoIcono}>
            <Ionicons
              name="alert-circle-outline"
              size={48}
              color={colores.error}
            />
          </View>
          <Text style={styles.titulo}>No se puede reservar</Text>
          <Text style={styles.descripcion}>
            El libro solicitado no existe o el código ISBN no es válido.
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Cerrar"
            style={styles.botonPrimario}
            onPress={() => router.dismiss()}
          >
            <Text style={styles.textoPrimario}>Cerrar</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const disponibles = obtenerDisponibles(libro);
  const cantidadEspera = obtenerCantidadEspera(libro.isbn);
  const yaPrestado = tienePrestamoActivo(libro.isbn);
  const posicionActual = obtenerPosicionUsuario(libro.isbn);
  const yaReservado = yaPrestado || posicionActual !== null;
  const fechaDevolucionEstimada = formatearFechaCorta(
    sumarDiasISO(DIAS_PRESTAMO),
  );

  function manejarConfirmar(): void {
    if (!libro) {
      return;
    }
    const resultado = reservarLibro(libro.isbn);
    if (resultado.tipo === 'duplicado' || resultado.tipo === 'error') {
      setMensajeError(resultado.mensaje);
      return;
    }
    router.dismissTo('/reservas');
  }

  return (
    <View style={styles.contenedor}>
      <View style={styles.tarjeta}>
        <View style={styles.encabezadoIcono}>
          <Ionicons
            name={disponibles > 0 ? 'book-outline' : 'time-outline'}
            size={48}
            color={colores.primario}
          />
        </View>

        <Text style={styles.titulo}>
          {disponibles > 0
            ? 'Confirmar préstamo'
            : 'Confirmar lista de espera'}
        </Text>
        <Text style={styles.libroTitulo}>{libro.titulo}</Text>

        {yaReservado ? (
          <View style={styles.cajaError}>
            <Text style={styles.textoError}>
              {yaPrestado
                ? 'Ya tenés este libro en préstamo.'
                : `Ya estás en la lista de espera (posición #${posicionActual}).`}
            </Text>
          </View>
        ) : disponibles > 0 ? (
          <>
            <Text style={styles.descripcion}>
              Hay {disponibles} ejemplar{disponibles === 1 ? '' : 'es'}{' '}
              disponible{disponibles === 1 ? '' : 's'}. Al confirmar se registra
              un préstamo por {DIAS_PRESTAMO} días.
            </Text>
            <View style={styles.cajaDetalle}>
              <Text style={styles.textoDetalle}>
                Fecha estimada de devolución: {fechaDevolucionEstimada}
              </Text>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.descripcion}>
              Actualmente no hay ejemplares en el estante. Al confirmar te
              anotás al final de la lista de espera.
            </Text>
            <View style={styles.cajaDetalle}>
              <Text style={styles.textoDetalle}>
                Tu posición en la cola será: #{cantidadEspera + 1}
              </Text>
            </View>
          </>
        )}

        {mensajeError ? (
          <View style={styles.cajaError}>
            <Text style={styles.textoError}>{mensajeError}</Text>
          </View>
        ) : null}

        <View style={styles.acciones}>
          {!yaReservado ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Confirmar reserva"
              style={styles.botonPrimario}
              onPress={manejarConfirmar}
            >
              <Text style={styles.textoPrimario}>Confirmar</Text>
            </Pressable>
          ) : (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Ir a Mis reservas"
              style={styles.botonPrimario}
              onPress={() => router.dismissTo('/reservas')}
            >
              <Text style={styles.textoPrimario}>Ir a Mis reservas</Text>
            </Pressable>
          )}

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Cancelar"
            style={styles.botonSecundario}
            onPress={() => router.dismiss()}
          >
            <Text style={styles.textoSecundario}>Cancelar</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
