export type Libro = {
  isbn: string; // 13 dígitos, sin guiones
  titulo: string;
  autor: string;
  anio: number;
  ejemplares: number; // ejemplares en el estante al iniciar la app
};

export type Prestamo = {
  isbn: string;
  titulo: string;
  fechaPrestamoISO: string;
  fechaDevolucionISO: string;
  recordatorioActivo: boolean;
  notificacionId: string | null;
};

export type AvisoInterno = {
  id: string;
  mensaje: string;
  fechaISO: string;
};

export type RecursoPermiso = 'camara' | 'notificaciones';

export type EstadoPermiso = 'cargando' | 'concedido' | 'preguntable' | 'bloqueado';

export type ResultadoReserva =
  | { tipo: 'prestamo'; prestamo: Prestamo }
  | { tipo: 'espera'; posicion: number }
  | { tipo: 'duplicado'; mensaje: string }
  | { tipo: 'error'; mensaje: string };

export type ResultadoEntrega = {
  entregadoA: string | null;
  eraUsuarioActual: boolean;
  tituloLibro: string;
};
