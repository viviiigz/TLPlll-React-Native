import { createContext, useContext, useEffect, useReducer, useCallback, useMemo } from 'react';
import { maquillajesReducer, initialState, ACTIONS } from '../reducers/maquillajesReducer';

const MaquillajesContext = createContext();

export const MaquillajesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(maquillajesReducer, initialState);

  // envuelvo set error en usecallback porque la voy a usar adentro de otras funciones
  // que tambien van a estar memorizadas. como dispatch nunca cambia, el array queda vacio.
  const setError = useCallback((message) => {
    dispatch({ type: ACTIONS.SET_ERROR, payload: message });
  }, []);

  // le meto usecallback a obtener maquillajes por si algun componente lo necesita usar en un useeffect
  const obtenerMaquillajes = useCallback(async () => {
    dispatch({ type: ACTIONS.SET_CARGANDO, payload: true });
    setError(null);

    try {
      const respuesta = await fetch('http://localhost:3000/api/maquillajes');
      if (!respuesta.ok) throw new Error('No se pudieron cargar los maquillajes');
      const datos = await respuesta.json();
      dispatch({ type: ACTIONS.SET_MAQUILLAJES, payload: datos });
    } catch (error) {
      setError(error.message);
    } finally {
      dispatch({ type: ACTIONS.SET_CARGANDO, payload: false });
    }
  }, [setError]); // depende de setError, por eso la puse arriba

  // aca empieza el combo del pdf. le pongo usecallback a las funciones que le voy a pasar a los hijos
  // asi mantienen su referencia y no rompen el react.memo de itemmaquillaje
  const agregarMaquillaje = useCallback(async (nuevoProducto) => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/maquillajes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoProducto),
      });

      if (!respuesta.ok) throw new Error('No se pudo agregar el producto');
      const creado = await respuesta.json();

      dispatch({ type: ACTIONS.AGREGAR_MAQUILLAJE, payload: creado });
    } catch (error) {
      setError(error.message);
    }
  }, [setError]);

  // la funcion de editar, clave para el itemmaquillaje que tiene memo
  const editarMaquillaje = useCallback(async (id, productoActualizado) => {
    try {
      const respuesta = await fetch(`http://localhost:3000/api/maquillajes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productoActualizado),
      });

      if (!respuesta.ok) throw new Error('No se pudo actualizar el producto');
      const actualizado = await respuesta.json();

      dispatch({ type: ACTIONS.EDITAR_MAQUILLAJE, payload: actualizado });
    } catch (error) {
      setError(error.message);
    }
  }, [setError]);

  // la funcion de borrar, otra mas pal combo
  const borrarMaquillaje = useCallback(async (id) => {
    try {
      const respuesta = await fetch(`http://localhost:3000/api/maquillajes/${id}`, {
        method: 'DELETE',
      });

      if (!respuesta.ok) throw new Error('No se pudo eliminar el producto');

      dispatch({ type: ACTIONS.BORRAR_MAQUILLAJE, payload: id });
    } catch (error) {
      setError(error.message);
    }
  }, [setError]);

  useEffect(() => {
    obtenerMaquillajes();
  }, [obtenerMaquillajes]);

  // buena practica plus: memorizo el objeto entero del value del contexto con usememo.
  // si no hago esto, react crea un objeto nuevo en cada render y todos los que usen
  // usemaquillajescontext se van a renderizar igual al pedo.
  const contextValue = useMemo(() => ({
    ...state,
    agregarMaquillaje,
    editarMaquillaje,
    borrarMaquillaje,
    obtenerMaquillajes,
  }), [state, agregarMaquillaje, editarMaquillaje, borrarMaquillaje, obtenerMaquillajes]);

  return (
    <MaquillajesContext.Provider value={contextValue}>
      {children}
    </MaquillajesContext.Provider>
  );
};

export const useMaquillajesContext = () => {
  const context = useContext(MaquillajesContext);
  if (!context) {
    throw new Error('useMaquillajesContext debe usarse dentro de MaquillajesProvider');
  }
  return context;
};