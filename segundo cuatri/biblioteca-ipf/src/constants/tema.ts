export type PaletaColores = {
  fondo: string;
  superficie: string;
  superficieSecundaria: string;
  primario: string;
  primarioTexto: string;
  texto: string;
  textoSecundario: string;
  borde: string;
  exito: string;
  exitoFondo: string;
  error: string;
  errorFondo: string;
  alerta: string;
  alertaFondo: string;
  superposicion: string;
};

export const COLORES_CLARO: PaletaColores = {
  fondo: '#F5F7FA',
  superficie: '#FFFFFF',
  superficieSecundaria: '#EEF2F7',
  primario: '#1B4D89',
  primarioTexto: '#FFFFFF',
  texto: '#16202A',
  textoSecundario: '#52606D',
  borde: '#D8E0EA',
  exito: '#166534',
  exitoFondo: '#DCFCE7',
  error: '#B91C1C',
  errorFondo: '#FEE2E2',
  alerta: '#92400E',
  alertaFondo: '#FEF3C7',
  superposicion: 'rgba(15, 23, 42, 0.72)',
};

export const COLORES_OSCURO: PaletaColores = {
  fondo: '#0F172A',
  superficie: '#1E293B',
  superficieSecundaria: '#334155',
  primario: '#60A5FA',
  primarioTexto: '#0F172A',
  texto: '#F8FAFC',
  textoSecundario: '#CBD5E1',
  borde: '#334155',
  exito: '#86EFAC',
  exitoFondo: '#14532D',
  error: '#FCA5A5',
  errorFondo: '#7F1D1D',
  alerta: '#FDE68A',
  alertaFondo: '#78350F',
  superposicion: 'rgba(2, 6, 23, 0.82)',
};

export const ESPACIADO = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const TAMANIOS = {
  textoXs: 12,
  textoSm: 14,
  textoMd: 16,
  textoLg: 18,
  textoXl: 22,
  textoTitulo: 26,
  radioSm: 8,
  radioMd: 12,
  radioLg: 16,
  areaTactilMinima: 44,
} as const;

export const USUARIO_ACTUAL = 'Vos (Alumno IPF)';

export const CREDENCIALES_PERSONAL = {
  usuario: 'bibliotecario',
  clave: 'ipf2026',
} as const;

export const CANAL_NOTIFICACIONES = 'prestamos';
export const DIAS_PRESTAMO = 7;
export const SEGUNDOS_RECORDATORIO_DEMO = 15;

