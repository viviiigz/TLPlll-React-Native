import './App.css';
import { useMaquillajes } from './hooks/useMaquillajes';
import { FormularioMaquillaje } from './components/FormularioMaquillaje';
import { ListaMaquillajes } from './components/ListaMaquillajes';

function App() {
  const { 
    maquillajes, 
    cargando, 
    error,
    agregarMaquillaje,
    editarMaquillaje,
    borrarMaquillaje
  } = useMaquillajes();

  return (
    <div className="container">
      <h1 className="title">Catálogo de Maquillaje</h1>

      {error && (
        <div style={{ backgroundColor: '#fff5f5', color: '#e53e3e', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #fed7d7' }}>
          <i className="bi bi-exclamation-triangle" style={{ marginRight: '10px' }}></i>
          {error}
        </div>
      )}

      <FormularioMaquillaje agregarMaquillaje={agregarMaquillaje} />

      {cargando ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
          <i className="bi bi-arrow-repeat" style={{ fontSize: '2rem', display: 'inline-block', animation: 'spin 2s linear infinite' }}></i>
          <p>Cargando catálogo...</p>
        </div>
      ) : (
        <ListaMaquillajes 
          maquillajes={maquillajes} 
          borrarMaquillaje={borrarMaquillaje} 
          editarMaquillaje={editarMaquillaje} 
        />
      )}
    </div>
  );
}

export default App;