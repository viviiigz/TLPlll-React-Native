import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {
  useReportes,
  simularResolucionReporte,
  type EstadoReporte,
} from '@/lib/reportesStore';

export default function PantallaDetalleReporte() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  // escucho la lista de reportes para ver el cambio de estado en vivo
  const reportes = useReportes();

  // valido que el id exista en los reportes
  const reporte = reportes.find((r) => r.id === id);

  if (!reporte) {
    return (
      <SafeAreaView style={styles.centrado}>
        <FontAwesome name="exclamation-triangle" size={48} color="#dc2626" />
        <Text style={styles.errorTitulo}>Reporte no encontrado</Text>
        <Text style={styles.errorDesc}>
          El reporte con identificador "{id}" no existe o fue eliminado.
        </Text>
        <Pressable style={styles.btnVolver} onPress={() => router.replace('/' as any)}>
          <Text style={styles.btnVolverTexto}>Volver a la lista</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const obtenerColorEstado = (estado: EstadoReporte) => {
    switch (estado) {
      case 'pendiente':
        return '#d97706';
      case 'en curso':
        return '#2563eb';
      case 'resuelto':
        return '#16a34a';
    }
  };

  const colorEstado = obtenerColorEstado(reporte.estado);

  // funcion que dispara la simulacion de resolucion y programa la notificacion local
  const ejecutarSimulacion = async () => {
    await simularResolucionReporte(reporte.id);
    Alert.alert(
      'Resolución Simulada',
      'El reporte pasó a RESUELTO. Si las notificaciones están concedidas, te llegará una alerta en 10 segundos. Si están denegadas, podés revisar la pestaña Avisos.',
      [{ text: 'Entendido' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* tarjeta de cabecera */}
        <View style={styles.cardHeader}>
          <View style={styles.filaTitulo}>
            <Text style={styles.titulo}>{reporte.titulo}</Text>
            <View style={[styles.badge, { backgroundColor: colorEstado }]}>
              <Text style={styles.badgeTexto}>{reporte.estado.toUpperCase()}</Text>
            </View>
          </View>
          <Text style={styles.fecha}>Registrado: {reporte.fecha}</Text>
        </View>

        {/* datos principales */}
        <View style={styles.cardDatos}>
          <View style={styles.datoFila}>
            <FontAwesome name="map-marker" size={16} color="#0f766e" style={{ width: 22 }} />
            <Text style={styles.datoLabel}>Aula / Espacio:</Text>
            <Text style={styles.datoValor}>{reporte.aula}</Text>
          </View>

          <View style={styles.datoFila}>
            <FontAwesome name="tag" size={14} color="#0f766e" style={{ width: 22 }} />
            <Text style={styles.datoLabel}>Categoría:</Text>
            <Text style={styles.datoValor}>{reporte.categoria.toUpperCase()}</Text>
          </View>

          {reporte.ubicacion?.sector ? (
            <View style={styles.datoFila}>
              <FontAwesome name="compass" size={15} color="#0f766e" style={{ width: 22 }} />
              <Text style={styles.datoLabel}>Sector:</Text>
              <Text style={styles.datoValor}>{reporte.ubicacion.sector}</Text>
            </View>
          ) : null}
        </View>

        {/* descripcion */}
        <View style={styles.cardSeccion}>
          <Text style={styles.seccionTitulo}>Descripción del desperfecto</Text>
          <Text style={styles.descripcionTexto}>{reporte.descripcion}</Text>
        </View>

        {/* foto adjunta si tiene */}
        {reporte.fotoUri ? (
          <View style={styles.cardSeccion}>
            <Text style={styles.seccionTitulo}>Fotografía adjunta</Text>
            <Image source={{ uri: reporte.fotoUri }} style={styles.foto} resizeMode="cover" />
          </View>
        ) : null}

        {/* boton de prueba: simular resolucion */}
        <View style={styles.cardAccionPrueba}>
          <View style={styles.accionHeader}>
            <FontAwesome name="flask" size={18} color="#0f766e" />
            <Text style={styles.accionTitulo}>Prueba de resolución y notificaciones</Text>
          </View>
          <Text style={styles.accionDesc}>
            Al tocar este botón el reporte pasa a "RESUELTO". Dispara una notificación local a los 10 segundos (o guarda el aviso en /avisos si las notificaciones están denegadas).
          </Text>

          <Pressable
            style={[
              styles.btnSimular,
              reporte.estado === 'resuelto' && styles.btnSimularDesactivado,
            ]}
            onPress={ejecutarSimulacion}>
            <FontAwesome name="check-circle" size={16} color="#ffffff" style={{ marginRight: 8 }} />
            <Text style={styles.btnSimularTexto}>
              {reporte.estado === 'resuelto' ? 'Volver a simular resolución' : 'Simular resolución'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scroll: {
    padding: 16,
    gap: 14,
  },
  centrado: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  errorTitulo: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  errorDesc: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    maxWidth: 280,
  },
  btnVolver: {
    backgroundColor: '#0f766e',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  btnVolverTexto: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
  cardHeader: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 6,
  },
  filaTitulo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10,
  },
  titulo: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    flex: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeTexto: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  fecha: {
    fontSize: 12,
    color: '#94a3b8',
  },
  cardDatos: {
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 10,
  },
  datoFila: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  datoLabel: {
    fontSize: 13,
    color: '#64748b',
    width: 110,
  },
  datoValor: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
    flex: 1,
  },
  cardSeccion: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 8,
  },
  seccionTitulo: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  descripcionTexto: {
    fontSize: 14,
    color: '#1e293b',
    lineHeight: 20,
  },
  foto: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 4,
  },
  cardAccionPrueba: {
    backgroundColor: '#f0fdfa',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccfbf1',
    gap: 10,
    marginTop: 6,
  },
  accionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  accionTitulo: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f766e',
  },
  accionDesc: {
    fontSize: 12,
    color: '#134e4a',
    lineHeight: 17,
  },
  btnSimular: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f766e',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 4,
  },
  btnSimularDesactivado: {
    backgroundColor: '#0d9488',
  },
  btnSimularTexto: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
});

