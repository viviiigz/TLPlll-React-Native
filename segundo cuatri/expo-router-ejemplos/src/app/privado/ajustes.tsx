/**
 * RUTA PROTEGIDA "/privado/ajustes"  →  src/app/privado/ajustes.tsx
 */
import { useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

import { Boton } from '@/components/boton';
import { InfoRuta } from '@/components/info-ruta';
import { Pantalla } from '@/components/pantalla';
import { useAuth } from '@/context/auth';
import { useColores } from '@/hooks/use-colores';

export default function Ajustes() {
  const colores = useColores();
  const { cerrarSesion } = useAuth();
  const [notificaciones, setNotificaciones] = useState(true);
  const [modoEstudio, setModoEstudio] = useState(false);

  const opciones = [
    { etiqueta: 'Notificaciones', valor: notificaciones, cambiar: setNotificaciones },
    { etiqueta: 'Modo estudio', valor: modoEstudio, cambiar: setModoEstudio },
  ];

  return (
    <Pantalla>
      <View style={[styles.lista, { backgroundColor: colores.superficie, borderColor: colores.borde }]}>
        {opciones.map((opcion) => (
          <View key={opcion.etiqueta} style={styles.fila}>
            <Text style={[styles.etiqueta, { color: colores.texto }]}>{opcion.etiqueta}</Text>
            <Switch value={opcion.valor} onValueChange={opcion.cambiar} />
          </View>
        ))}
      </View>

      <Boton titulo="Cerrar sesión" variante="peligro" icono="log-out" onPress={cerrarSesion} />

      <InfoRuta />
    </Pantalla>
  );
}

const styles = StyleSheet.create({
  lista: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
  },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  etiqueta: {
    fontSize: 16,
  },
});
