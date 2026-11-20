import { useMemo, useState } from 'react';
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
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  CREDENCIALES_PERSONAL,
  ESPACIADO,
  TAMANIOS,
  type PaletaColores,
} from '../constants/tema';
import { useBiblioteca } from '../context/BibliotecaContext';
import { useTema } from '../hooks/useTema';

function crearEstilos(colores: PaletaColores) {
  return StyleSheet.create({
    pantalla: {
      flex: 1,
      backgroundColor: colores.fondo,
    },
    contenido: {
      flexGrow: 1,
      justifyContent: 'center',
      padding: ESPACIADO.xl,
    },
    tarjeta: {
      backgroundColor: colores.superficie,
      borderRadius: TAMANIOS.radioLg,
      borderWidth: 1,
      borderColor: colores.borde,
      padding: ESPACIADO.xl,
      gap: ESPACIADO.md,
    },
    encabezado: {
      alignItems: 'center',
      gap: ESPACIADO.xs,
      marginBottom: ESPACIADO.sm,
    },
    titulo: {
      fontSize: TAMANIOS.textoXl,
      fontWeight: '700',
      color: colores.texto,
      textAlign: 'center',
    },
    subtitulo: {
      fontSize: TAMANIOS.textoSm,
      color: colores.textoSecundario,
      textAlign: 'center',
    },
    etiqueta: {
      fontSize: TAMANIOS.textoSm,
      fontWeight: '600',
      color: colores.texto,
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
    cajaError: {
      backgroundColor: colores.errorFondo,
      borderRadius: TAMANIOS.radioMd,
      padding: ESPACIADO.md,
    },
    textoError: {
      fontSize: TAMANIOS.textoSm,
      color: colores.error,
      fontWeight: '600',
    },
    ayudaDemo: {
      backgroundColor: colores.superficieSecundaria,
      borderRadius: TAMANIOS.radioMd,
      padding: ESPACIADO.md,
    },
    textoAyuda: {
      fontSize: TAMANIOS.textoXs,
      color: colores.textoSecundario,
      textAlign: 'center',
    },
    botonPrimario: {
      minHeight: TAMANIOS.areaTactilMinima,
      borderRadius: TAMANIOS.radioMd,
      backgroundColor: colores.primario,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: ESPACIADO.lg,
      marginTop: ESPACIADO.xs,
    },
    textoPrimario: {
      fontSize: TAMANIOS.textoMd,
      fontWeight: '700',
      color: colores.primarioTexto,
    },
    botonSecundario: {
      minHeight: TAMANIOS.areaTactilMinima,
      borderRadius: TAMANIOS.radioMd,
      borderWidth: 1,
      borderColor: colores.borde,
      backgroundColor: colores.superficie,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: ESPACIADO.lg,
    },
    textoSecundario: {
      fontSize: TAMANIOS.textoMd,
      fontWeight: '600',
      color: colores.texto,
    },
  });
}

export default function LoginPantalla() {
  const colores = useTema();
  const styles = useMemo(() => crearEstilos(colores), [colores]);
  const { iniciarSesion } = useBiblioteca();

  const [usuario, setUsuario] = useState<string>('');
  const [clave, setClave] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  function manejarIngreso(): void {
    const ok = iniciarSesion(usuario, clave);
    if (!ok) {
      setError('Usuario o clave incorrectos. Revisá los datos e intentá nuevamente.');
      return;
    }
    setError(null);
  }

  return (
    <KeyboardAvoidingView
      style={styles.pantalla}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.contenido}>
        <View style={styles.tarjeta}>
          <View style={styles.encabezado}>
            <Ionicons
              name="shield-checkmark-outline"
              size={48}
              color={colores.primario}
            />
            <Text style={styles.titulo}>Personal de Biblioteca</Text>
            <Text style={styles.subtitulo}>
              Iniciá sesión para gestionar el mostrador y las listas de espera.
            </Text>
          </View>

          <Text style={styles.etiqueta}>Usuario</Text>
          <TextInput
            style={styles.input}
            value={usuario}
            onChangeText={(texto) => {
              setUsuario(texto);
              if (error) {
                setError(null);
              }
            }}
            placeholder="bibliotecario"
            placeholderTextColor={colores.textoSecundario}
            autoCapitalize="none"
            autoCorrect={false}
            accessibilityLabel="Usuario del personal"
          />

          <Text style={styles.etiqueta}>Clave</Text>
          <TextInput
            style={styles.input}
            value={clave}
            onChangeText={(texto) => {
              setClave(texto);
              if (error) {
                setError(null);
              }
            }}
            placeholder="Ingresá tu clave"
            placeholderTextColor={colores.textoSecundario}
            secureTextEntry
            accessibilityLabel="Clave del personal"
          />

          {error ? (
            <View style={styles.cajaError}>
              <Text style={styles.textoError}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.ayudaDemo}>
            <Text style={styles.textoAyuda}>
              {`Acceso demo: usuario "${CREDENCIALES_PERSONAL.usuario}" · clave "${CREDENCIALES_PERSONAL.clave}"`}
            </Text>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Ingresar como personal"
            style={styles.botonPrimario}
            onPress={manejarIngreso}
          >
            <Text style={styles.textoPrimario}>Ingresar</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Cancelar inicio de sesión"
            style={styles.botonSecundario}
            onPress={() => router.dismiss()}
          >
            <Text style={styles.textoSecundario}>Cancelar</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
