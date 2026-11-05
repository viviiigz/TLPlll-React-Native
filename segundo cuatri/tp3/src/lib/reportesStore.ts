import { useState, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// defino los tipos de categorias requeridos por el enunciado
export type CategoriaReporte = 'electricidad' | 'agua' | 'mobiliario' | 'equipos';

// defino el estado del reporte
export type EstadoReporte = 'pendiente' | 'en curso' | 'resuelto';

export interface Reporte {
  id: string;
  titulo: string;
  descripcion: string;
  aula: string;
  categoria: CategoriaReporte;
  fotoUri?: string;
  ubicacion?: {
    latitud?: number;
    longitud?: number;
    sector?: string;
    aproximada?: boolean;
  };
  estado: EstadoReporte;
  fecha: string;
}

export interface Aviso {
  id: string;
  reporteId: string;
  titulo: string;
  mensaje: string;
  fecha: string;
}

// cargo unos reportes iniciales para tener datos de prueba en la app
let reportesMemoria: Reporte[] = [
  {
    id: 'rep-1',
    titulo: 'Luz quemada en el pizarrón',
    descripcion: 'El tubo fluorescente del frente parpadea y no enciende bien.',
    aula: 'Aula 104',
    categoria: 'electricidad',
    estado: 'pendiente',
    ubicacion: { sector: 'Sector Aulario Central' },
    fecha: 'Hoy, 09:30',
  },
  {
    id: 'rep-2',
    titulo: 'Canilla del baño perdiendo agua',
    descripcion: 'La canilla del segundo lavamanos pierde un goteo continuo.',
    aula: 'Baño de Planta Baja',
    categoria: 'agua',
    estado: 'pendiente',
    ubicacion: { sector: 'Patio Principal' },
    fecha: 'Ayer, 16:15',
  },
  {
    id: 'rep-3',
    titulo: 'Proyector sin señal HDMI',
    descripcion: 'El proyector no detecta las notebooks en el puerto 1.',
    aula: 'Laboratorio de Informática',
    categoria: 'equipos',
    estado: 'resuelto',
    ubicacion: { sector: 'Ala Tecnológica' },
    fecha: '28 de Octubre',
  },
];

let avisosMemoria: Aviso[] = [
  {
    id: 'aviso-1',
    reporteId: 'rep-3',
    titulo: 'Reporte resuelto',
    mensaje: 'El proyector del Laboratorio de Informática ya fue reparado y probado.',
    fecha: '28 de Octubre, 18:00',
  },
];

let notificacionesHabilitadas = false;

// borrador temporal para armar el reporte entre pantallas sin perder datos
let borradorMemoria: Partial<Reporte> = {
  categoria: 'electricidad',
};
const suscriptoresBorrador = new Set<() => void>();

function avisarCambiosBorrador() {
  suscriptoresBorrador.forEach((fn) => fn());
}

export function useBorradorReporte() {
  const [borrador, setBorrador] = useState<Partial<Reporte>>(borradorMemoria);

  useEffect(() => {
    const actualizar = () => setBorrador({ ...borradorMemoria });
    suscriptoresBorrador.add(actualizar);
    return () => {
      suscriptoresBorrador.delete(actualizar);
    };
  }, []);

  return borrador;
}

export function actualizarBorrador(datos: Partial<Reporte>) {
  borradorMemoria = { ...borradorMemoria, ...datos };
  avisarCambiosBorrador();
}

export function limpiarBorrador() {
  borradorMemoria = { categoria: 'electricidad' };
  avisarCambiosBorrador();
}

// lista de funciones suscriptoras para actualizar las pantallas en tiempo real
const suscriptoresReportes = new Set<() => void>();
const suscriptoresAvisos = new Set<() => void>();
const suscriptoresAjustes = new Set<() => void>();

function avisarCambiosReportes() {
  suscriptoresReportes.forEach((fn) => fn());
}

function avisarCambiosAvisos() {
  suscriptoresAvisos.forEach((fn) => fn());
}

function avisarCambiosAjustes() {
  suscriptoresAjustes.forEach((fn) => fn());
}

// creo mi hook personalizado para suscribirme a la lista de reportes
export function useReportes() {
  const [reportes, setReportes] = useState<Reporte[]>(reportesMemoria);

  useEffect(() => {
    const actualizar = () => setReportes([...reportesMemoria]);
    suscriptoresReportes.add(actualizar);
    return () => {
      suscriptoresReportes.delete(actualizar);
    };
  }, []);

  return reportes;
}

// hook para suscribirme a la bandeja de avisos
export function useAvisos() {
  const [avisos, setAvisos] = useState<Aviso[]>(avisosMemoria);

  useEffect(() => {
    const actualizar = () => setAvisos([...avisosMemoria]);
    suscriptoresAvisos.add(actualizar);
    return () => {
      suscriptoresAvisos.delete(actualizar);
    };
  }, []);

  return avisos;
}

// hook para el estado del interruptor de avisarme cuando se resuelva mi reporte
export function useAjustesNotificaciones() {
  const [habilitadas, setHabilitadas] = useState(notificacionesHabilitadas);

  useEffect(() => {
    const actualizar = () => setHabilitadas(notificacionesHabilitadas);
    suscriptoresAjustes.add(actualizar);
    return () => {
      suscriptoresAjustes.delete(actualizar);
    };
  }, []);

  const cambiar = (valor: boolean) => {
    notificacionesHabilitadas = valor;
    avisarCambiosAjustes();
  };

  return { habilitadas, cambiar };
}

// funcion para agregar un nuevo reporte desde el formulario
export function agregarReporte(nuevo: Omit<Reporte, 'id' | 'estado' | 'fecha'>): Reporte {
  const reporteCreado: Reporte = {
    ...nuevo,
    id: `rep-${Date.now()}`,
    estado: 'pendiente',
    fecha: 'Recién',
  };
  reportesMemoria = [reporteCreado, ...reportesMemoria];
  avisarCambiosReportes();
  return reporteCreado;
}

// funcion para obtener un reporte por su id
export function obtenerReportePorId(id: string): Reporte | undefined {
  return reportesMemoria.find((r) => r.id === id);
}

// funcion que simula la resolucion de un reporte a los 10 segundos
// si las notificaciones estan permitidas, programa la notificacion local
// si no se puede programar una notificacion, guardo el aviso en la bandeja interna
export async function simularResolucionReporte(id: string) {
  const rep = reportesMemoria.find((r) => r.id === id);
  if (!rep) return;

  // actualizo el estado del reporte a 'resuelto'
  reportesMemoria = reportesMemoria.map((r) =>
    r.id === id ? { ...r, estado: 'resuelto' as EstadoReporte } : r
  );
  avisarCambiosReportes();

  const tituloAviso = `Reporte resuelto: ${rep.titulo}`;
  const mensajeAviso = `Se completó la reparación en ${rep.aula}. ¡Muchas gracias por avisar!`;

  // intento programar una notificacion local a los 10 segundos
  let notificacionProgramada = false;
  try {
    const permisos = await Notifications.getPermissionsAsync();
    if (permisos.granted && notificacionesHabilitadas) {
      // configuro como se comportan las notificaciones en primer plano
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
          shouldShowBanner: true,
          shouldShowList: true,
        }),
      });

      await Notifications.scheduleNotificationAsync({
        content: {
          title: tituloAviso,
          body: mensajeAviso,
          data: { reporteId: id },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 10,
        },
      });
      notificacionProgramada = true;
    }
  } catch (err) {
    console.warn('no se pudo programar la notificacion nativa:', err);
  }

  if (!notificacionProgramada) {
    // uso la bandeja interna como alternativa cuando no hay notificaciones del sistema
    const nuevoAviso: Aviso = {
      id: `aviso-${Date.now()}`,
      reporteId: id,
      titulo: tituloAviso,
      mensaje: `${mensajeAviso} (registrado en tu bandeja de avisos)`,
      fecha: 'Recién',
    };
    avisosMemoria = [nuevoAviso, ...avisosMemoria];
    avisarCambiosAvisos();
  }
}
