import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  SafeAreaView,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useAvisos, type Aviso } from '@/lib/reportesStore';

export default function PantallaAvisos() {
  const router = useRouter();
  // obtengo los avisos de mi bandeja interna, que sirve como alternativa si las notificaciones estan apagadas
  const avisos = useAvisos();

  const renderAviso = ({ item }: { item: Aviso }) => (
    <Pressable
      style={styles.card}
      onPress={() => {
        // si el aviso esta asociado a un reporte, permito tocarlo para ver el reporte
        if (item.reporteId) {
          router.push(`/reporte/${item.reporteId}` as any);
        }
      }}>
      <View style={styles.cardHeader}>
        <View style={styles.iconoCaja}>
          <FontAwesome name="bell" size={16} color="#0f766e" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitulo}>{item.titulo}</Text>
          <Text style={styles.cardFecha}>{item.fecha}</Text>
        </View>
      </View>
      <Text style={styles.cardMensaje}>{item.mensaje}</Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* aviso explicativo sobre la degradacion elegante */}
      <View style={styles.bannerInfo}>
        <FontAwesome name="info-circle" size={16} color="#0369a1" />
        <Text style={styles.bannerTexto}>
          Esta bandeja recibe las novedades de tus reportes aunque no tengas las notificaciones push o del sistema habilitadas.
        </Text>
      </View>

      <FlatList
        data={avisos}
        keyExtractor={(item) => item.id}
        renderItem={renderAviso}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={
          <View style={styles.vacio}>
            <FontAwesome name="bell-slash-o" size={44} color="#94a3b8" />
            <Text style={styles.vacioTitulo}>Bandeja de avisos vacía</Text>
            <Text style={styles.vacioTexto}>
              Cuando un desperfecto reportado se resuelva o cambie de estado, lo vas a ver acá.
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
  bannerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#e0f2fe',
    margin: 16,
    marginBottom: 8,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  bannerTexto: {
    flex: 1,
    fontSize: 12,
    color: '#0369a1',
    lineHeight: 16,
  },
  lista: {
    padding: 16,
    paddingTop: 8,
    gap: 10,
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
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  iconoCaja: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ccfbf1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitulo: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  cardFecha: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 1,
  },
  cardMensaje: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 18,
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
