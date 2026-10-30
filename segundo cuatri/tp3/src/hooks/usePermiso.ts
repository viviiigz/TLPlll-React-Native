import { useState, useEffect, useCallback } from 'react';
import { Linking, Platform } from 'react-native';
import { Camera } from 'expo-camera';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import * as ImagePicker from 'expo-image-picker';
import { useRevisarAlVolver } from './useRevisarAlVolver';

// defino los cuatro estados posibles que me pide la consigna
export type EstadoPermiso = 'cargando' | 'concedido' | 'preguntable' | 'bloqueado';

// defino los recursos que soporta mi app (tanto en español como en ingles)
export type TipoRecurso =
  | 'camara'
  | 'camera'
  | 'ubicacion'
  | 'location'
  | 'notificaciones'
  | 'notifications'
  | 'fotos'
  | 'mediaLibrary';

export interface PermisoInfo {
  estado: EstadoPermiso;
  parcial: boolean;
  detalles: any;
  pedir: () => Promise<boolean>;
  abrirAjustes: () => Promise<void>;
  consultar: () => Promise<void>;
}

// implemento mi hook unificado para consultar y pedir cualquier permiso
export function usePermiso(recurso: TipoRecurso): PermisoInfo {
  // inicio en null para representar el estado de 'cargando'
  const [respuesta, setRespuesta] = useState<any>(null);

  // funcion interna para consultar el estado segun el modulo correspondiente de expo
  const consultarNativo = useCallback(async () => {
    try {
      if (recurso === 'camara' || recurso === 'camera') {
        // consulto camara sin mostrar dialogo
        const res = await Camera.getCameraPermissionsAsync();
        setRespuesta(res);
      } else if (recurso === 'ubicacion' || recurso === 'location') {
        // consulto ubicacion en primer plano
        const res = await Location.getForegroundPermissionsAsync();
        setRespuesta(res);
      } else if (recurso === 'notificaciones' || recurso === 'notifications') {
        // consulto notificaciones
        const res = await Notifications.getPermissionsAsync();
        setRespuesta(res);
      } else if (recurso === 'fotos' || recurso === 'mediaLibrary') {
        // consulto galeria si hiciera falta inspeccionar
        const res = await ImagePicker.getMediaLibraryPermissionsAsync();
        setRespuesta(res);
      }
    } catch (err) {
      // si ocurre un error lo dejo en denegado seguro
      console.warn('error al consultar permiso:', err);
    }
  }, [recurso]);

  // consulto el permiso apenas se monta el componente
  useEffect(() => {
    consultarNativo();
  }, [consultarNativo]);

  // uso mi hook para volver a consultar automaticamente cuando vuelvo de ajustes
  useRevisarAlVolver(consultarNativo);

  // funcion para pedir el permiso mostrando el dialogo oficial del sistema
  const pedir = useCallback(async (): Promise<boolean> => {
    try {
      let nuevaRespuesta: any = null;

      if (recurso === 'camara' || recurso === 'camera') {
        nuevaRespuesta = await Camera.requestCameraPermissionsAsync();
      } else if (recurso === 'ubicacion' || recurso === 'location') {
        nuevaRespuesta = await Location.requestForegroundPermissionsAsync();
      } else if (recurso === 'notificaciones' || recurso === 'notifications') {
        // en android antes de pedir notificaciones creo el canal 'reportes' como pide la teoria
        if (Platform.OS === 'android') {
          await Notifications.setNotificationChannelAsync('reportes', {
            name: 'Reportes y Novedades',
            importance: Notifications.AndroidImportance.DEFAULT,
          });
        }
        nuevaRespuesta = await Notifications.requestPermissionsAsync({
          ios: { allowAlert: true, allowBadge: true, allowSound: true },
        });
      } else if (recurso === 'fotos' || recurso === 'mediaLibrary') {
        nuevaRespuesta = await ImagePicker.requestMediaLibraryPermissionsAsync();
      }

      if (nuevaRespuesta) {
        setRespuesta(nuevaRespuesta);
        return Boolean(nuevaRespuesta.granted);
      }
      return false;
    } catch (err) {
      console.warn('error al solicitar permiso:', err);
      return false;
    }
  }, [recurso]);

  // funcion para mandar al usuario a los ajustes de la app si el permiso quedo bloqueado
  const abrirAjustes = useCallback(async () => {
    await Linking.openSettings();
  }, []);

  // calculo el estado de mi hook segun lo aprendido en la clase
  let estado: EstadoPermiso = 'cargando';
  let parcial = false;

  if (respuesta !== null) {
    if (respuesta.granted) {
      estado = 'concedido';
      // verifico si me dieron acceso parcial (ubicacion aproximada o fotos limitadas)
      if (recurso === 'ubicacion' || recurso === 'location') {
        const esCoarseAndroid = respuesta.android?.accuracy === 'coarse';
        const esReducedIos = respuesta.ios?.accuracy === 'reduced';
        parcial = Boolean(esCoarseAndroid || esReducedIos);
      } else if (recurso === 'fotos' || recurso === 'mediaLibrary') {
        parcial = respuesta.accessPrivileges === 'limited';
      }
    } else {
      // si fue denegado, canaskagain me dice si puedo volver a preguntar o si esta bloqueado
      if (respuesta.canAskAgain) {
        estado = 'preguntable';
      } else {
        estado = 'bloqueado';
      }
    }
  }

  return {
    estado,
    parcial,
    detalles: respuesta,
    pedir,
    abrirAjustes,
    consultar: consultarNativo,
  };
}

