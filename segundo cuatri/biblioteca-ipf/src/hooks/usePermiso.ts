import { useCallback, useEffect, useState } from 'react';
import { Linking, Platform } from 'react-native';
import { useCameraPermissions, type PermissionResponse } from 'expo-camera';
import * as Notifications from 'expo-notifications';
import { asegurarCanalPrestamos } from '../lib/notificaciones';
import type { EstadoPermiso, RecursoPermiso } from '../types';
import { useRevisarAlVolver } from './useRevisarAlVolver';

type RespuestaPermiso =
  | PermissionResponse
  | Notifications.NotificationPermissionsStatus
  | null;

export type ResultadoUsePermiso = {
  estado: EstadoPermiso;
  puedeVolverAPreguntar: boolean;
  pedir: () => Promise<boolean>;
  abrirAjustes: () => Promise<void>;
  revisar: () => Promise<void>;
};

function calcularEstado(respuesta: RespuestaPermiso): EstadoPermiso {
  if (respuesta === null) {
    return 'cargando';
  }
  if (respuesta.granted) {
    return 'concedido';
  }
  return respuesta.canAskAgain ? 'preguntable' : 'bloqueado';
}

export function usePermiso(recurso: RecursoPermiso): ResultadoUsePermiso {
  const [permisoCamara, pedirCamaraNativo, consultarCamaraNativo] =
    useCameraPermissions();
  const [permisoNotif, setPermisoNotif] =
    useState<Notifications.NotificationPermissionsStatus | null>(null);

  const revisar = useCallback(async () => {
    if (recurso === 'camara') {
      await consultarCamaraNativo();
      return;
    }

    if (Platform.OS === 'web') {
      return;
    }

    const res = await Notifications.getPermissionsAsync();
    setPermisoNotif(res);
  }, [recurso, consultarCamaraNativo]);

  useEffect(() => {
    let cancelado = false;

    async function iniciarConsulta(): Promise<void> {
      if (recurso === 'camara') {
        await consultarCamaraNativo();
        return;
      }

      if (Platform.OS === 'web') {
        return;
      }

      const res = await Notifications.getPermissionsAsync();
      if (!cancelado) {
        setPermisoNotif(res);
      }
    }

    void iniciarConsulta();

    return () => {
      cancelado = true;
    };
  }, [recurso, consultarCamaraNativo]);

  useRevisarAlVolver(() => {
    void revisar();
  });

  const pedir = useCallback(async (): Promise<boolean> => {
    if (recurso === 'camara') {
      const res = await pedirCamaraNativo();
      return Boolean(res?.granted);
    }

    if (Platform.OS === 'web') {
      return false;
    }

    await asegurarCanalPrestamos();
    const res = await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
      },
    });
    setPermisoNotif(res);
    return res.granted;
  }, [recurso, pedirCamaraNativo]);

  const abrirAjustes = useCallback(async () => {
    await Linking.openSettings();
  }, []);

  const respuestaActual: RespuestaPermiso =
    recurso === 'camara' ? permisoCamara : permisoNotif;

  const estado = calcularEstado(respuestaActual);
  const puedeVolverAPreguntar = respuestaActual?.canAskAgain ?? true;

  return {
    estado,
    puedeVolverAPreguntar,
    pedir,
    abrirAjustes,
    revisar,
  };
}
