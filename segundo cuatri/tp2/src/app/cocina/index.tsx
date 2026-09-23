import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useFocusEffect, router, Link } from 'expo-router';
import { useCallback, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import DondeEstoy from '../../components/DondeEstoy';
import Cargando from '../../components/Cargando';

export default function CocinaScreen() {
  // 'forzarRender' para actualizar la vista, y dejamos 'actualizarUI'olo para las keys
  const { colaPedidos,atenderSiguiente, actualizarUI, forzarRender, logout } = useAppContext();
  const [estaCargando, setEstaCargando] = useState(true);

  useFocusEffect(
    useCallback(() => {
      setEstaCargando(true);
      const timer = setTimeout(() => setEstaCargando(false), 800);
      return () => clearTimeout(timer);
    }, [])
  );

  // filtramos el array para que TypeScript esté seguro de que no hay ningún 'undefined' dando vueltas
  const pedidos = colaPedidos.aArray().filter(item => item !== undefined);

  const handleAtender = () => {
    forzarRender(); // redibujar la pantalla
    atenderSiguiente();
  };

  if (estaCargando) {
    return (
      <View style={styles.center}>
        <Cargando mensaje="Sincronizando comandas con el salón..." />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Panel de Cocina 👨‍🍳</Text>
        <Text style={styles.subtitulo}>Pedidos en espera: {colaPedidos.tamanio}</Text>
      </View>

      <ScrollView style={{ flex: 1 }}>
        {pedidos.length === 0 ? (
          <Text style={styles.textoVacio}>No hay pedidos pendientes. ¡Buen trabajo! ✨</Text>
        ) : (
          pedidos.map((item, index) => {
            if (!item) return null;

            return (
              <View key={`pedido-${index}-${actualizarUI}`} style={styles.tarjetaPedido}>
                <Text style={styles.turno}>Turno #{item.numeroTurno}</Text>
                <Text style={styles.nota}>📝 Nota: {item.nota || 'Sin nota'}</Text>
              </View>
            );
          })
        )}
      </ScrollView>

      {!colaPedidos.vacia && (
        <Pressable style={styles.botonAtender} onPress={handleAtender}>
          <Text style={styles.textoBoton}>✅ Despachar Próximo (Desencolar)</Text>
        </Pressable>
      )}

      <Pressable 
      
        style={styles.botonSalir} 
        onPress={() => {
          logout();
          router.replace('/');
        }}
      >
        <Text style={styles.textoSalir}>Cerrar Sesión</Text>
      </Pressable>

      <DondeEstoy />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f3f4f6' },
  center: { flex: 1, justifyContent: 'center', backgroundColor: '#f3f4f6' },
  header: { marginBottom: 20, alignItems: 'center' },
  titulo: { fontSize: 28, fontWeight: 'bold', color: '#1f2937' },
  subtitulo: { fontSize: 18, color: '#6b7280', marginTop: 5 },
  tarjetaPedido: { 
    backgroundColor: '#fff', 
    padding: 20, 
    marginBottom: 15, 
    borderRadius: 12, 
    borderLeftWidth: 5, 
    borderLeftColor: '#f59e0b',
    elevation: 2 
  },
  turno: { fontSize: 22, fontWeight: 'bold', color: '#1f2937', marginBottom: 5 },
  nota: { fontSize: 16, color: '#4b5563', fontStyle: 'italic' },
  textoVacio: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#6b7280' },
  botonAtender: { backgroundColor: '#10b981', padding: 18, borderRadius: 8, alignItems: 'center', marginBottom: 15 },
  textoBoton: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  botonSalir: { padding: 15, alignItems: 'center', marginTop: 10 },
  textoSalir: { color: '#ef4444', fontSize: 16, fontWeight: 'bold' },
});