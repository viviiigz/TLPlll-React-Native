import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Switch,
  Pressable,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { usePermiso } from '@/hooks/usePermiso';
import { useAjustesNotificaciones } from '@/lib/reportesStore';

export default function PantallaAjustesApp() {
  const router = useRouter();
  // obtengo el estado del permiso de notificaciones con mi hook unificado
  const { estado, pedir, abrirAjustes } = usePermiso('notificaciones');
  // estado persistido en memoria para saber si el usuario quiere recibir avisos
  const { habilitadas, cambiar } = useAjustesNotificaciones();

  // esta funcion se dispara unicamente al tocar el interruptor, cumpliendo la regla de 'pedir en contexto'
  const manejarCambioSwitch = async (nuevoValor: boolean) => {
    if (!nuevoValor) {
      // si lo apaga, simplemente guardo la preferencia sin pedir nada al sistema
      cambiar(false);
      return;
    }

    // si lo enciende, verifico el estado del permiso en el sistema operativo
    if (estado === 'concedido') {
      cambiar(true);
      return;
    }

    if (estado === 'bloqueado') {
      // si el permiso ya esta bloqueado, le explico al usuario y le ofrezco abrir ajustes
      Alert.alert(
        'Permiso de Notificaciones Bloqueado',
        'Las notificaciones fueron denegadas en el sistema. Para recibirlas tenés que activarlas en los Ajustes del dispositivo.',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Abrir Ajustes',
            onPress: () => abrirAjustes(),
          },
        ]
      );
      return;
    }

    // si todavia es preguntable, primero abro la pantalla previa con la explicacion concreta
    router.push('/permisos/notificaciones' as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.seccion}>
          <Text style={styles.seccionTitulo}>Notificaciones y Avisos</Text>

          {/* tarjeta con el interruptor principal de la consigna */}
          <View style={styles.filaAjuste}>
            <View style={styles.iconoCaja}>
              <FontAwesome name="bell" size={18} color="#0f766e" />
            </View>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={styles.ajusteTitulo}>Avisarme cuando se resuelva mi reporte</Text>
              <Text style={styles.ajusteSub}>
                Recibí una notificación local a los 10 segundos de simularse la resolución.
              </Text>
            </View>
            <Switch
              value={habilitadas && estado === 'concedido'}
              onValueChange={manejarCambioSwitch}
              trackColor={{ false: '#cbd5e1', true: '#0f766e' }}
              thumbColor="#ffffff"
            />
          </View>
        </View>

        {/* estado actual del permiso en el sistema */}
        <View style={styles.cardEstado}>
          <View style={styles.estadoFila}>
            <Text style={styles.estadoLabel}>Estado en el sistema:</Text>
            <Text
              style={[
                styles.estadoValor,
                {
                  color:
                    estado === 'concedido'
                      ? '#15803d'
                      : estado === 'bloqueado'
                      ? '#b91c1c'
                      : '#b45309',
                },
              ]}>
              {estado.toUpperCase()}
            </Text>
          </View>

          {estado === 'bloqueado' && (
            <Pressable style={styles.btnAjustesManual} onPress={() => abrirAjustes()}>
              <FontAwesome name="cog" size={14} color="#ffffff" />
              <Text style={styles.btnAjustesManualTexto}>Habilitar en Ajustes</Text>
            </Pressable>
          )}
        </View>

        {/* explicacion de alternativa si no hay permisos */}
        <View style={styles.cardAlternativa}>
          <FontAwesome name="info-circle" size={16} color="#0369a1" />
          <Text style={styles.cardAlternativaTexto}>
            <strong>Alternativa garantizada:</strong> Si decidís no habilitar las notificaciones, los avisos quedarán guardados igual en la pestaña <strong>Avisos</strong> para que nunca te pierdas una novedad.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 16,
    gap: 16,
  },
  seccion: {
    gap: 8,
  },
  seccionTitulo: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  filaAjuste: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  iconoCaja: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ccfbf1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  ajusteTitulo: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  ajusteSub: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
    lineHeight: 16,
  },
  cardEstado: {
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 10,
  },
  estadoFila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  estadoLabel: {
    fontSize: 13,
    color: '#475569',
  },
  estadoValor: {
    fontSize: 13,
    fontWeight: '800',
  },
  btnAjustesManual: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#dc2626',
    paddingVertical: 10,
    borderRadius: 8,
  },
  btnAjustesManualTexto: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  cardAlternativa: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#f0f9ff',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0f2fe',
  },
  cardAlternativaTexto: {
    flex: 1,
    fontSize: 12,
    color: '#0369a1',
    lineHeight: 17,
  },
});
