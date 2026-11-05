import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { usePermiso, type TipoRecurso } from '@/hooks/usePermiso';
import { useAjustesNotificaciones } from '@/lib/reportesStore';

// informacion y textos de proposito para cada recurso segun la teoria de clase
const DATOS_RECURSOS: Record<
  string,
  {
    titulo: string;
    beneficio: string;
    icono: React.ComponentProps<typeof FontAwesome>['name'];
    tipo: TipoRecurso;
  }
> = {
  camara: {
    titulo: 'Escaneo y fotos del aula',
    beneficio: 'Usamos tu cámara para escanear el código QR de la puerta del aula o tomar fotos del desperfecto.',
    icono: 'camera',
    tipo: 'camara',
  },
  ubicacion: {
    titulo: 'Ubicación del desperfecto',
    beneficio: 'Usamos tu ubicación para marcar dónde está el problema dentro del edificio escolar mientras usás la app.',
    icono: 'map-marker',
    tipo: 'ubicacion',
  },
  notificaciones: {
    titulo: 'Novedades de tus reportes',
    beneficio: 'Te enviamos avisos cuando el personal de maestranza o mantenimiento resuelva el desperfecto reportado.',
    icono: 'bell',
    tipo: 'notificaciones',
  },
  fotos: {
    titulo: 'Adjuntar evidencia',
    beneficio: 'Podés seleccionar una foto de tu galería para documentar el estado del desperfecto.',
    icono: 'photo',
    tipo: 'fotos',
  },
};

export default function PantallaPreviaPermiso() {
  const router = useRouter();
  const { recurso } = useLocalSearchParams<{ recurso: string }>();

  // busco la configuracion del recurso solicitado
  const clave = (recurso as string) || 'camara';
  const info = DATOS_RECURSOS[clave] || DATOS_RECURSOS.camara;

  // uso mi hook unificado para conocer el estado y accionar
  const { estado, pedir, abrirAjustes } = usePermiso(info.tipo);
  const { cambiar: cambiarNotificaciones } = useAjustesNotificaciones();

  // manejo la accion del unico boton permitido segun la pauta 5.1.1 iv de apple
  const manejarAccion = async () => {
    if (estado === 'bloqueado') {
      // si esta bloqueado, la unica salida es mandarlo a ajustes
      await abrirAjustes();
      router.back();
    } else {
      // si todavia se puede preguntar, disparo el dialogo nativo oficial
      const concedido = await pedir();
      if (clave === 'notificaciones' && concedido) {
        // activo la preferencia solo despues de que el sistema concede el permiso
        cambiarNotificaciones(true);
      }
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.modalContent}>
        {/* icono del recurso en un circulo destacado */}
        <View style={styles.iconWrapper}>
          <FontAwesome name={info.icono} size={40} color="#0f766e" />
        </View>

        {/* titulo y beneficio concreto en una frase */}
        <Text style={styles.titulo}>{info.titulo}</Text>
        <Text style={styles.beneficio}>{info.beneficio}</Text>

        {/* mensaje aclaratorio segun si esta bloqueado o si se va a mostrar el dialogo */}
        {estado === 'bloqueado' ? (
          <View style={styles.cajaAlerta}>
            <FontAwesome name="exclamation-triangle" size={15} color="#dc2626" />
            <Text style={styles.cajaAlertaTexto}>
              El permiso está desactivado para esta app. Para habilitarlo, tocá el botón de abajo y activalo en los Ajustes del sistema.
            </Text>
          </View>
        ) : (
          <View style={styles.cajaTip}>
            <FontAwesome name="lock" size={14} color="#0284c7" />
            <Text style={styles.cajaTipTexto}>
              El permiso lo otorga el sistema operativo en el siguiente paso. Podés cambiar o revocar esta decisión en cualquier momento desde Ajustes.
            </Text>
          </View>
        )}

        {/* un unico boton segun la regla de apple, sin opciones ambiguas como 'ahora no' */}
        {estado === 'cargando' ? (
          <ActivityIndicator size="small" color="#0f766e" style={{ marginVertical: 20 }} />
        ) : (
          <Pressable
            style={[
              styles.btnPrincipal,
              estado === 'bloqueado' ? styles.btnBloqueado : styles.btnContinuar,
            ]}
            onPress={manejarAccion}>
            <Text style={styles.btnTexto}>
              {estado === 'bloqueado' ? 'Abrir Ajustes' : 'Continuar'}
            </Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  iconWrapper: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#ccfbf1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  titulo: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
    textAlign: 'center',
  },
  beneficio: {
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 20,
  },
  cajaTip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f0f9ff',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0f2fe',
    marginVertical: 4,
  },
  cajaTipTexto: {
    flex: 1,
    fontSize: 12,
    color: '#0369a1',
    lineHeight: 16,
  },
  cajaAlerta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fef2f2',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fee2e2',
    marginVertical: 4,
  },
  cajaAlertaTexto: {
    flex: 1,
    fontSize: 12,
    color: '#b91c1c',
    lineHeight: 16,
  },
  btnPrincipal: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  btnContinuar: {
    backgroundColor: '#0f766e',
  },
  btnBloqueado: {
    backgroundColor: '#dc2626',
  },
  btnTexto: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
});
