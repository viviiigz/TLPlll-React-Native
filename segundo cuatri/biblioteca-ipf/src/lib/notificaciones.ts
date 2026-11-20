import {
  AndroidImportance,
  SchedulableTriggerInputTypes,
  cancelScheduledNotificationAsync,
  getPermissionsAsync,
  scheduleNotificationAsync,
  setNotificationChannelAsync,
  setNotificationHandler,
} from 'expo-notifications';
import { Platform } from 'react-native';
import {
  CANAL_NOTIFICACIONES,
  SEGUNDOS_RECORDATORIO_DEMO,
} from '../constants/tema';

setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function asegurarCanalPrestamos(): Promise<void> {
  if (Platform.OS !== 'android') {
    return;
  }

  await setNotificationChannelAsync(CANAL_NOTIFICACIONES, {
    name: 'Recordatorios de préstamos',
    importance: AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
  });
}

export async function programarRecordatorioDevolucion(
  tituloLibro: string,
  isbn: string,
): Promise<string> {
  await asegurarCanalPrestamos();

  return scheduleNotificationAsync({
    content: {
      title: 'Recordatorio de devolución',
      body: `Recordá devolver "${tituloLibro}" antes de la fecha límite.`,
      data: { isbn },
      ...(Platform.OS === 'android' ? { channelId: CANAL_NOTIFICACIONES } : {}),
    },
    trigger: {
      type: SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: SEGUNDOS_RECORDATORIO_DEMO,
    },
  });
}

export async function cancelarRecordatorio(
  notificacionId: string,
): Promise<void> {
  try {
    await cancelScheduledNotificationAsync(notificacionId);
  } catch {
    // Si ya se disparó o no existe en el sistema, continuamos sin error.
  }
}

export async function tienePermisoNotificaciones(): Promise<boolean> {
  if (Platform.OS === 'web') {
    return false;
  }
  const estado = await getPermissionsAsync();
  return estado.granted;
}

export async function enviarNotificacionEntrega(
  tituloLibro: string,
  isbn: string,
): Promise<void> {
  await asegurarCanalPrestamos();

  await scheduleNotificationAsync({
    content: {
      title: '¡Tu libro ya está disponible!',
      body: `Ya podés retirar "${tituloLibro}" por el mostrador de la biblioteca.`,
      data: { isbn },
      ...(Platform.OS === 'android' ? { channelId: CANAL_NOTIFICACIONES } : {}),
    },
    trigger: null,
  });
}
