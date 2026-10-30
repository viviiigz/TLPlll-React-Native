import { Link } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import type { ComponentProps } from 'react';
import { Platform } from 'react-native';

// este componente me sirve para abrir enlaces externos sin romper la navegacion de la app
export function ExternalLink(props: Omit<ComponentProps<typeof Link>, 'href'> & { href: any }) {
  return (
    <Link
      target="_blank"
      {...props}
      href={props.href}
      onPress={(e) => {
        if (Platform.OS !== 'web') {
          // evito que abra el navegador externo en el celular y uso el navegador integrado
          e.preventDefault();
          WebBrowser.openBrowserAsync(props.href as string);
        }
      }}
    />
  );
}
