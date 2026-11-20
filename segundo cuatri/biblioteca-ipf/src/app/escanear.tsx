import { useCallback, useMemo, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { CameraView, type BarcodeScanningResult } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { EstadoPantalla } from '../components/EstadoPantalla';
import {
  ESPACIADO,
  TAMANIOS,
  type PaletaColores,
} from '../constants/tema';
import { LIBROS } from '../data/libros';
import { usePermiso } from '../hooks/usePermiso';
import { useTema } from '../hooks/useTema';
import { esIsbnValido, normalizarIsbn } from '../lib/validaciones';

function crearEstilos(colores: PaletaColores) {
  return StyleSheet.create({
    pantalla: {
      flex: 1,
      backgroundColor: colores.fondo,
    },
    contenido: {
      padding: ESPACIADO.lg,
      gap: ESPACIADO.lg,
      flexGrow: 1,
    },
    cajaCamara: {
      height: 300,
      borderRadius: TAMANIOS.radioLg,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colores.borde,
      backgroundColor: colores.superficie,
    },
    camara: {
      flex: 1,
    },
    marcoGuia: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center',
      padding: ESPACIADO.lg,
    },
    recuadroEscaneo: {
      width: 240,
      height: 120,
      borderWidth: 2,
      borderColor: colores.primarioTexto,
      borderRadius: TAMANIOS.radioMd,
      backgroundColor: 'transparent',
    },
    etiquetaGuia: {
      marginTop: ESPACIADO.md,
      backgroundColor: colores.superposicion,
      color: colores.primarioTexto,
      fontSize: TAMANIOS.textoSm,
      paddingHorizontal: ESPACIADO.md,
      paddingVertical: ESPACIADO.xs,
      borderRadius: TAMANIOS.radioSm,
      overflow: 'hidden',
    },
    tarjetaEstado: {
      backgroundColor: colores.superficie,
      borderRadius: TAMANIOS.radioLg,
      borderWidth: 1,
      borderColor: colores.borde,
      padding: ESPACIADO.xl,
      alignItems: 'center',
      gap: ESPACIADO.md,
    },
    tituloCard: {
      fontSize: TAMANIOS.textoLg,
      fontWeight: '700',
      color: colores.texto,
      textAlign: 'center',
    },
    textoSecundario: {
      fontSize: TAMANIOS.textoSm,
      color: colores.textoSecundario,
      textAlign: 'center',
      lineHeight: 20,
    },
    avisoNoEncontrado: {
      backgroundColor: colores.alertaFondo,
      borderRadius: TAMANIOS.radioMd,
      padding: ESPACIADO.lg,
      gap: ESPACIADO.md,
    },
    textoAviso: {
      fontSize: TAMANIOS.textoSm,
      color: colores.alerta,
      fontWeight: '600',
      lineHeight: 20,
    },
    tarjetaManual: {
      backgroundColor: colores.superficie,
      borderRadius: TAMANIOS.radioLg,
      borderWidth: 1,
      borderColor: colores.borde,
      padding: ESPACIADO.lg,
      gap: ESPACIADO.md,
    },
    input: {
      minHeight: TAMANIOS.areaTactilMinima,
      borderRadius: TAMANIOS.radioMd,
      borderWidth: 1,
      borderColor: colores.borde,
      backgroundColor: colores.superficieSecundaria,
      paddingHorizontal: ESPACIADO.md,
      fontSize: TAMANIOS.textoMd,
      color: colores.texto,
    },
    errorManual: {
      fontSize: TAMANIOS.textoSm,
      color: colores.error,
      fontWeight: '600',
    },
    botonPrimario: {
      minHeight: TAMANIOS.areaTactilMinima,
      borderRadius: TAMANIOS.radioMd,
      backgroundColor: colores.primario,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: ESPACIADO.lg,
      paddingVertical: ESPACIADO.md,
      width: '100%',
    },
    textoBotonPrimario: {
      fontSize: TAMANIOS.textoMd,
      fontWeight: '700',
      color: colores.primarioTexto,
    },
  });
}

