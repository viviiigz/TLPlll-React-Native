import { useColorScheme as useColorSchemeCore, type ColorSchemeName } from 'react-native';

export const useColorScheme = (): ColorSchemeName => {
  const coreScheme = useColorSchemeCore();
  if (coreScheme === 'light' || coreScheme === 'dark') {
    return coreScheme;
  }
  return 'light';
};
