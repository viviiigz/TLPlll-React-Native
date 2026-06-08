import { useState, useMemo, useCallback } from "react";
import { ItemMaquillaje } from "./ItemMaquillaje";
import { useMaquillajesContext } from "../context/MaquillajesContext"; //hook del contexto para acceder a los datos y funciones

export const ListaMaquillajes = () => {
  //ya no recibimos props, sino que accedemos directamente al contexto para obtener los maquillajes y las funciones de borrar y editar
  const { maquillajes, borrarMaquillaje, editarMaquillaje } =
    useMaquillajesContext();
  const [busqueda, setBusqueda] = useState("");

  const maquillajesFiltrados = useMemo(() => {
    // Si no hay maquillajes todavía (se están cargando), devolvemos un array vacío para evitar errores.
    // Este useMemo memoriza el resultado del filtro: solo se recalcula cuando cambian los datos o el texto de búsqueda.
    if (!maquillajes) return [];
    return maquillajes.filter(
      (producto) =>
        producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        producto.marca.toLowerCase().includes(busqueda.toLowerCase()),
    );
  }, [maquillajes, busqueda]);

  // useCallback memoriza la función para que conserve la misma referencia entre renders
  // siempre que su dependencia no cambie. Así ItemMaquillaje no se re-renderiza sólo porque la función padre se recreó.
  const handleBorrar = useCallback(
    (id) => {
      borrarMaquillaje(id);
    },
    [borrarMaquillaje],
  );

  const handleEditar = useCallback(
    (id, productoActualizado) => {
      editarMaquillaje(id, productoActualizado);
    },
    [editarMaquillaje],
  );

  console.log('Calculando filtro...');

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
        <div
          style={{
            textAlign: "center",
            padding: "40px",
            color: "var(--text-muted)",
          }}
        >
          <i
            className="bi bi-inboxes"
            style={{ fontSize: "2rem", marginBottom: "10px", display: "block" }}
          ></i>
          <p>No se encontraron productos.</p>
        </div>
      ) : (
        <ul className="catalog-grid">
          {maquillajesFiltrados.map((producto) => (
            <ItemMaquillaje
              key={producto.id}
              producto={producto}
              borrarMaquillaje={handleBorrar}
              editarMaquillaje={handleEditar}
            />
          ))}
        </ul>
      )}
    </div>
  );
};
