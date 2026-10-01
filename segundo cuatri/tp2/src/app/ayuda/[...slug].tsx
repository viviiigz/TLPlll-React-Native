import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Link, router, Stack, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import DondeEstoy from '../../components/DondeEstoy';

export default function AyudaArticuloScreen() {
  const { slug } = useLocalSearchParams<{ slug: string[] }>();
  const segmentos = Array.isArray(slug) ? slug : slug ? [slug] : [];
  // la ruta permite distinguir la categoría de pagos del artículo de efectivo
  const esCategoriaPagos = segmentos.length === 1 && segmentos[0] === 'pagos';
  const esPagoEfectivo = segmentos.length === 2 && segmentos[0] === 'pagos' && segmentos[1] === 'efectivo';
  const titulo = esCategoriaPagos
    ? 'Métodos de pago'
    : esPagoEfectivo
      ? 'Pagar con efectivo en caja'
      : 'Artículo de Ayuda';
  const rutaMapeada = segmentos.join(' > ') || 'Tema general';

  return (
    <>
      <Stack.Screen options={{ title: titulo }} />
      <View style={styles.container}>
        <View style={styles.encabezado}>
          <MaterialIcons name={esCategoriaPagos ? 'credit-card' : 'menu-book'} size={32} color="#1f2937" />
          <Text style={styles.titulo}>{titulo}</Text>
        </View>

        {/* la categoría muestra sus opciones y el artículo muestra su explicación */}
        {esCategoriaPagos ? (
          <>
            <Text style={styles.subtitulo}>Seleccioná una opción:</Text>
            <View style={styles.listaOpciones}>
              <Link href="/ayuda/pagos/efectivo" asChild>
                <Pressable style={styles.botonOpcion}>
                  <MaterialIcons name="payments" size={24} color="#3b82f6" />
                  <Text style={styles.textoOpcion}>Pagar con efectivo en caja</Text>
                  <MaterialIcons name="chevron-right" size={24} color="#6b7280" />
                </Pressable>
              </Link>
            </View>
          </>
        ) : (
          <View style={styles.tarjeta}>
            <Text style={styles.etiquetaRuta}>{esPagoEfectivo ? 'Métodos de pago' : 'Estás leyendo sobre:'}</Text>
            <Text style={styles.rutaString}>{esPagoEfectivo ? 'Efectivo en caja' : rutaMapeada}</Text>
            <Text style={styles.contenido}>
              {esPagoEfectivo
                ? 'Al confirmar tu pedido, la app muestra el total a pagar. Para pagar en efectivo, aboná ese total en caja. La aplicación todavía no registra el medio de pago.'
                : 'Acá iría el contenido detallado para este tema de ayuda.'}
            </Text>
          </View>
        )}

        {/* el artículo de efectivo vuelve a la categoría de pagos */}
        <Pressable style={styles.botonVolver} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={20} color="#fff" />
          <Text style={styles.textoBoton}>{esPagoEfectivo ? 'Volver a pagos' : 'Volver a Temas'}</Text>
        </Pressable>

        <DondeEstoy />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f3f4f6' },
  encabezado: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
  titulo: { fontSize: 28, fontWeight: 'bold', color: '#1f2937' },
  subtitulo: { fontSize: 16, color: '#4b5563', marginBottom: 16 },
  listaOpciones: { gap: 10 },
  botonOpcion: { backgroundColor: '#fff', padding: 16, borderRadius: 8, elevation: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  textoOpcion: { flex: 1, fontSize: 16, color: '#3b82f6', fontWeight: '500' },
  tarjeta: { backgroundColor: '#fff', padding: 20, borderRadius: 10, elevation: 2 },
  etiquetaRuta: { fontSize: 14, color: '#6b7280', marginBottom: 5 },
  rutaString: { fontSize: 18, fontWeight: 'bold', color: '#10b981', marginBottom: 15, textTransform: 'capitalize' },
  contenido: { fontSize: 16, color: '#4b5563', lineHeight: 24 },
  // el margen separa el botón del contenido anterior
  botonVolver: { backgroundColor: '#3b82f6', padding: 15, marginTop: 20, borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  textoBoton: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});