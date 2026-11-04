import { useEffect, useRef } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

// este hook me permite detectar cuando vuelvo a la app desde los ajustes del sistema
// para poder re-consultar el estado de los permisos en caliente
export function useRevisarAlVolver(revisar: () => void) {
  // guardo la referencia del estado anterior de la app
  const anterior = useRef<AppStateStatus>(AppState.currentState as AppStateStatus);

  useEffect(() => {
    // me suscribo a los cambios de estado de la aplicacion (segundo plano, activa, etc)
    const sub = AppState.addEventListener('change', (nuevo: AppStateStatus) => {
      const estabaAfuera = anterior.current === 'inactive' || anterior.current === 'background';
      // si la app vuelve a estar activa y antes no lo estaba, disparo la revision
      if (estabaAfuera && nuevo === 'active') {
        revisar();
      }
      anterior.current = nuevo;
    });

    // cuando el componente se desmonta, elimino la suscripcion para no dejar memory leaks
    return () => {
      sub.remove();
    };
  }, [revisar]);
}

