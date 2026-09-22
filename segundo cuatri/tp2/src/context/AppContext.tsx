import { createContext, useContext, useRef, useState, ReactNode } from 'react';
import { Pila } from '../estructuras/Pila';
import { Cola } from '../estructuras/Cola';
import { Plato } from '../data/platos';

// definimos como es un Pedido una vez confirmado
export interface Pedido {
  numero: number;
  platos: Plato[];
  nota: string;
}

interface AppContextType {
  usuario: string | null;
  login: () => void;
  logout: () => void;
  // instancias de estructuras
  pilaCarrito: Pila<Plato>;
  colaPedidos: Cola<Pedido>;
  pilaAtendidos: Pila<Pedido>;
  // acciones
  agregarAlCarrito: (plato: Plato) => void;
  deshacerUltimoCarrito: () => void;
  confirmarPedido: (nota: string) => number;
  atenderSiguiente: () => void;
  // trigger para re-renderizar pantallas
  actualizarUI: number;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<string | null>(null);
  const [actualizarUI, setActualizarUI] = useState(0); // forzador de render

  // usamos useRef para mantener las mismas instancias de las clases en toda la app
  const pilaCarrito = useRef(new Pila<Plato>()).current;
  const colaPedidos = useRef(new Cola<Pedido>()).current;
  const pilaAtendidos = useRef(new Pila<Pedido>()).current;
  const contadorPedidos = useRef(1); // para generar números correlativos

  const forzarRender = () => setActualizarUI((prev) => prev + 1);

  const login = () => { setUsuario('Cocina'); forzarRender(); };
  const logout = () => { setUsuario(null); forzarRender(); };

  // agregar plato hace push en la pila
  const agregarAlCarrito = (plato: Plato) => {
    pilaCarrito.push(plato);
    forzarRender();
  };

  // deshacer hace pop
  const deshacerUltimoCarrito = () => {
    pilaCarrito.pop();
    forzarRender();
  };

  //confirmar encola el pedido
  const confirmarPedido = (nota: string) => {
    if (pilaCarrito.vacia) return 0;
    
    const nuevoPedido: Pedido = {
      numero: contadorPedidos.current++,
      platos: pilaCarrito.aArray(),
      nota,
    };
    
    colaPedidos.encolar(nuevoPedido);
    
    // vaciamos el carrito (pila) haciendole pop hasta que quede vacío
    while (!pilaCarrito.vacia) {
      pilaCarrito.pop();
    }
    
    forzarRender();
    return nuevoPedido.numero;
  };

  // atender desencola y apila en el historial
  const atenderSiguiente = () => {
    const pedidoAtendido = colaPedidos.desencolar();
    if (pedidoAtendido) {
      pilaAtendidos.push(pedidoAtendido);
    }
    forzarRender();
  };

  return (
    <AppContext.Provider
      value={{
        usuario, login, logout,
        pilaCarrito, colaPedidos, pilaAtendidos,
        agregarAlCarrito, deshacerUltimoCarrito, confirmarPedido, atenderSiguiente,
        actualizarUI
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// hook personalizado para usar el contexto facilmente
export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext debe usarse dentro de un AppProvider');
  return context;
}