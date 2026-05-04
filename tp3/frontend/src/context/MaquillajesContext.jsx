import { createContext, useContext, useEffect, useReducer } from 'react';
import { maquillajesReducer, initialState, ACTIONS } from '../reducers/maquillajesReducer';

const MaquillajesContext = createContext();

export const MaquillajesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(maquillajesReducer, initialState);

  const setError = (message) => {
    dispatch({ type: ACTIONS.SET_ERROR, payload: message });
  };

  const obtenerMaquillajes = async () => {
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
  };

  const agregarMaquillaje = async (nuevoProducto) => {
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
  };

  const editarMaquillaje = async (id, productoActualizado) => {
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
  };

  const borrarMaquillaje = async (id) => {
    try {
      const respuesta = await fetch(`http://localhost:3000/api/maquillajes/${id}`, {
        method: 'DELETE',
      });

      if (!respuesta.ok) throw new Error('No se pudo eliminar el producto');

      dispatch({ type: ACTIONS.BORRAR_MAQUILLAJE, payload: id });
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    obtenerMaquillajes();
  }, []);

  return (
    <MaquillajesContext.Provider
      value={{
        ...state,
        agregarMaquillaje,
        editarMaquillaje,
        borrarMaquillaje,
        obtenerMaquillajes,
      }}
    >
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