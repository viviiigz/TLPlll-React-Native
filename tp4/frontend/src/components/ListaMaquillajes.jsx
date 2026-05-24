import { useState, useMemo } from 'react';
import { ItemMaquillaje } from './ItemMaquillaje';

export const ListaMaquillajes = ({ maquillajes, borrarMaquillaje, editarMaquillaje }) => {
  const [busqueda, setBusqueda] = useState('');

  // meto el log afuera para saber cuando react decide volver a dibujar este componente
  console.log("dibujando el componente de la lista entera ");

  // aca aplico el usememo para el calculo costoso del filtro, como pide el pdf.
  // esto hace que el filter solo corra cuando es estrictamente necesario.
  const maquillajesFiltrados = useMemo(() => {
    // este log es la clave para probar si funciona. solo se tiene que imprimir
    // cuando realmente estamos filtrando.
    console.log("calculando el filtro de maquillajes... ");
    
    return maquillajes.filter(producto => 
      producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
      producto.marca.toLowerCase().includes(busqueda.toLowerCase())
    );
  }, [maquillajes, busqueda]); // estas son las dependencias. si ninguna cambia, usa la caché.

  return (
    <div>
      <div className="search-container">
        <i className="bi bi-search"></i>
        <input 
          className="input-field search-input"
          type="text" 
          placeholder="Buscar producto o marca..." 
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {maquillajesFiltrados.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
          <i className="bi bi-inboxes" style={{ fontSize: '2rem', marginBottom: '10px', display: 'block' }}></i>
          <p>No se encontraron productos.</p>
        </div>
      ) : (
        <ul className="catalog-grid">
          {maquillajesFiltrados.map((producto) => (
            <ItemMaquillaje 
              key={producto.id} 
              producto={producto} 
              borrarMaquillaje={borrarMaquillaje}
              editarMaquillaje={editarMaquillaje}
            />
          ))}
        </ul>
      )}
    </div>
  );
};