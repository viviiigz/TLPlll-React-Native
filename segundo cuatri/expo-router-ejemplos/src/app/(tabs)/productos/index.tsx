/**
 * RUTA "/productos"  →  src/app/(tabs)/productos/index.tsx
 *
 * Muestra dos formas de armar el `href` de un <Link>:
 *  - Como texto:  href="/productos/3"
 *  - Como objeto: href={{ pathname: '/productos/[id]', params: { id: '3' } }}
 */
import Ionicons from '@expo/vector-icons/Ionicons';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View, type PressableProps } from 'react-native';

import { Boton } from '@/components/boton';
import { InfoRuta } from '@/components/info-ruta';
import { Nota } from '@/components/nota';
import { Pantalla } from '@/components/pantalla';
import { Codigo } from '@/components/texto';
import { formatearPrecio, productos, type Producto } from '@/data/productos';
import { useColores } from '@/hooks/use-colores';

export default function ListaProductos() {
  return (
    <Pantalla>
      <Nota titulo="Ruta dinámica">
        El archivo se llama <Codigo>[id].tsx</Codigo>. Los corchetes indican que ese segmento
        es variable: /productos/1, /productos/2… usan la misma pantalla.
      </Nota>

      {productos.map((producto) => (
        <Link
          key={producto.id}
          href={{ pathname: '/productos/[id]', params: { id: producto.id } }}
          asChild>
          <ItemProducto producto={producto} />
        </Link>
      ))}

      <Link href="/productos/99" asChild>
        <Boton titulo="Probar un id que no existe (99)" variante="secundario" icono="bug" />
      </Link>

      <Link href={{ pathname: '/buscar', params: { categoria: 'artesanias' } }} asChild>
        <Boton titulo="Buscar artesanías" variante="secundario" icono="search" />
      </Link>

      <InfoRuta />
    </Pantalla>
  );
}

/**
 * El hijo de <Link asChild> conviene que sea un componente propio:
 * Link le pasa `onPress` y `href`, y nosotros se los damos al Pressable.
 */
function ItemProducto({ producto, ...pressableProps }: { producto: Producto } & PressableProps) {
  const colores = useColores();

  return (
    <Pressable
      {...pressableProps}
      style={({ pressed }) => [
        styles.item,
        { backgroundColor: colores.superficie, borderColor: colores.borde, opacity: pressed ? 0.8 : 1 },
      ]}>
      <View style={[styles.numero, { backgroundColor: colores.primarioSuave }]}>
        <Text style={[styles.numeroTexto, { color: colores.primario }]}>{producto.id}</Text>
      </View>
      <View style={styles.textos}>
        <Text style={[styles.nombre, { color: colores.texto }]}>{producto.nombre}</Text>
        <Text style={{ color: colores.textoSecundario }}>{formatearPrecio(producto.precio)}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colores.textoSecundario} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  numero: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numeroTexto: {
    fontWeight: '800',
  },
  textos: {
    flex: 1,
  },
  nombre: {
    fontSize: 16,
    fontWeight: '600',
  },
});
