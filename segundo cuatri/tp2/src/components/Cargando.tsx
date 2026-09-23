import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';

interface Props {
  mensaje?: string;
}

export default function Cargando({ mensaje = 'Cargando...' }: Props) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#ef4444" />
      <Text style={styles.texto}>{mensaje}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  texto: {
    marginTop: 10,
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
});