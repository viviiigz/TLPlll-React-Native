import { useState } from 'react';

export const FormularioMaquillaje = ({ agregarMaquillaje }) => {
  const [nombre, setNombre] = useState('');
  const [marca, setMarca] = useState('');
  const [categoria, setCategoria] = useState('');
  const [precio, setPrecio] = useState('');

  const manejarEnvio = (e) => {
    e.preventDefault();
    if (!nombre || !marca || !categoria || !precio) return alert("Por favor, completa todos los campos.");

    agregarMaquillaje({ nombre, marca, categoria, precio: parseInt(precio) });
    setNombre(''); setMarca(''); setCategoria(''); setPrecio('');
  };

  return (
    <div className="card" style={{ marginBottom: '40px' }}>
      <h3 style={{ marginTop: 0, fontWeight: 400 }}>Nuevo Producto</h3>
      <form onSubmit={manejarEnvio}>
        <div className="input-group">
          <input className="input-field" type="text" placeholder="Nombre del producto" value={nombre} onChange={e => setNombre(e.target.value)} />
          <input className="input-field" type="text" placeholder="Marca" value={marca} onChange={e => setMarca(e.target.value)} />
          <input className="input-field" type="text" placeholder="Categoría" value={categoria} onChange={e => setCategoria(e.target.value)} />
          <input className="input-field" type="number" placeholder="Precio" value={precio} onChange={e => setPrecio(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
          <i className="bi bi-plus-lg"></i> Agregar al Catálogo
        </button>
      </form>
    </div>
  );
};