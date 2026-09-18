/**
 * RUTA "/"  →  src/app/(tabs)/index.tsx
 *
 * `index.tsx` es la ruta por defecto de su carpeta.
 * Como (tabs) es un grupo, no suma nada a la URL: esta pantalla es "/".
 */
import type { Href } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Pantalla } from '@/components/pantalla';
import { TarjetaEjemplo } from '@/components/tarjeta-ejemplo';
import { Parrafo, Subtitulo } from '@/components/texto';
import { useColores } from '@/hooks/use-colores';

export default function Inicio() {
  const colores = useColores();

  return (
    <Pantalla>
      <View style={[styles.hero, { backgroundColor: colores.primario }]}>
        <Text style={styles.heroEtiqueta}>Taller Complementario · React Native II</Text>
        <Text style={styles.heroTitulo}>Rutas con Expo Router</Text>
        <Text style={styles.heroTexto}>
          Cada tarjeta abre un ejemplo. Abajo de cada pantalla vas a ver la URL, los segmentos y
          los parámetros de la ruta actual.
        </Text>
        <Text style={styles.heroPie}>Instituto Politécnico Formosa</Text>
      </View>

      <Subtitulo>1 · Stack: la pila de pantallas</Subtitulo>
      <TarjetaEjemplo
        href={{ pathname: '/pila/[nivel]', params: { nivel: 1 } }}
        titulo="Pila de navegación"
        descripcion="push, navigate, back, replace y dismiss, con la pila dibujada en vivo."
        ruta="/pila/[nivel]"
        icono="layers"
        color="#6366F1"
      />
      <TarjetaEjemplo
        href="/estructuras"
        titulo="Pila vs Cola"
        descripcion="Jugá con una pila (LIFO) y una cola (FIFO) animadas."
        ruta="/estructuras"
        icono="git-compare"
        color="#0EA5E9"
      />
      <TarjetaEjemplo
        href="/modal"
        titulo="Modal"
        descripcion="Una pantalla que se presenta encima de todo."
        ruta="presentation: 'modal'"
        icono="albums"
        color="#8B5CF6"
      />
      <TarjetaEjemplo
        href="/hoja"
        titulo="Hoja inferior (sheet)"
        descripcion="Un modal que ocupa media pantalla y se puede arrastrar."
        ruta="presentation: 'formSheet'"
        icono="reorder-four"
        color="#EC4899"
      />

      <Subtitulo>2 · Rutas dinámicas</Subtitulo>
      <TarjetaEjemplo
        href="/productos"
        titulo="Catálogo de productos"
        descripcion="Lista → detalle. Un Stack anidado dentro de una tab."
        ruta="/productos/[id]"
        icono="storefront"
        color="#10B981"
      />
      <TarjetaEjemplo
        href="/docs/guia/expo-router/rutas"
        titulo="Catch-all"
        descripcion="Una sola pantalla atrapa cualquier cantidad de segmentos."
        ruta="/docs/[...slug]"
        icono="folder-open"
        color="#F59E0B"
      />

      <Subtitulo>3 · Parámetros de búsqueda</Subtitulo>
      <TarjetaEjemplo
        href={{ pathname: '/buscar', params: { q: 'mate' } }}
        titulo="Buscador"
        descripcion="El texto y el filtro viven en la URL: ?q=mate&categoria=..."
        ruta="/buscar?q=mate"
        icono="search"
        color="#0EA5E9"
      />

      <Subtitulo>4 · Otros navegadores</Subtitulo>
      <TarjetaEjemplo
        href="/menu"
        titulo="Menú lateral (Drawer)"
        descripcion="Navegación con un panel que se desliza desde el costado."
        ruta="/menu"
        icono="menu"
        color="#6366F1"
      />

      <Subtitulo>5 · Control de acceso y errores</Subtitulo>
      <TarjetaEjemplo
        href="/perfil"
        titulo="Rutas protegidas"
        descripcion="Iniciá sesión para desbloquear /privado con Stack.Protected."
        ruta="<Stack.Protected guard>"
        icono="lock-closed"
        color="#EF4444"
      />
      <TarjetaEjemplo
        href="/ruta-vieja"
        titulo="Redirect"
        descripcion="Una ruta vieja que te manda automáticamente a /productos."
        ruta="<Redirect href='/productos' />"
        icono="return-down-forward"
        color="#F59E0B"
      />
      <TarjetaEjemplo
        // Esta ruta no existe a propósito: con typedRoutes hay que "forzar" el tipo.
        href={'/esta-ruta-no-existe' as Href}
        titulo="Página 404"
        descripcion="¿Qué pasa si navegamos a una ruta que no existe?"
        ruta="+not-found.tsx"
        icono="help-buoy"
        color="#64748B"
      />

      <Parrafo style={styles.pie}>
        Tip: abrí la carpeta src/app en el editor. Cada archivo que ves ahí es una de estas
        pantallas.
      </Parrafo>
    </Pantalla>
  );
}

const styles = StyleSheet.create({
  hero: {
    borderRadius: 20,
    padding: 20,
    gap: 8,
  },
  heroEtiqueta: {
    color: '#C7D2FE',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  heroTitulo: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  heroTexto: {
    color: '#E0E7FF',
    fontSize: 15,
    lineHeight: 22,
  },
  heroPie: {
    color: '#C7D2FE',
    fontSize: 12,
    marginTop: 4,
  },
  pie: {
    textAlign: 'center',
    marginTop: 12,
    fontSize: 13,
  },
});
