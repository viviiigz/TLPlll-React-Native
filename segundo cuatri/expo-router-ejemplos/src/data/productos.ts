export type Categoria = 'bebidas' | 'comidas' | 'artesanias';

export type Producto = {
  id: string;
  nombre: string;
  categoria: Categoria;
  precio: number;
  descripcion: string;
};

export const categorias: { id: Categoria; nombre: string }[] = [
  { id: 'bebidas', nombre: 'Bebidas' },
  { id: 'comidas', nombre: 'Comidas' },
  { id: 'artesanias', nombre: 'Artesanías' },
];

export const productos: Producto[] = [
  {
    id: '1',
    nombre: 'Yerba mate 1 kg',
    categoria: 'bebidas',
    precio: 4800,
    descripcion: 'Molienda tradicional, ideal para el mate de la mañana antes de clase.',
  },
  {
    id: '2',
    nombre: 'Tereré de pomelo',
    categoria: 'bebidas',
    precio: 2500,
    descripcion: 'Jugo de pomelo formoseño para el tereré de la siesta.',
  },
  {
    id: '3',
    nombre: 'Chipá (docena)',
    categoria: 'comidas',
    precio: 3600,
    descripcion: 'Recién horneados, con queso. El mejor acompañamiento para programar.',
  },
  {
    id: '4',
    nombre: 'Sopa paraguaya',
    categoria: 'comidas',
    precio: 4200,
    descripcion: 'Porción grande. Sí, es sólida. No, no es una sopa.',
  },
  {
    id: '5',
    nombre: 'Miel del monte',
    categoria: 'comidas',
    precio: 5100,
    descripcion: 'Producción local, frasco de 500 g.',
  },
  {
    id: '6',
    nombre: 'Yica de chaguar',
    categoria: 'artesanias',
    precio: 18000,
    descripcion: 'Bolso tejido a mano con fibra de chaguar por artesanas wichí.',
  },
  {
    id: '7',
    nombre: 'Mate de palo santo',
    categoria: 'artesanias',
    precio: 9500,
    descripcion: 'Tallado en madera de palo santo, con aroma característico.',
  },
];

export const formatearPrecio = (precio: number) => `$ ${precio.toLocaleString('es-AR')}`;
