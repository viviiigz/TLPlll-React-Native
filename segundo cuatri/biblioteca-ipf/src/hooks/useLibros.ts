import { useCallback, useEffect, useState } from 'react';
import { obtenerLibros } from '../lib/api';
import type { Libro } from '../types';

type ResultadoUseLibros = {
  libros: Libro[];
  cargando: boolean;
  error: string | null;
  reintentar: () => void;
};

export function useLibros(): ResultadoUseLibros {
  const [libros, setLibros] = useState<Libro[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [intento, setIntento] = useState<number>(0);

  const reintentar = useCallback(() => {
    setIntento((anterior) => anterior + 1);
  }, []);

  useEffect(() => {
    let cancelado = false;

    async function cargarCatalogo(): Promise<void> {
      setCargando(true);
      setError(null);

      try {
        const datos = await obtenerLibros();
        if (!cancelado) {
          setLibros(datos);
          setCargando(false);
        }
      } catch {
        if (!cancelado) {
          setError(
            'No pudimos cargar el catálogo en este momento. Verificá tu conexión e intentá nuevamente.',
          );
          setCargando(false);
        }
      }
    }

    void cargarCatalogo();

    return () => {
      cancelado = true;
    };
  }, [intento]);

  return { libros, cargando, error, reintentar };
}
