import { createContext, use, useState, type ReactNode } from 'react';

/**
 * Sesión "de mentira" guardada en memoria.
 * Alcanza para demostrar rutas protegidas con <Stack.Protected>:
 * en una app real acá iría el token, SecureStore, una API, etc.
 */
type Auth = {
  usuario: string | null;
  iniciarSesion: (nombre: string) => void;
  cerrarSesion: () => void;
};

const AuthContext = createContext<Auth | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<string | null>(null);

  const valor: Auth = {
    usuario,
    iniciarSesion: (nombre) => setUsuario(nombre.trim() || 'Estudiante'),
    cerrarSesion: () => setUsuario(null),
  };

  return <AuthContext value={valor}>{children}</AuthContext>;
}

export function useAuth() {
  const auth = use(AuthContext);
  if (!auth) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  }
  return auth;
}
