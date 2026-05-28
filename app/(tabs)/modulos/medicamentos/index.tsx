import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function EmBreve() {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🚧</Text>
      <Text style={styles.title}>Em breve</Text>
      <Text style={styles.sub}>Este módulo está sendo desenvolvido</Text>
      <TouchableOpacity style={styles.btn} onPress={() => router.back()}>
        <Text style={styles.btnText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAFAFA',
    gap: 12,
  },
  emoji: { fontSize: 48 },
  title: { fontSize: 22, fontWeight: '800', color: '#1A1A1A' },
  sub: { fontSize: 14, color: '#888' },
  btn: {
    marginTop: 8,
    backgroundColor: '#FF4B4B',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  btnText: { color: '#fff', fontWeight: '700' },
});
