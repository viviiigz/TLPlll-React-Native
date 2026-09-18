import { useColorScheme } from 'react-native';

import { Colores } from '@/constants/theme';

/** Devuelve la paleta según el tema del sistema (claro / oscuro). */
export function useColores() {
  const esquema = useColorScheme();
  return esquema === 'dark' ? Colores.dark : Colores.light;
}
