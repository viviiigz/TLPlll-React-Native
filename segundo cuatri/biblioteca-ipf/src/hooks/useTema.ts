import { useColorScheme } from 'react-native';
import {
  COLORES_CLARO,
  COLORES_OSCURO,
  type PaletaColores,
} from '../constants/tema';

export function useTema(): PaletaColores {
  const esquema = useColorScheme();
  return esquema === 'dark' ? COLORES_OSCURO : COLORES_CLARO;
}
