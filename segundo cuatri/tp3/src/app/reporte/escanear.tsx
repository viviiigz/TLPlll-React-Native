import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  TextInput,
  ActivityIndicator,
  Linking,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { actualizarBorrador } from '@/lib/reportesStore';
import { useRevisarAlVolver } from '@/hooks/useRevisarAlVolver';

export default function PantallaEscanearQR() {
  const router = useRouter();
  // utilizo el hook de camara de expo
  const [permiso, pedirPermiso, consultarPermiso] = useCameraPermissions();
  // estado para la alternativa manual si no hay camara o no se puede escanear
  const [codigoManual, setCodigoManual] = useState('');
  const [escaneado, setEscaneado] = useState(false);

  // escucho si el usuario vuelve de ajustes para actualizar el permiso de inmediato
  useRevisarAlVolver(consultarPermiso);

  // funcion que procesa el aula encontrada (ya sea por qr o escrita a mano)
  const aplicarAula = (aulaDetectada: string) => {
    actualizarBorrador({ aula: aulaDetectada.trim() });
    Alert.alert('Aula asignada', `Se completó el campo con "${aulaDetectada}".`, [
      { text: 'Aceptar', onPress: () => router.back() },
    ]);
  };

  // 1. estado cargando: el hook todavia esta consultando al sistema operativo
  if (!permiso) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color="#0f766e" />
        <Text style={styles.textoCargando}>Consultando acceso a la cámara...</Text>
      </View>
    );
  }

  // 2. estado concedido: muestro el visor de la camara escaneando el qr
  if (permiso.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.camaraWrapper}>
          <CameraView
            style={StyleSheet.absoluteFill}
            facing="back"
            barcodeScannerSettings={{
              barcodeTypes: ['qr'],
            }}
            onBarcodeScanned={(resultado) => {
              if (escaneado) return;
              setEscaneado(true);
              const data = resultado.data || 'Aula sin identificar';
              aplicarAula(data);
            }}
          />

          {/* recuadro visual de escaneo */}
          <View style={styles.marcoGuia}>
            <View style={styles.cuadroEscaneo} />
            <Text style={styles.textoGuia}>
              Apuntá al código QR pegado en la puerta del aula
            </Text>
          </View>
        </View>

        {/* alternativa siempre disponible para escribir el codigo a mano */}
        <View style={styles.panelInferior}>
          <Text style={styles.alternativaTitulo}>¿Tenés problemas para escanear?</Text>
          <View style={styles.filaManual}>
            <TextInput
              style={styles.inputManual}
              placeholder="Escribí el aula (ej: Aula 104)"
              placeholderTextColor="#94a3b8"
              value={codigoManual}
              onChangeText={setCodigoManual}
            />
            <Pressable
              style={styles.btnManual}
              onPress={() => {
                if (codigoManual.trim()) aplicarAula(codigoManual);
              }}>
              <Text style={styles.btnManualTexto}>Usar</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // 3. estado preguntable: la persona todavia no decidio o rechazo una sola vez
  if (permiso.canAskAgain) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.contenidoEstado}>
          <View style={styles.iconCircle}>
            <FontAwesome name="camera" size={36} color="#0f766e" />
          </View>
          <Text style={styles.tituloEstado}>Escanear con la Cámara</Text>
          <Text style={styles.descEstado}>
            Usamos tu cámara para leer el código QR de la puerta del aula y completar el campo automáticamente sin que tengas que tipear.
          </Text>

          {/* boton continuar que dispara el dialogo oficial del sistema */}
          <Pressable style={styles.btnContinuar} onPress={() => pedirPermiso()}>
            <Text style={styles.btnContinuarTexto}>Continuar</Text>
          </Pressable>

          {/* alternativa manual si el usuario prefiere no usar la camara */}
          <View style={styles.cajaAlternativa}>
            <Text style={styles.alternativaLabel}>O escribí el aula a mano:</Text>
            <View style={styles.filaManual}>
              <TextInput
                style={styles.inputManual}
                placeholder="Ej: Aula Magna, Taller 2..."
                placeholderTextColor="#94a3b8"
                value={codigoManual}
                onChangeText={setCodigoManual}
              />
              <Pressable
                style={styles.btnManual}
                onPress={() => {
                  if (codigoManual.trim()) aplicarAula(codigoManual);
                }}>
                <Text style={styles.btnManualTexto}>Listo</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // 4. estado bloqueado: el permiso fue denegado y ya no muestra dialogo
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contenidoEstado}>
        <View style={[styles.iconCircle, { backgroundColor: '#fee2e2' }]}>
          <FontAwesome name="ban" size={36} color="#dc2626" />
        </View>
        <Text style={styles.tituloEstado}>Cámara Desactivada</Text>
        <Text style={styles.descEstado}>
          El acceso a la cámara está bloqueado para esta aplicación. Podés activarlo desde los Ajustes del sistema o continuar ingresando el aula a mano.
        </Text>

        <Pressable
          style={styles.btnAjustes}
          onPress={() => Linking.openSettings()}>
          <FontAwesome name="cog" size={16} color="#ffffff" style={{ marginRight: 6 }} />
          <Text style={styles.btnAjustesTexto}>Abrir Ajustes</Text>
        </Pressable>

        {/* alternativa manual que garantiza que la app nunca se bloquee */}
        <View style={styles.cajaAlternativa}>
          <Text style={styles.alternativaLabel}>Alternativa sin cámara:</Text>
          <View style={styles.filaManual}>
            <TextInput
              style={styles.inputManual}
              placeholder="Ingresá el aula o sector..."
              placeholderTextColor="#94a3b8"
              value={codigoManual}
              onChangeText={setCodigoManual}
            />
            <Pressable
              style={styles.btnManual}
              onPress={() => {
                if (codigoManual.trim()) aplicarAula(codigoManual);
              }}>
              <Text style={styles.btnManualTexto}>Aceptar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  centrado: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f8fafc',
    gap: 12,
  },
  textoCargando: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  camaraWrapper: {
    flex: 1,
  },
  marcoGuia: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  cuadroEscaneo: {
    width: 240,
    height: 240,
    borderWidth: 2,
    borderColor: '#2dd4bf',
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  textoGuia: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  panelInferior: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    gap: 10,
  },
  alternativaTitulo: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  filaManual: {
    flexDirection: 'row',
    gap: 8,
  },
  inputManual: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 14,
    color: '#0f172a',
  },
  btnManual: {
    backgroundColor: '#0f766e',
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnManualTexto: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 13,
  },
  contenidoEstado: {
    flex: 1,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 14,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#ccfbf1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  tituloEstado: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
    textAlign: 'center',
  },
  descEstado: {
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 320,
  },
  btnContinuar: {
    width: '100%',
    maxWidth: 280,
    backgroundColor: '#0f766e',
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  btnContinuarTexto: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  btnAjustes: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 280,
    backgroundColor: '#dc2626',
    paddingVertical: 13,
    borderRadius: 10,
    marginTop: 8,
  },
  btnAjustesTexto: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  cajaAlternativa: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginTop: 16,
    gap: 8,
  },
  alternativaLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
  },
});
