import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Pressable,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useReportes, type Reporte, type EstadoReporte } from '@/lib/reportesStore';

export default function PantallaReportes() {
  const router = useRouter();
  // obtengo los reportes desde mi store reactivo sin pedir ningun permiso al iniciar
  const reportes = useReportes();

  // funcion auxiliar para darle un color a cada estado
  const obtenerColorEstado = (estado: EstadoReporte) => {
    switch (estado) {
      case 'pendiente':
        return '#d97706'; // naranja de advertencia
      case 'en curso':
        return '#2563eb'; // azul de proceso
      case 'resuelto':
        return '#16a34a'; // verde de exito
    }
  };

  // renderizo cada tarjeta de reporte
  const renderItem = ({ item }: { item: Reporte }) => {
    const colorEstado = obtenerColorEstado(item.estado);

    return (
      <Pressable
        style={styles.card}
        onPress={() => {
          // navego al detalle del reporte pasando su id
          router.push(`/reporte/${item.id}` as any);
        }}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitulo}>{item.titulo}</Text>
          <View style={[styles.badgeEstado, { backgroundColor: colorEstado }]}>
            <Text style={styles.badgeTexto}>{item.estado.toUpperCase()}</Text>
          </View>
        </View>

        <Text style={styles.cardDesc} numberOfLines={2}>
          {item.descripcion}
        </Text>

        <View style={styles.cardFooter}>
          <View style={styles.metaItem}>
            <FontAwesome name="map-marker" size={14} color="#64748b" />
            <Text style={styles.metaTexto}>{item.aula}</Text>
          </View>
          <View style={styles.metaItem}>
            <FontAwesome name="tag" size={13} color="#64748b" />
            <Text style={styles.metaTexto}>{item.categoria}</Text>
          </View>
          <Text style={styles.fechaTexto}>{item.fecha}</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* cabecera con boton de accion principal */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.encabezado}>Mantenimiento IPF</Text>
          <Text style={styles.subtitulo}>Reportes de desperfectos en el edificio</Text>
        </View>
        <Pressable
          style={styles.btnNuevo}
          onPress={() => router.push('/reporte/nuevo' as any)}>
          <FontAwesome name="plus" size={14} color="#ffffff" style={{ marginRight: 6 }} />
          <Text style={styles.btnNuevoTexto}>Nuevo</Text>
        </Pressable>
      </View>

      {/* lista de reportes */}
      <FlatList
        data={reportes}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={
          <View style={styles.vacio}>
            <FontAwesome name="inbox" size={48} color="#94a3b8" />
            <Text style={styles.vacioTitulo}>No hay reportes cargados</Text>
            <Text style={styles.vacioTexto}>
              Tocá el botón "Nuevo" para reportar un desperfecto sin pedir permisos innecesarios.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  encabezado: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
  },
  subtitulo: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  btnNuevo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f766e',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 8,
  },
  btnNuevoTexto: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
  lista: {
    padding: 16,
    gap: 12,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 8,
  },
  cardTitulo: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    flex: 1,
  },
  badgeEstado: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeTexto: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  cardDesc: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 10,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaTexto: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  fechaTexto: {
    fontSize: 11,
    color: '#94a3b8',
    marginLeft: 'auto',
  },
  vacio: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
    gap: 10,
  },
  vacioTitulo: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
  },
  vacioTexto: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    maxWidth: 280,
  },
});
