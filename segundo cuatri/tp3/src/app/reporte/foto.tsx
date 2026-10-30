import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Image,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { actualizarBorrador, useBorradorReporte } from '@/lib/reportesStore';

export default function PantallaAdjuntarFoto() {
  const router = useRouter();
  const borrador = useBorradorReporte();
  const [cargando, setCargando] = useState(false);

  // funcion para sacar foto en el momento usando la camara
  const sacarFoto = async () => {
    try {
      setCargando(true);
      const resultado = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.8,
      });

      if (!resultado.canceled && resultado.assets && resultado.assets.length > 0) {
        actualizarBorrador({ fotoUri: resultado.assets[0].uri });
        Alert.alert('Foto capturada', 'La imagen fue adjuntada al reporte.', [
          { text: 'Aceptar', onPress: () => router.back() },
        ]);
      }
    } catch (err) {
      console.warn('error al abrir la camara:', err);
      Alert.alert(
        'No se pudo abrir la cámara',
        'Podés elegir una foto de la galería o continuar sin foto.'
      );
    } finally {
      setCargando(false);
    }
  };

  // aplico la receta 4 de la clase: uso el selector del sistema que NO pide permisos de galeria
  const elegirDeGaleria = async () => {
    try {
      setCargando(true);
      const resultado = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      });

      if (!resultado.canceled && resultado.assets && resultado.assets.length > 0) {
        actualizarBorrador({ fotoUri: resultado.assets[0].uri });
        Alert.alert('Foto seleccionada', 'La imagen fue adjuntada al reporte.', [
          { text: 'Aceptar', onPress: () => router.back() },
        ]);
      }
    } catch (err) {
      console.warn('error al abrir el selector de imagenes:', err);
      Alert.alert('Aviso', 'No se pudo seleccionar la imagen.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.titulo}>Foto del Desperfecto</Text>
          <Text style={styles.bajada}>
            Adjuntá una imagen para que el personal identifique rápidamente la gravedad del problema.
          </Text>
        </View>

        {/* si ya habia una foto en el borrador la muestro */}
        {borrador.fotoUri ? (
          <View style={styles.previewCaja}>
            <Image source={{ uri: borrador.fotoUri }} style={styles.preview} />
            <Text style={styles.previewTexto}>Foto actual adjunta</Text>
          </View>
        ) : null}

        {/* botones de seleccion */}
        {cargando ? (
          <ActivityIndicator size="large" color="#0f766e" style={{ marginVertical: 30 }} />
        ) : (
          <View style={styles.opciones}>
            {/* opcion 1: sacar foto con camara */}
            <Pressable style={styles.opcionCard} onPress={sacarFoto}>
              <View style={styles.iconoCaja}>
                <FontAwesome name="camera" size={22} color="#0f766e" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.opcionTitulo}>Sacar foto ahora</Text>
                <Text style={styles.opcionDesc}>
                  Abre la cámara para fotografiar el desperfecto en el aula.
                </Text>
              </View>
              <FontAwesome name="chevron-right" size={14} color="#94a3b8" />
            </Pressable>

            {/* opcion 2: selector del sistema (cero permisos de galeria) */}
            <Pressable style={styles.opcionCard} onPress={elegirDeGaleria}>
              <View style={[styles.iconoCaja, { backgroundColor: '#e0f2fe' }]}>
                <FontAwesome name="photo" size={20} color="#0284c7" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.opcionTitulo}>Elegir de la galería</Text>
                <Text style={styles.opcionDesc}>
                  Usa el selector nativo del sistema sin requerir permisos sobre tus fotos privadas.
                </Text>
              </View>
              <FontAwesome name="chevron-right" size={14} color="#94a3b8" />
            </Pressable>
          </View>
        )}

        {/* aviso didactico de privacidad */}
        <View style={styles.avisoPrivacidad}>
          <FontAwesome name="shield" size={16} color="#15803d" />
          <Text style={styles.avisoPrivacidadTexto}>
            <strong>Privacidad garantizada:</strong> El selector corre fuera de la app y solo entrega la foto que vos elijas. La app nunca lee tu galería completa.
          </Text>
        </View>

        {/* boton para continuar sin foto si la persona no quiere */}
        <Pressable style={styles.btnVolver} onPress={() => router.back()}>
          <Text style={styles.btnVolverTexto}>Continuar sin adjuntar foto</Text>
        </Pressable>
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
  previewCaja: {
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 8,
  },
  preview: {
    width: 140,
    height: 140,
    borderRadius: 8,
  },
  previewTexto: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  opciones: {
    gap: 12,
  },
  opcionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
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
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ccfbf1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  opcionTitulo: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  opcionDesc: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
    lineHeight: 16,
  },
  avisoPrivacidad: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#f0fdf4',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  avisoPrivacidadTexto: {
    flex: 1,
    fontSize: 12,
    color: '#166534',
    lineHeight: 16,
  },
  btnVolver: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  btnVolverTexto: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '600',
  },
});

