import { useState, memo } from 'react';

export const ItemMaquillaje = memo(({ producto, borrarMaquillaje, editarMaquillaje }) => {
  const [editando, setEditando] = useState(false);

  // estados locales para manejar los cambios en el formulario de edicion. Se inicializan con los valores actuales del producto
  const [nuevoNombre, setNuevoNombre] = useState(producto.nombre);
  const [nuevaMarca, setNuevaMarca] = useState(producto.marca);
  const [nuevaCategoria, setNuevaCategoria] = useState(producto.categoria);
  const [nuevoPrecio, setNuevoPrecio] = useState(producto.precio);

  console.log(`Se está renderizando el producto: ${producto.nombre}`);

  // armamos el objeto completo con todos los datos nuevos
  const manejarGuardar = () => {
    editarMaquillaje(producto.id, { 
      nombre: nuevoNombre,
      marca: nuevaMarca,
      categoria: nuevaCategoria,
      precio: parseInt(nuevoPrecio) 
    });
    setEditando(false);
  };

  return (
    <li className="bg-white rounded-2xl p-6 shadow-sm border border-pink-100 hover:shadow-md transition-all duration-300">
      
      {editando ? (
        /* --- MODO EDICIÓN --- */
        <div className="flex flex-col gap-3">
          <input 
            type="text" 
            value={nuevoNombre} 
            onChange={(e) => setNuevoNombre(e.target.value)}
            className="w-full p-2 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 text-gray-700"
            placeholder="Nombre del producto"
          />
          
          <div className="flex gap-3">
            <input 
              type="text" 
              value={nuevaMarca} 
              onChange={(e) => setNuevaMarca(e.target.value)}
              className="w-1/2 p-2 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 text-gray-700"
              placeholder="Marca"
            />
            <input 
              type="text" 
              value={nuevaCategoria} 
              onChange={(e) => setNuevaCategoria(e.target.value)}
              className="w-1/2 p-2 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 text-gray-700"
              placeholder="Categoría"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-500 font-medium">$</span>
            <input 
              type="number" 
              value={nuevoPrecio} 
              onChange={(e) => setNuevoPrecio(e.target.value)} 
              className="w-full p-2 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 text-gray-700"
            />
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <button 
              onClick={() => setEditando(false)} 
              className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Cancelar
            </button>
            <button 
              onClick={manejarGuardar} 
              className="px-4 py-2 text-sm bg-pink-200 text-pink-900 rounded-lg hover:bg-pink-300 font-medium transition-colors"
            >
              Guardar cambios
            </button>
          </div>
        </div>
      ) : (
        /* --- MODO VISTA NORMAL --- */
        <div className="flex justify-between items-start">
          <div>
            <h4 className="text-lg font-medium text-gray-800 m-0 mb-1">{producto.nombre}</h4>
            <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">
              {producto.marca} &bull; {producto.categoria}
            </span>
            <div className="text-xl font-semibold text-gray-800 mt-3">
              ${producto.precio}
            </div>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setEditando(true)} 
              className="p-2 text-gray-400 hover:text-pink-500 transition-colors"
              title="Editar producto"
            >
              {/* Ícono de lápiz usando SVG para no depender de librerías externas */}
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
              </svg>
            </button>
            <button 
              onClick={() => borrarMaquillaje(producto.id)} 
              className="p-2 text-gray-400 hover:text-red-400 transition-colors"
              title="Eliminar"
            >
              {/* Ícono de tacho de basura usando SVG */}
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </li>
  );
});

