import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const modules = [
  {
    id: 'prato',
    emoji: '🥗',
    title: 'Monte seu Prato',
    description: 'Arraste alimentos e calcule carboidratos',
    color: '#4CAF50',
    bg: '#E8F5E9',
  },
  {
    id: 'exercicios',
    emoji: '🏃',
    title: 'Praticar Exercícios',
    description: 'Descubra os benefícios da atividade física',
    color: '#2196F3',
    bg: '#E3F2FD',
  },
  {
    id: 'glicemia',
    emoji: '💉',
    title: 'Vigiar as Taxas',
    description: 'Simule a aferição e interprete resultados',
    color: '#9C27B0',
    bg: '#F3E5F5',
  },
  {
    id: 'adaptacao',
    emoji: '🧩',
    title: 'Adaptação Saudável',
    description: 'Ajude o Glicemilton a encontrar a saída',
    color: '#FF9800',
    bg: '#FFF3E0',
  },
  {
    id: 'medicamentos',
    emoji: '💊',
    title: 'Tomar Medicamentos',
    description: 'Aprenda sobre insulina e aplicação',
    color: '#F44336',
    bg: '#FFEBEE',
  },
  {
    id: 'riscos',
    emoji: '⚠️',
    title: 'Reduzir Riscos',
    description: 'Quiz sobre controle glicêmico',
    color: '#607D8B',
    bg: '#ECEFF1',
  },
];

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Olá! 👋</Text>
        <Text style={styles.title}>O que vamos{'\n'}aprender hoje?</Text>
      </View>

      <View style={styles.glicemia}>
        <Text style={styles.glicemiaLabel}>Glicemia atual</Text>
        <Text style={styles.glicemiaValue}>
          104 <Text style={styles.glicemiaUnit}>mg/dL</Text>
        </Text>
        <Text style={styles.glicemiaStatus}>✅ Na meta</Text>
      </View>

      <Text style={styles.sectionTitle}>Módulos</Text>

      <View style={styles.grid}>
        {modules.map((mod) => (
          <TouchableOpacity
            key={mod.id}
            style={[styles.card, { backgroundColor: mod.bg }]}
            onPress={() => router.push(`/(tabs)/${mod.id}` as any)}
            activeOpacity={0.8}
          >
            <Text style={styles.cardEmoji}>{mod.emoji}</Text>
            <Text style={[styles.cardTitle, { color: mod.color }]}>{mod.title}</Text>
            <Text style={styles.cardDesc}>{mod.description}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.disclaimer}>⚕️ Conteúdo educativo · Não substitui orientação médica</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  greeting: {
    fontSize: 16,
    color: '#888',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1A1A',
    letterSpacing: -0.5,
    lineHeight: 34,
  },
  glicemia: {
    backgroundColor: '#FF4B4B',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  glicemiaLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    marginBottom: 4,
  },
  glicemiaValue: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '800',
  },
  glicemiaUnit: {
    fontSize: 16,
    fontWeight: '400',
  },
  glicemiaStatus: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    width: '47%',
    borderRadius: 16,
    padding: 16,
    gap: 6,
  },
  cardEmoji: {
    fontSize: 28,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 18,
  },
  cardDesc: {
    fontSize: 11,
    color: '#666',
    lineHeight: 15,
  },
  disclaimer: {
    textAlign: 'center',
    fontSize: 11,
    color: '#aaa',
    marginTop: 24,
  },
});
