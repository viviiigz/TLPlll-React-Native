import Ionicons from '@expo/vector-icons/Ionicons';
import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useColores } from '@/hooks/use-colores';

type Tipo = 'concepto' | 'tip' | 'atencion';

type Props = {
  tipo?: Tipo;
  titulo: string;
  children: ReactNode;
};

/** Recuadro para explicar el concepto que muestra cada pantalla. */
export function Nota({ tipo = 'concepto', titulo, children }: Props) {
  const colores = useColores();

  const estilo = {
    concepto: { icono: 'school' as const, color: colores.primario, fondo: colores.primarioSuave },
    tip: { icono: 'bulb' as const, color: colores.exito, fondo: colores.exitoSuave },
    atencion: { icono: 'warning' as const, color: colores.alerta, fondo: colores.alertaSuave },
  }[tipo];

  return (
    <View style={[styles.nota, { backgroundColor: estilo.fondo, borderLeftColor: estilo.color }]}>
      <View style={styles.encabezado}>
        <Ionicons name={estilo.icono} size={18} color={estilo.color} />
        <Text style={[styles.titulo, { color: estilo.color }]}>{titulo}</Text>
      </View>
      <Text style={[styles.cuerpo, { color: colores.texto }]}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  nota: {
    borderLeftWidth: 4,
    borderRadius: 12,
    padding: 14,
    gap: 6,
  },
  encabezado: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  titulo: {
    fontSize: 14,
    fontWeight: '800',
  },
  cuerpo: {
    fontSize: 14,
    lineHeight: 21,
  },
});
