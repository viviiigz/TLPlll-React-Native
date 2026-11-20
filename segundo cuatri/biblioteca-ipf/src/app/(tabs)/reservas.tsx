import { useCallback, useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { EstadoPantalla } from '../../components/EstadoPantalla';
import { ItemPrestamo } from '../../components/ItemPrestamo';
import {
  ESPACIADO,
  TAMANIOS,
  type PaletaColores,
} from '../../constants/tema';
import { useBiblioteca } from '../../context/BibliotecaContext';
import { usePermiso } from '../../hooks/usePermiso';
import { useTema } from '../../hooks/useTema';
import {
  cancelarRecordatorio,
  programarRecordatorioDevolucion,
} from '../../lib/notificaciones';
import type { Prestamo } from '../../types';

function crearEstilos(colores: PaletaColores) {
  return StyleSheet.create({
    contenedor: {
      flex: 1,
      backgroundColor: colores.fondo,
    },
    contenido: {
      padding: ESPACIADO.lg,
      gap: ESPACIADO.lg,
      flexGrow: 1,
    },
    estadoPermiso: {
      backgroundColor: colores.superficie,
      borderRadius: TAMANIOS.radioMd,
      borderWidth: 1,
      borderColor: colores.borde,
      padding: ESPACIADO.md,
      flexDirection: 'row',
      alignItems: 'center',
      gap: ESPACIADO.sm,
    },
    textoEstadoPermiso: {
      flex: 1,
      fontSize: TAMANIOS.textoSm,
      color: colores.textoSecundario,
    },
    seccion: {
      gap: ESPACIADO.md,
    },
    tituloSeccion: {
      fontSize: TAMANIOS.textoLg,
      fontWeight: '700',
      color: colores.texto,
    },
    bannerFeedback: {
      backgroundColor: colores.alertaFondo,
      borderRadius: TAMANIOS.radioMd,
      padding: ESPACIADO.md,
      gap: ESPACIADO.sm,
    },
    textoFeedback: {
      fontSize: TAMANIOS.textoSm,
      color: colores.alerta,
      fontWeight: '600',
    },
    bannerAviso: {
      backgroundColor: colores.exitoFondo,
      borderRadius: TAMANIOS.radioMd,
      padding: ESPACIADO.md,
      flexDirection: 'row',
      alignItems: 'center',
      gap: ESPACIADO.sm,
    },
    textoAviso: {
      flex: 1,
      fontSize: TAMANIOS.textoSm,
      color: colores.exito,
      fontWeight: '600',
    },
    botonCerrarAviso: {
      minWidth: TAMANIOS.areaTactilMinima,
      minHeight: TAMANIOS.areaTactilMinima,
      alignItems: 'center',
      justifyContent: 'center',
    },
    tarjetaEspera: {
      backgroundColor: colores.superficie,
      borderRadius: TAMANIOS.radioMd,
      borderWidth: 1,
      borderColor: colores.borde,
      padding: ESPACIADO.lg,
      gap: ESPACIADO.xs,
    },
    tituloEspera: {
      fontSize: TAMANIOS.textoMd,
      fontWeight: '700',
      color: colores.texto,
    },
    detalleEspera: {
      fontSize: TAMANIOS.textoSm,
      color: colores.textoSecundario,
    },
    botonAjustes: {
      minHeight: TAMANIOS.areaTactilMinima,
      borderRadius: TAMANIOS.radioMd,
      backgroundColor: colores.primario,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: ESPACIADO.md,
    },
    textoBotonAjustes: {
      fontSize: TAMANIOS.textoSm,
      fontWeight: '700',
      color: colores.primarioTexto,
    },
  });
}

export default function ReservasPantalla() {
  const colores = useTema();
  const styles = useMemo(() => crearEstilos(colores), [colores]);
  const {
    prestamos,
    avisosInternos,
    obtenerMisReservasEnEspera,
    devolverLibro,
    actualizarRecordatorio,
    descartarAviso,
  } = useBiblioteca();
  const { estado: estadoNotif, pedir, abrirAjustes, revisar } =
    usePermiso('notificaciones');

  const [mensajeRecordatorio, setMensajeRecordatorio] = useState<string | null>(
    null,
  );

  useFocusEffect(
    useCallback(() => {
      void revisar();
    }, [revisar]),
  );

  const reservasEnEspera = obtenerMisReservasEnEspera();

  async function manejarRecordatorio(
    prestamo: Prestamo,
    activar: boolean,
  ): Promise<void> {
    setMensajeRecordatorio(null);

    if (!activar) {
      if (prestamo.notificacionId) {
        await cancelarRecordatorio(prestamo.notificacionId);
      }
      actualizarRecordatorio(prestamo.isbn, false, null);
      return;
    }

    if (estadoNotif === 'bloqueado') {
      setMensajeRecordatorio(
        'Las notificaciones están bloqueadas. Podés habilitarlas en Ajustes; mientras tanto verás los avisos acá.',
      );
      router.push({
        pathname: '/permisos/[recurso]',
        params: { recurso: 'notificaciones' },
      });
      return;
    }

    let concedido = estadoNotif === 'concedido';
    if (!concedido) {
      concedido = await pedir();
    }

    if (!concedido) {
      setMensajeRecordatorio(
        'No se otorgó permiso de notificaciones. Seguís pudiendo ver tus vencimientos y avisos dentro de esta pantalla.',
      );
      return;
    }

    try {
      const id = await programarRecordatorioDevolucion(
        prestamo.titulo,
        prestamo.isbn,
      );
      actualizarRecordatorio(prestamo.isbn, true, id);
      setMensajeRecordatorio(
        `Recordatorio programado para "${prestamo.titulo}" (llegará en 15 segundos).`,
      );
    } catch {
      setMensajeRecordatorio(
        'No pudimos programar la notificación en este dispositivo.',
      );
    }
  }

  const textoEstadoPermiso =
    estadoNotif === 'concedido'
      ? 'Notificaciones habilitadas para recordatorios y entregas.'
      : estadoNotif === 'bloqueado'
        ? 'Notificaciones bloqueadas: los avisos aparecerán dentro de esta pantalla.'
        : 'Las notificaciones se pedirán solo si activás “Recordarme”.';

  const sinActividad =
    prestamos.length === 0 &&
    reservasEnEspera.length === 0 &&
    avisosInternos.length === 0;

  return (
    <ScrollView
      style={styles.contenedor}
      contentContainerStyle={styles.contenido}
    >
      <View style={styles.estadoPermiso}>
        <Ionicons
          name={
            estadoNotif === 'concedido'
              ? 'notifications-outline'
              : 'notifications-off-outline'
          }
          size={20}
          color={
            estadoNotif === 'concedido'
              ? colores.exito
              : colores.textoSecundario
          }
        />
        <Text style={styles.textoEstadoPermiso}>{textoEstadoPermiso}</Text>
      </View>

      {mensajeRecordatorio ? (
        <View style={styles.bannerFeedback}>
          <Text style={styles.textoFeedback}>{mensajeRecordatorio}</Text>
          {estadoNotif === 'bloqueado' ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Abrir Ajustes de notificaciones"
              style={styles.botonAjustes}
              onPress={() => {
                void abrirAjustes();
              }}
            >
              <Text style={styles.textoBotonAjustes}>Abrir Ajustes</Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}

      {avisosInternos.length > 0 ? (
        <View style={styles.seccion}>
          <Text style={styles.tituloSeccion}>Avisos de la biblioteca</Text>
          {avisosInternos.map((aviso) => (
            <View key={aviso.id} style={styles.bannerAviso}>
              <Ionicons
                name="checkmark-circle-outline"
                size={22}
                color={colores.exito}
              />
              <Text style={styles.textoAviso}>{aviso.mensaje}</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Descartar aviso"
                style={styles.botonCerrarAviso}
                onPress={() => descartarAviso(aviso.id)}
              >
                <Ionicons name="close" size={20} color={colores.exito} />
              </Pressable>
            </View>
          ))}
        </View>
      ) : null}

      {sinActividad ? (
        <EstadoPantalla
          tipo="vacio"
          mensaje="Todavía no tenés préstamos ni reservas en espera. Explorá el Catálogo para reservar un libro."
        />
      ) : (
        <>
          {prestamos.length > 0 ? (
            <View style={styles.seccion}>
              <Text style={styles.tituloSeccion}>
                Mis préstamos ({prestamos.length})
              </Text>
              {prestamos.map((prestamo) => (
                <ItemPrestamo
                  key={prestamo.isbn}
                  prestamo={prestamo}
                  alCambiarRecordatorio={(activo) => {
                    void manejarRecordatorio(prestamo, activo);
                  }}
                  alDevolver={() => {
                    void devolverLibro(prestamo.isbn);
                  }}
                />
              ))}
            </View>
          ) : null}

          {reservasEnEspera.length > 0 ? (
            <View style={styles.seccion}>
              <Text style={styles.tituloSeccion}>
                En lista de espera ({reservasEnEspera.length})
              </Text>
              {reservasEnEspera.map(({ libro, posicion, totalEnEspera }) => (
                <View key={libro.isbn} style={styles.tarjetaEspera}>
                  <Text style={styles.tituloEspera}>{libro.titulo}</Text>
                  <Text style={styles.detalleEspera}>
                    Tu posición actual: #{posicion} de {totalEnEspera} en espera
                  </Text>
                </View>
              ))}
            </View>
          ) : null}
        </>
      )}
    </ScrollView>
  );
}
