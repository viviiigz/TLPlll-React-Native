import { useEffect, useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { EstadoPantalla } from '../../components/EstadoPantalla';
import {
  ESPACIADO,
  TAMANIOS,
  type PaletaColores,
} from '../../constants/tema';
import { usePermiso } from '../../hooks/usePermiso';
import { useTema } from '../../hooks/useTema';
import type { RecursoPermiso } from '../../types';

const CONFIG_RECURSO: Record<
  RecursoPermiso,
  {
    titulo: string;
    icono: 'camera-outline' | 'notifications-outline';
    beneficio: string;
    beneficioBloqueado: string;
  }
> = {
  camara: {
    titulo: 'Permiso de cámara',
    icono: 'camera-outline',
    beneficio:
      'Usamos tu cámara para leer el código de barras de los libros y abrir su ficha al instante.',
    beneficioBloqueado:
      'El acceso a la cámara está bloqueado en el sistema. Habilitalo desde Ajustes para escanear códigos de barras.',
  },
  notificaciones: {
    titulo: 'Permiso de notificaciones',
    icono: 'notifications-outline',
    beneficio:
      'Usamos tus notificaciones para recordarte cuándo devolver un libro y avisarte cuando tu reserva esté lista.',
    beneficioBloqueado:
      'Las notificaciones están bloqueadas en el sistema. Habilitalas desde Ajustes para recibir recordatorios.',
  },
};

function crearEstilos(colores: PaletaColores) {
  return StyleSheet.create({
    contenedor: {
      flex: 1,
      backgroundColor: colores.fondo,
      justifyContent: 'center',
      padding: ESPACIADO.xl,
    },
    tarjeta: {
      backgroundColor: colores.superficie,
      borderRadius: TAMANIOS.radioLg,
      borderWidth: 1,
      borderColor: colores.borde,
      padding: ESPACIADO.xl,
      alignItems: 'center',
      gap: ESPACIADO.lg,
    },
    titulo: {
      fontSize: TAMANIOS.textoXl,
      fontWeight: '700',
      color: colores.texto,
      textAlign: 'center',
    },
    frase: {
      fontSize: TAMANIOS.textoMd,
      color: colores.textoSecundario,
      textAlign: 'center',
      lineHeight: 23,
    },
    boton: {
      width: '100%',
      minHeight: TAMANIOS.areaTactilMinima,
      borderRadius: TAMANIOS.radioMd,
      backgroundColor: colores.primario,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: ESPACIADO.lg,
      paddingVertical: ESPACIADO.md,
    },
    textoBoton: {
      fontSize: TAMANIOS.textoMd,
      fontWeight: '700',
      color: colores.primarioTexto,
    },
  });
}

function esRecursoValido(valor: string): valor is RecursoPermiso {
  return valor === 'camara' || valor === 'notificaciones';
}

export default function PermisoPrevioPantalla() {
  const colores = useTema();
  const styles = useMemo(() => crearEstilos(colores), [colores]);
  const params = useLocalSearchParams<{ recurso?: string | string[] }>();
  const recursoCrudo = Array.isArray(params.recurso)
    ? params.recurso[0] ?? ''
    : params.recurso ?? '';

  const recursoValido = esRecursoValido(recursoCrudo);
  const recursoSeguro: RecursoPermiso = recursoValido ? recursoCrudo : 'camara';
  const { estado, pedir, abrirAjustes } = usePermiso(recursoSeguro);

  useEffect(() => {
    if (recursoValido && estado === 'concedido') {
      router.dismiss();
    }
  }, [recursoValido, estado]);

  if (!recursoValido) {
    return (
      <EstadoPantalla
        tipo="error"
        mensaje="El recurso de permiso solicitado no es válido."
        textoAccion="Cerrar"
        onAccion={() => router.dismiss()}
      />
    );
  }

  if (estado === 'cargando') {
    return (
      <EstadoPantalla
        tipo="cargando"
        mensaje="Consultando estado del permiso..."
      />
    );
  }

  const info = CONFIG_RECURSO[recursoSeguro];
  const estaBloqueado = estado === 'bloqueado';
  const textoBoton = estaBloqueado ? 'Abrir Ajustes' : 'Continuar';

  async function manejarAccion(): Promise<void> {
    if (estaBloqueado) {
      await abrirAjustes();
      return;
    }
    await pedir();
    router.dismiss();
  }

  return (
    <View style={styles.contenedor}>
      <View style={styles.tarjeta}>
        <Ionicons name={info.icono} size={56} color={colores.primario} />
        <Text style={styles.titulo}>{info.titulo}</Text>
        <Text style={styles.frase}>
          {estaBloqueado ? info.beneficioBloqueado : info.beneficio}
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={textoBoton}
          style={styles.boton}
          onPress={() => {
            void manejarAccion();
          }}
        >
          <Text style={styles.textoBoton}>{textoBoton}</Text>
        </Pressable>
      </View>
    </View>
  );
}
