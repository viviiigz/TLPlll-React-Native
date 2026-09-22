export interface Plato {
  id: number;
  nombre: string;
  precio: number;
  descripcion: string;
  categoria: 'desayuno' | 'almuerzo' | 'bebidas' | 'kiosco';
}

export const platos: Plato[] = [
  // desayuno
  { id: 1, nombre: 'Café con leche', precio: 1500, descripcion: 'Doble shot de espresso con leche espumada', categoria: 'desayuno' },
  { id: 2, nombre: 'Medialunas (3)', precio: 1200, descripcion: 'Medialunas de manteca horneadas hoy', categoria: 'desayuno' },
  { id: 3, nombre: 'Tostado de Miga', precio: 2500, descripcion: 'Jamón y queso en pan de miga tostado', categoria: 'desayuno' },
  // almuerzo
  { id: 4, nombre: 'Milanesa con Puré', precio: 4500, descripcion: 'Milanesa de ternera con puré de papas', categoria: 'almuerzo' },
  { id: 5, nombre: 'Tarta de Jamón y Queso', precio: 3000, descripcion: 'Porción abundante con masa casera', categoria: 'almuerzo' },
  { id: 6, nombre: 'Ensalada César', precio: 3800, descripcion: 'Lechuga, pollo, crutones y aderezo', categoria: 'almuerzo' },
  { id: 7, nombre: 'Fideos con Tuco', precio: 3500, descripcion: 'Tallarines caseros con salsa fileto', categoria: 'almuerzo' },
  // bebidas
  { id: 8, nombre: 'Agua Mineral', precio: 1000, descripcion: 'Botella de 500ml sin gas', categoria: 'bebidas' },
  { id: 9, nombre: 'Coca Cola', precio: 1200, descripcion: 'Lata de 354ml', categoria: 'bebidas' },
  // kiosco
  { id: 10, nombre: 'Alfajor Triple', precio: 1500, descripcion: 'Bañado en chocolate con dulce de leche', categoria: 'kiosco' },
  { id: 11, nombre: 'Turrón', precio: 500, descripcion: 'Turrón de maní clásico', categoria: 'kiosco' },
  { id: 12, nombre: 'Papas Fritas', precio: 1800, descripcion: 'Snack de papas saladas', categoria: 'kiosco' },
];