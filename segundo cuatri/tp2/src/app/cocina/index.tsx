import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';

export default function CocinaScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>¡La ruta de la cocina existe!</Text>
      <Pressable onPress={() => router.replace('/')} style={{ marginTop: 20, padding: 15, backgroundColor: '#3b82f6', borderRadius: 8 }}>
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Volver al inicio</Text>
      </Pressable>
    </View>
  );
}