export default function EscanearPantalla() {
  const colores = useTema();
  const styles = useMemo(() => crearEstilos(colores), [colores]);
  const { estado, abrirAjustes, revisar } = usePermiso('camara');

  const bloqueadoRef = useRef<boolean>(false);
  const [isbnNoEncontrado, setIsbnNoEncontrado] = useState<string | null>(null);
  const [isbnManual, setIsbnManual] = useState<string>('');
  const [errorManual, setErrorManual] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      bloqueadoRef.current = false;
      void revisar();
    }, [revisar]),
  );

  function manejarCodigoEscaneado(resultado: BarcodeScanningResult): void {
    if (bloqueadoRef.current) {
      return;
    }

    const codigo = normalizarIsbn(resultado.data);
    bloqueadoRef.current = true;

    const existe = LIBROS.some((libro) => libro.isbn === codigo);
    if (!existe) {
      setIsbnNoEncontrado(codigo);
      return;
    }

    router.replace({
      pathname: '/libro/[isbn]',
      params: { isbn: codigo },
    });
  }

  function seguirEscaneando(): void {
    setIsbnNoEncontrado(null);
    bloqueadoRef.current = false;
  }

  function abrirIsbnManual(): void {
    const limpio = normalizarIsbn(isbnManual);
    if (!esIsbnValido(limpio)) {
      setErrorManual('Ingresá un ISBN válido de exactamente 13 dígitos.');
      return;
    }
    setErrorManual(null);
    router.replace({
      pathname: '/libro/[isbn]',
      params: { isbn: limpio },
    });
  }

  return (
    <KeyboardAvoidingView
      style={styles.pantalla}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.contenido}>
        {estado === 'cargando' ? (
          <View style={styles.cajaCamara}>
            <EstadoPantalla
              tipo="cargando"
              mensaje="Verificando permiso de cámara..."
            />
          </View>
        ) : estado === 'concedido' ? (
          <>
            <View style={styles.cajaCamara}>
              <CameraView
                style={styles.camara}
                facing="back"
                barcodeScannerSettings={{ barcodeTypes: ['ean13'] }}
                onBarcodeScanned={
                  isbnNoEncontrado ? undefined : manejarCodigoEscaneado
                }
              />
              <View style={styles.marcoGuia} pointerEvents="none">
                <View style={styles.recuadroEscaneo} />
                <Text style={styles.etiquetaGuia}>
                  Apuntá al código de barras EAN-13 del libro
                </Text>
              </View>
            </View>

            {isbnNoEncontrado ? (
              <View style={styles.avisoNoEncontrado}>
                <Text style={styles.textoAviso}>
                  El ISBN {isbnNoEncontrado} no figura en el catálogo de
                  Biblioteca IPF.
                </Text>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Seguir escaneando"
                  style={styles.botonPrimario}
                  onPress={seguirEscaneando}
                >
                  <Text style={styles.textoBotonPrimario}>
                    Seguir escaneando
                  </Text>
                </Pressable>
              </View>
            ) : null}
          </>
        ) : estado === 'preguntable' ? (
          <View style={styles.tarjetaEstado}>
            <Ionicons
              name="camera-outline"
              size={48}
              color={colores.primario}
            />
            <Text style={styles.tituloCard}>Escaneá el código del libro</Text>
            <Text style={styles.textoSecundario}>
              Necesitamos tu permiso de cámara para leer códigos de barras
              EAN-13. Antes del diálogo del sistema te explicamos para qué se
              usa.
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Habilitar cámara"
              style={styles.botonPrimario}
              onPress={() =>
                router.push({
                  pathname: '/permisos/[recurso]',
                  params: { recurso: 'camara' },
                })
              }
            >
              <Text style={styles.textoBotonPrimario}>Habilitar cámara</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.tarjetaEstado}>
            <Ionicons
              name="lock-closed-outline"
              size={48}
              color={colores.error}
            />
            <Text style={styles.tituloCard}>Cámara bloqueada</Text>
            <Text style={styles.textoSecundario}>
              El permiso de cámara está bloqueado en tu teléfono. Podés
              habilitarlo en Ajustes o escribir el ISBN manualmente abajo.
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Abrir Ajustes del sistema"
              style={styles.botonPrimario}
              onPress={() => {
                void abrirAjustes();
              }}
            >
              <Text style={styles.textoBotonPrimario}>Abrir Ajustes</Text>
            </Pressable>
          </View>
        )}

        <View style={styles.tarjetaManual}>
          <Text style={styles.tituloCard}>Ingresar ISBN a mano</Text>
          <Text style={styles.textoSecundario}>
            Si preferís no usar la cámara, escribí los 13 dígitos del libro (por
            ejemplo: 9789875666481).
          </Text>
          <TextInput
            style={styles.input}
            value={isbnManual}
            onChangeText={(texto) => {
              setIsbnManual(texto);
              if (errorManual) {
                setErrorManual(null);
              }
            }}
            placeholder="9789875666481"
            placeholderTextColor={colores.textoSecundario}
            keyboardType="number-pad"
            maxLength={17}
            accessibilityLabel="Ingresar ISBN de 13 dígitos"
          />
          {errorManual ? (
            <Text style={styles.errorManual}>{errorManual}</Text>
          ) : null}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Abrir libro por ISBN"
            style={styles.botonPrimario}
            onPress={abrirIsbnManual}
          >
            <Text style={styles.textoBotonPrimario}>Buscar libro por ISBN</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
