/**
 * RUTA DINÁMICA "/productos/:id"  →  src/app/(tabs)/productos/[id].tsx
 *
 * El valor entre corchetes llega con `useLocalSearchParams()`.
 * Ojo: los parámetros SIEMPRE llegan como texto (string).
 */
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Boton } from '@/components/boton';
import { InfoRuta } from '@/components/info-ruta';
import { Nota } from '@/components/nota';
import { Pantalla } from '@/components/pantalla';
import { Codigo, Parrafo, Titulo } from '@/components/texto';
import { categorias, formatearPrecio, productos } from '@/data/productos';
import { useColores } from '@/hooks/use-colores';

export default function DetalleProducto() {
  const colores = useColores();
  const { id } = useLocalSearchParams<{ id: string }>();
  const producto = productos.find((p) => p.id === id);

  if (!producto) {
    return (
      <Pantalla>
        <Stack.Screen options={{ title: 'No encontrado' }} />
        <Nota tipo="atencion" titulo={`No existe el producto "${id}"`}>
          La ruta coincide con <Codigo>[id].tsx</Codigo>, pero el dato no existe. Una ruta
          dinámica acepta cualquier valor: validar que exista es responsabilidad nuestra.
        </Nota>
        <Boton titulo="Volver" icono="arrow-back" onPress={() => router.back()} />
        <InfoRuta />
      </Pantalla>
    );
  }

  const siguienteId = String((Number(producto.id) % productos.length) + 1);
  const categoria = categorias.find((c) => c.id === producto.categoria);

  return (
    <Pantalla>
      {/* Cambiamos el título del header desde la propia pantalla */}
      <Stack.Screen options={{ title: producto.nombre }} />

      <View style={[styles.tarjeta, { backgroundColor: colores.superficie, borderColor: colores.borde }]}>
        <Text style={[styles.categoria, { color: colores.primario }]}>{categoria?.nombre}</Text>
        <Titulo>{producto.nombre}</Titulo>
        <Parrafo>{producto.descripcion}</Parrafo>
        <Text style={[styles.precio, { color: colores.exito }]}>{formatearPrecio(producto.precio)}</Text>
      </View>

      <Nota titulo="push vs replace">
        Los dos botones van al producto {siguienteId}. Con <Codigo>push</Codigo> se apila una
        pantalla nueva (la flecha atrás vuelve acá). Con <Codigo>replace</Codigo> esta pantalla
        se reemplaza y no queda en el historial.
      </Nota>

      <Boton
        titulo={`push → producto ${siguienteId}`}
        icono="add-circle"
        onPress={() => router.push({ pathname: '/productos/[id]', params: { id: siguienteId } })}
      />
      <Boton
        titulo={`replace → producto ${siguienteId}`}
        variante="secundario"
        icono="swap-horizontal"
        onPress={() => router.replace({ pathname: '/productos/[id]', params: { id: siguienteId } })}
      />
      <Boton
        titulo="dismissTo → listado"
        variante="secundario"
        icono="list"
        // Desapila todos los detalles hasta volver a encontrar /productos
        onPress={() => router.dismissTo('/productos')}
      />

      <InfoRuta />
    </Pantalla>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
    gap: 8,
  },
  categoria: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  precio: {
    fontSize: 24,
    fontWeight: '800',
    marginTop: 4,
  },
});
