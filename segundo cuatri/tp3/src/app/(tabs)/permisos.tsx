import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  Platform,
  SafeAreaView,
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { usePermiso, type EstadoPermiso, type TipoRecurso } from '@/hooks/usePermiso';

// componente para mostrar cada tarjeta de permiso en el panel
function TarjetaPermiso({
  recurso,
  titulo,
  icono,
  descripcion,
}: {
  recurso: TipoRecurso;
  titulo: string;
  icono: React.ComponentProps<typeof FontAwesome>['name'];
  descripcion: string;
}) {
  // utilizo mi hook unificado que escucha appstate al volver de ajustes
  const { estado, parcial, detalles, pedir, abrirAjustes, consultar } = usePermiso(recurso);

  // colores segun los estados definidos en la clase
  const colorPorEstado: Record<EstadoPermiso, { bg: string; texto: string; label: string }> = {
    cargando: { bg: '#f1f5f9', texto: '#64748b', label: 'CARGANDO...' },
    concedido: { bg: '#dcfce7', texto: '#15803d', label: 'CONCEDIDO' },
    preguntable: { bg: '#fef3c7', texto: '#b45309', label: 'PREGUNTABLE' },
    bloqueado: { bg: '#fee2e2', texto: '#b91c1c', label: 'BLOQUEADO' },
  };

  const badge = colorPorEstado[estado];

  // obtengo el matiz segun la plataforma
  let matizTexto = '';
  if (recurso === 'ubicacion') {
    if (parcial) {
      matizTexto = 'Matiz: Ubicación aproximada (precisión por zona)';
    } else if (estado === 'concedido') {
      matizTexto = 'Matiz: Ubicación precisa';
    }
  } else if (recurso === 'fotos') {
    if (parcial) {
      matizTexto = 'Matiz: Acceso limitado (solo fotos elegidas)';
    } else if (estado === 'concedido') {
      matizTexto = 'Matiz: Acceso total';
    }
  }

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.iconCircle}>
          <FontAwesome name={icono} size={18} color="#0f766e" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitulo}>{titulo}</Text>
          <Text style={styles.cardDesc}>{descripcion}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: badge.bg }]}>
          <Text style={[styles.badgeTexto, { color: badge.texto }]}>{badge.label}</Text>
        </View>
      </View>

      {/* si existe un matiz de precision o limitacion lo muestro claramente */}
      {matizTexto ? (
        <View style={styles.matizContainer}>
          <FontAwesome name="info-circle" size={13} color="#0284c7" />
          <Text style={styles.matizTexto}>{matizTexto}</Text>
        </View>
      ) : null}

      {/* botonera segun el estado del permiso */}
      <View style={styles.cardAcciones}>
        {estado === 'preguntable' && (
          <Pressable style={styles.btnPedir} onPress={() => pedir()}>
            <FontAwesome name="check-circle" size={14} color="#ffffff" />
            <Text style={styles.btnPedirTexto}>Solicitar Permiso</Text>
          </Pressable>
        )}

        {estado === 'bloqueado' && (
          <Pressable style={styles.btnAjustes} onPress={() => abrirAjustes()}>
            <FontAwesome name="cog" size={14} color="#ffffff" />
            <Text style={styles.btnAjustesTexto}>Abrir Ajustes</Text>
          </Pressable>
        )}

        {estado === 'concedido' && (
          <Pressable style={styles.btnConsultar} onPress={() => consultar()}>
            <FontAwesome name="refresh" size={12} color="#0f766e" />
            <Text style={styles.btnConsultarTexto}>Re-consultar</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

export default function PantallaPermisos() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* cabecera informativa con la plataforma actual */}
        <View style={styles.headerInfo}>
          <View>
            <Text style={styles.panelTitulo}>Panel de Permisos</Text>
            <Text style={styles.panelSub}>Diagnóstico en vivo del sistema operativo</Text>
          </View>
          <View style={styles.badgePlataforma}>
            <FontAwesome
              name={Platform.OS === 'android' ? 'android' : 'apple'}
              size={13}
              color="#0f172a"
              style={{ marginRight: 5 }}
            />
            <Text style={styles.plataformaTexto}>{Platform.OS.toUpperCase()}</Text>
          </View>
        </View>

        <View style={styles.avisoRegla}>
          <Text style={styles.avisoReglaTexto}>
            ● Este panel se actualiza automáticamente al volver de Ajustes gracias al hook unificado con AppState.
          </Text>
        </View>

        {/* lista de permisos utilizados por la aplicacion */}
        <TarjetaPermiso
          recurso="camara"
          titulo="Cámara"
          icono="camera"
          descripcion="Lectura de códigos QR del aula y fotos de desperfectos."
        />

        <TarjetaPermiso
          recurso="ubicacion"
          titulo="Ubicación en primer plano"
          icono="map-marker"
          descripcion="Geolocalización para marcar sectores del edificio."
        />

        <TarjetaPermiso
          recurso="notificaciones"
          titulo="Notificaciones"
          icono="bell"
          descripcion="Avisos en tiempo real cuando se resuelven reportes."
        />

        <TarjetaPermiso
          recurso="fotos"
          titulo="Galería / Selector"
          icono="photo"
          descripcion="Para adjuntar imágenes (usamos selector sin pedir permisos)."
        />
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
    gap: 12,
  },
  headerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  panelTitulo: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  panelSub: {
    fontSize: 12,
    color: '#64748b',
  },
  badgePlataforma: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  plataformaTexto: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
  },
  avisoRegla: {
    backgroundColor: '#f0fdf4',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bbf7d0',
    marginBottom: 6,
  },
  avisoReglaTexto: {
    fontSize: 12,
    color: '#166534',
    lineHeight: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    gap: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ccfbf1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitulo: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  cardDesc: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeTexto: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  matizContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f0f9ff',
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e0f2fe',
  },
  matizTexto: {
    fontSize: 12,
    color: '#0369a1',
    fontWeight: '500',
  },
  cardAcciones: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 10,
  },
  btnPedir: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#0f766e',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 6,
  },
  btnPedirTexto: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  btnAjustes: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#dc2626',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 6,
  },
  btnAjustesTexto: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  btnConsultar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#f0fdfa',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccfbf1',
  },
  btnConsultarTexto: {
    color: '#0f766e',
    fontSize: 11,
    fontWeight: '600',
  },
});

