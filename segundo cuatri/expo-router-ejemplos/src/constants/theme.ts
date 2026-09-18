import { Platform } from 'react-native';

/**
 * Paleta de colores de la app en modo claro y oscuro.
 * Las pantallas nunca usan colores "sueltos": siempre leen de acá
 * a través del hook `useColores()`.
 */
export const Colores = {
  light: {
    texto: '#0F172A',
    textoSecundario: '#475569',
    fondo: '#F1F5F9',
    superficie: '#FFFFFF',
    borde: '#E2E8F0',
    codigo: '#E2E8F0',
    primario: '#4F46E5',
    primarioSuave: '#EEF2FF',
    exito: '#059669',
    exitoSuave: '#ECFDF5',
    alerta: '#B45309',
    alertaSuave: '#FFFBEB',
    peligro: '#DC2626',
    peligroSuave: '#FEF2F2',
  },
  dark: {
    texto: '#F1F5F9',
    textoSecundario: '#94A3B8',
    fondo: '#0B1120',
    superficie: '#151E32',
    borde: '#26324A',
    codigo: '#26324A',
    primario: '#818CF8',
    primarioSuave: '#1E1B4B',
    exito: '#34D399',
    exitoSuave: '#062E24',
    alerta: '#FBBF24',
    alertaSuave: '#2E2106',
    peligro: '#F87171',
    peligroSuave: '#3B0F12',
  },
};

export type Paleta = typeof Colores.light;

/** Colores para "fichas" de la demo de pila y cola. */
export const ColoresFichas = ['#6366F1', '#0EA5E9', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#8B5CF6'];

export const FuenteMono = Platform.select({
  ios: 'Menlo',
  android: 'monospace',
  default: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
});
