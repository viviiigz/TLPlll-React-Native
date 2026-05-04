import { useState, useEffect } from 'react';

export const useMaquillajes = () => {
  // estados para guardar los datos y saber si está cargando
  const [maquillajes, setMaquillajes] = useState([]);
  const [cargando, setCargando] = useState(true);

  const obtenerMaquillajes = async () => {
    try {
      setCargando(true); 
      const respuesta = await fetch('http://localhost:3000/api/maquillajes');
      const datos = await respuesta.json();
      setMaquillajes(datos);
    } catch (error) {
      console.error("Error al traer los maquillajes:", error);
    } finally {
      setCargando(false);
    }
  };

  // useEffect para que los datos se carguen apenas entramos a la página
  useEffect(() => {
    obtenerMaquillajes();
  }, []);

  // agregar un producto nuevo (POST)
  const agregarMaquillaje = async (nuevoProducto) => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/maquillajes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoProducto)
      });
      if (respuesta.ok) {
        obtenerMaquillajes();
      }
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  // editar un producto (PUT)
  const editarMaquillaje = async (id, productoActualizado) => {
    try {
      const respuesta = await fetch(`http://localhost:3000/api/maquillajes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productoActualizado)
      });
      if (respuesta.ok) {
        obtenerMaquillajes();
      }
    } catch (error) {
      console.error("Error al actualizar:", error);
    }
  };

  // eliminar un producto (DELETE)
  const borrarMaquillaje = async (id) => {
    try {
      const respuesta = await fetch(`http://localhost:3000/api/maquillajes/${id}`, {
        method: 'DELETE'
      });
      if (respuesta.ok) {
        obtenerMaquillajes();
      }
    } catch (error) {
      console.error("Error al borrar:", error);
    }
  };

  // retornamos lo que los componentes visuales van a necesitar usar
  return { 
    maquillajes, 
    cargando, 
    obtenerMaquillajes,
    agregarMaquillaje,
    editarMaquillaje,
    borrarMaquillaje
  };
};