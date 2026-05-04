import { useState } from 'react';
import { ItemMaquillaje } from './ItemMaquillaje';

export const ListaMaquillajes = ({ maquillajes, borrarMaquillaje, editarMaquillaje }) => {
  const [busqueda, setBusqueda] = useState('');

  const maquillajesFiltrados = maquillajes.filter(producto => 
    producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
    producto.marca.toLowerCase().includes(busqueda.toLowerCase())
  );

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