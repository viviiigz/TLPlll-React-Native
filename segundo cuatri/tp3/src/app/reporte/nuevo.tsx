import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  Image,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {
  agregarReporte,
  useBorradorReporte,
  actualizarBorrador,
  limpiarBorrador,
  type CategoriaReporte,
} from '@/lib/reportesStore';

const CATEGORIAS: { id: CategoriaReporte; nombre: string; icono: React.ComponentProps<typeof FontAwesome>['name'] }[] = [
  { id: 'electricidad', nombre: 'Electricidad', icono: 'bolt' },
  { id: 'agua', nombre: 'Agua / Plomería', icono: 'tint' },
  { id: 'mobiliario', nombre: 'Mobiliario', icono: 'wrench' },
  { id: 'equipos', nombre: 'Equipos', icono: 'desktop' },
];

export default function PantallaNuevoReporte() {
  const router = useRouter();
  // obtengo el borrador actual (por si volvemos de escanear qr, sacar foto o marcar ubicacion)
  const borrador = useBorradorReporte();

  const [titulo, setTitulo] = useState(borrador.titulo || '');
  const [descripcion, setDescripcion] = useState(borrador.descripcion || '');
  const [aula, setAula] = useState(borrador.aula || '');
  const [categoria, setCategoria] = useState<CategoriaReporte>(borrador.categoria || 'electricidad');

  // si el borrador trajo aula desde el qr, lo sincronizo
  React.useEffect(() => {
    if (borrador.aula && borrador.aula !== aula) {
      setAula(borrador.aula);
    }
  }, [borrador.aula]);

  const guardar = () => {
    if (!titulo.trim()) {
      Alert.alert('Falta el título', 'Por favor ingresá un título breve para el reporte.');
      return;
    }
    if (!aula.trim()) {
      Alert.alert('Falta el aula o lugar', 'Podés escanear el QR o escribir el aula a mano.');
      return;
    }

    // guardo el reporte en el almacen central
    agregarReporte({
      titulo: titulo.trim(),
      descripcion: descripcion.trim() || 'Sin descripción adicional.',
      aula: aula.trim(),
      categoria,
      fotoUri: borrador.fotoUri,
      ubicacion: borrador.ubicacion,
    });

    // limpio el borrador temporal y vuelvo al inicio
    limpiarBorrador();
    Alert.alert('Reporte Creado', 'El desperfecto fue registrado correctamente.', [
      { text: 'Aceptar', onPress: () => router.replace('/' as any) },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* titulo */}
        <View style={styles.campo}>
          <Text style={styles.label}>Título del desperfecto *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Luz quemada, canilla rota..."
            placeholderTextColor="#94a3b8"
            value={titulo}
            onChangeText={(txt) => {
              setTitulo(txt);
              actualizarBorrador({ titulo: txt });
            }}
          />
        </View>

        {/* aula con boton para escanear qr o escribir a mano */}
        <View style={styles.campo}>
          <View style={styles.labelFila}>
            <Text style={styles.label}>Aula o espacio *</Text>
            <Text style={styles.labelAyuda}>(Podés escribirlo a mano o escanear el QR)</Text>
          </View>
          <View style={styles.filaAula}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Ej: Aula 102, Lab de Informática..."
              placeholderTextColor="#94a3b8"
              value={aula}
              onChangeText={(txt) => {
                setAula(txt);
                actualizarBorrador({ aula: txt });
              }}
            />
            {/* al tocar escanear recien aca se abrira la camara pidiendo permiso en contexto */}
            <Pressable
              style={styles.btnEscanear}
              onPress={() => router.push('/reporte/escanear' as any)}>
              <FontAwesome name="qrcode" size={18} color="#ffffff" />
              <Text style={styles.btnEscanearTexto}>Escanear</Text>
            </Pressable>
          </View>
        </View>

        {/* categoria */}
        <View style={styles.campo}>
          <Text style={styles.label}>Categoría</Text>
          <View style={styles.gridCategorias}>
            {CATEGORIAS.map((cat) => {
              const elegida = categoria === cat.id;
              return (
                <Pressable
                  key={cat.id}
                  style={[styles.chipCategoria, elegida && styles.chipCategoriaActivo]}
                  onPress={() => {
                    setCategoria(cat.id);
                    actualizarBorrador({ categoria: cat.id });
                  }}>
                  <FontAwesome
                    name={cat.icono}
                    size={14}
                    color={elegida ? '#ffffff' : '#475569'}
                  />
                  <Text style={[styles.chipTexto, elegida && styles.chipTextoActivo]}>
                    {cat.nombre}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* descripcion */}
        <View style={styles.campo}>
          <Text style={styles.label}>Descripción del problema</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Detalles sobre qué ocurre, si hace chispas, si pierde mucha agua..."
            placeholderTextColor="#94a3b8"
            multiline
            numberOfLines={3}
            value={descripcion}
            onChangeText={(txt) => {
              setDescripcion(txt);
              actualizarBorrador({ descripcion: txt });
            }}
          />
        </View>

        {/* foto adjunta y ubicacion (ambas con botones independientes) */}
        <View style={styles.seccionAcciones}>
          <Text style={styles.label}>Datos adicionales (opcionales)</Text>

          {/* boton foto */}
          <Pressable
            style={styles.btnAccionOpcional}
            onPress={() => router.push('/reporte/foto' as any)}>
            <View style={styles.iconoCaja}>
              <FontAwesome name="camera" size={16} color="#0f766e" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.btnAccionTitulo}>
                {borrador.fotoUri ? 'Foto adjuntada' : 'Sacar o adjuntar foto'}
              </Text>
              <Text style={styles.btnAccionSub}>
                {borrador.fotoUri
                  ? 'Tocá para cambiar o quitar la imagen'
                  : 'Podés sacar foto o elegirla sin permisos de galería'}
              </Text>
            </View>
            <FontAwesome name="chevron-right" size={12} color="#94a3b8" />
          </Pressable>

          {/* vista previa si ya hay foto */}
          {borrador.fotoUri ? (
            <View style={styles.previewContainer}>
              <Image source={{ uri: borrador.fotoUri }} style={styles.previewFoto} />
              <Pressable
                style={styles.btnQuitarFoto}
                onPress={() => actualizarBorrador({ fotoUri: undefined })}>
                <Text style={styles.btnQuitarFotoTexto}>Quitar foto</Text>
              </Pressable>
            </View>
          ) : null}

          {/* boton ubicacion */}
          <Pressable
            style={styles.btnAccionOpcional}
            onPress={() => router.push('/reporte/ubicacion' as any)}>
            <View style={styles.iconoCaja}>
              <FontAwesome name="map-marker" size={18} color="#0f766e" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.btnAccionTitulo}>
                {borrador.ubicacion ? 'Ubicación registrada' : 'Marcar sector o GPS'}
              </Text>
              <Text style={styles.btnAccionSub}>
                {borrador.ubicacion?.sector
                  ? `Sector: ${borrador.ubicacion.sector}`
                  : borrador.ubicacion?.latitud
                  ? 'Coordenadas del edificio registradas'
                  : 'Podés usar ubicación o elegir el sector a mano'}
              </Text>
            </View>
            <FontAwesome name="chevron-right" size={12} color="#94a3b8" />
          </Pressable>
        </View>

        {/* boton guardar reporte */}
        <Pressable style={styles.btnGuardar} onPress={guardar}>
          <FontAwesome name="check" size={16} color="#ffffff" style={{ marginRight: 8 }} />
          <Text style={styles.btnGuardarTexto}>Guardar Reporte</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scroll: {
    padding: 16,
    gap: 16,
  },
  campo: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  labelFila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  labelAyuda: {
    fontSize: 11,
    color: '#64748b',
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0f172a',
  },
  textArea: {
    minHeight: 70,
    textAlignVertical: 'top',
  },
  filaAula: {
    flexDirection: 'row',
    gap: 8,
  },
  btnEscanear: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#0f766e',
    paddingHorizontal: 14,
    borderRadius: 8,
    justifyContent: 'center',
  },
  btnEscanearTexto: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 13,
  },
  gridCategorias: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chipCategoria: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  chipCategoriaActivo: {
    backgroundColor: '#0f766e',
    borderColor: '#0f766e',
  },
  chipTexto: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
  },
  chipTextoActivo: {
    color: '#ffffff',
  },
  seccionAcciones: {
    gap: 10,
    marginTop: 4,
  },
  btnAccionOpcional: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  iconoCaja: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ccfbf1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnAccionTitulo: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  btnAccionSub: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  previewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  previewFoto: {
    width: 60,
    height: 60,
    borderRadius: 6,
  },
  btnQuitarFoto: {
    padding: 6,
  },
  btnQuitarFotoTexto: {
    color: '#dc2626',
    fontSize: 12,
    fontWeight: '600',
  },
  btnGuardar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f766e',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 30,
  },
  btnGuardarTexto: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});

