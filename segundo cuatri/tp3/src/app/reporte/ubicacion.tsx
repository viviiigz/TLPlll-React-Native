import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { actualizarBorrador } from '@/lib/reportesStore';

const SECTORES_EDIFICIO = [
  'Patio Central',
  'Estacionamiento de Docentes',
  'Pasillo Norte (Aulas 101 a 110)',
  'Pasillo Sur (Laboratorios de Informática)',
  'Aulario de Planta Alta',
  'Gimnasio y Polideportivo',
  'Comedor y Buffet',
  'Entrada Principal',
];

export default function PantallaMarcarUbicacion() {
  const router = useRouter();
  const [cargando, setCargando] = useState(false);
  const [mensajeError, setMensajeError] = useState<string | null>(null);

  // funcion para obtener la ubicacion en primer plano respetando la precision
  const obtenerUbicacionGPS = async () => {
    try {
      setCargando(true);
      setMensajeError(null);

      // pido unicamente ubicacion en primer plano
      const permiso = await Location.requestForegroundPermissionsAsync();

      if (!permiso.granted) {
        setMensajeError('Ubicación denegada. Podés seleccionar el sector del edificio de la lista.');
        return;
      }

      // verifico si la persona eligio ubicacion aproximada en android o ios
      const esAproximada =
        permiso.android?.accuracy === 'coarse' || permiso.ios?.accuracy === 'reduced';

      const posicion = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      if (esAproximada) {
        // segun el requisito g2.4: si es aproximada no muestro coordenadas exactas
        actualizarBorrador({
          ubicacion: {
            sector: 'Zona general del Edificio IPF (Ubicación aproximada)',
            aproximada: true,
          },
        });

        Alert.alert(
          'Ubicación Aproximada',
          'Se registró la zona general del predio escolar sin exponer coordenadas exactas.',
          [{ text: 'Aceptar', onPress: () => router.back() }]
        );
      } else {
        // si es precisa, guardo coordenadas y sector
        actualizarBorrador({
          ubicacion: {
            latitud: posicion.coords.latitude,
            longitud: posicion.coords.longitude,
            sector: `Coordenadas: ${posicion.coords.latitude.toFixed(4)}, ${posicion.coords.longitude.toFixed(4)}`,
            aproximada: false,
          },
        });

        Alert.alert(
          'Ubicación Precisa Registrada',
          'Se guardaron las coordenadas GPS exactas del desperfecto.',
          [{ text: 'Aceptar', onPress: () => router.back() }]
        );
      }
    } catch (err) {
      console.warn('error al obtener ubicacion:', err);
      setMensajeError('Ocurrió un error al consultar el GPS. Elegí el sector a mano.');
    } finally {
      setCargando(false);
    }
  };

  // alternativa manual garantizada: elegir un sector de la lista sin ningun permiso
  const elegirSectorManual = (sector: string) => {
    actualizarBorrador({
      ubicacion: {
        sector,
        aproximada: false,
      },
    });

    Alert.alert('Sector Registrado', `Se guardó el sector "${sector}".`, [
      { text: 'Aceptar', onPress: () => router.back() },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.titulo}>Ubicación del Desperfecto</Text>
          <Text style={styles.bajada}>
            Podés usar la ubicación en primer plano de tu celular o elegir manualmente el sector del edificio.
          </Text>
        </View>

        {/* boton para solicitar la ubicacion actual */}
        {cargando ? (
          <View style={styles.cargandoCaja}>
            <ActivityIndicator size="small" color="#0f766e" />
            <Text style={styles.cargandoTexto}>Obteniendo ubicación del dispositivo...</Text>
          </View>
        ) : (
          <Pressable style={styles.btnGPS} onPress={obtenerUbicacionGPS}>
            <FontAwesome name="location-arrow" size={18} color="#ffffff" />
            <Text style={styles.btnGPSTexto}>Usar mi ubicación actual</Text>
          </Pressable>
        )}

        {/* mensaje si el permiso fue denegado o fallo */}
        {mensajeError ? (
          <View style={styles.avisoError}>
            <FontAwesome name="exclamation-circle" size={14} color="#b91c1c" />
            <Text style={styles.avisoErrorTexto}>{mensajeError}</Text>
          </View>
        ) : null}

        {/* alternativa manual con sectores del edificio escolar */}
        <View style={styles.seccionManual}>
          <View style={styles.divisor}>
            <View style={styles.lineaDivisor} />
            <Text style={styles.textoDivisor}>O ELEGÍ EL SECTOR A MANO</Text>
            <View style={styles.lineaDivisor} />
          </View>

          <Text style={styles.subtituloManual}>
            Tocá el lugar exacto del Instituto donde está el problema:
          </Text>

          <View style={styles.listaSectores}>
            {SECTORES_EDIFICIO.map((sector) => (
              <Pressable
                key={sector}
                style={styles.itemSector}
                onPress={() => elegirSectorManual(sector)}>
                <FontAwesome name="map-marker" size={15} color="#0f766e" />
                <Text style={styles.itemSectorTexto}>{sector}</Text>
                <FontAwesome name="chevron-right" size={12} color="#cbd5e1" />
              </Pressable>
            ))}
          </View>
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
    padding: 20,
    gap: 16,
  },
  header: {
    gap: 4,
  },
  titulo: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
  },
  bajada: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
  },
  cargandoCaja: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cargandoTexto: {
    fontSize: 13,
    color: '#0f766e',
    fontWeight: '600',
  },
  btnGPS: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#0f766e',
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  btnGPSTexto: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  avisoError: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fef2f2',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  avisoErrorTexto: {
    flex: 1,
    fontSize: 12,
    color: '#b91c1c',
    lineHeight: 16,
  },
  seccionManual: {
    gap: 12,
    marginTop: 6,
  },
  divisor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 4,
  },
  lineaDivisor: {
    flex: 1,
    height: 1,
    backgroundColor: '#e2e8f0',
  },
  textoDivisor: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  subtituloManual: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '500',
  },
  listaSectores: {
    gap: 8,
  },
  itemSector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  itemSectorTexto: {
    flex: 1,
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '600',
  },
});

