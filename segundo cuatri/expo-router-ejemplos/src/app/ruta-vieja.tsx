/**
 * REDIRECCIÓN  →  src/app/ruta-vieja.tsx
 *
 * <Redirect> navega apenas se renderiza, reemplazando la ruta actual
 * (no deja la pantalla vieja en el historial).
 * Típico para URLs que cambiaron de nombre o para mandar al login.
 */
import { Redirect } from 'expo-router';

export default function RutaVieja() {
  return <Redirect href="/productos" />;
}
