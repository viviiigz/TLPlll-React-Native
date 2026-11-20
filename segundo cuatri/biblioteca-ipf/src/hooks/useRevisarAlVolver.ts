import { useEffect, useRef } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

export function useRevisarAlVolver(alVolver: () => void): void {
  const estadoAnterior = useRef<string>(AppState.currentState ?? 'active');

  useEffect(() => {
    const suscripcion = AppState.addEventListener(
      'change',
      (nuevoEstado: AppStateStatus) => {
        const veniaDeFondo =
          estadoAnterior.current === 'background' ||
          estadoAnterior.current === 'inactive';

        if (veniaDeFondo && nuevoEstado === 'active') {
          alVolver();
        }
        estadoAnterior.current = nuevoEstado;
      },
    );

    return () => {
      suscripcion.remove();
    };
  }, [alVolver]);
}
