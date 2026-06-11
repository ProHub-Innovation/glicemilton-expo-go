import { useRouter } from 'expo-router';
import React from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { AnimatedFloat } from '../../components/AnimatedElements';
import { useGame } from '@/context/GameContext';

export default function DashboardScreen() {
  const router = useRouter();

  const { state } = useGame();

  const navigateToGame = (gameName: string) => {
    // Usando o Alert nativo do React Native para evitar problemas de compatibilidade
    Alert.alert('Navegação', `Navegando para o módulo: ${gameName}`);
  };

  return (
    <ImageBackground
      source={require('../../assets/images/fundo_zoom.jpg')}
      style={styles.background}
      resizeMode="cover"
      imageStyle={{ transform: [{ scale: 1.08 }, { translateY: 15 }] }}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* PARTE SUPERIOR */}
        <View style={styles.topCard}>
          <View style={styles.cardHeader}>
            <View style={styles.glicemiaLabel}>
              <View style={styles.dropIcon} />
              <Text style={styles.cardTitle}>Glicemia</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={styles.progressFill} />
            </View>
          </View>

          <View style={styles.cardBody}>
            <View style={styles.valueRow}>
              <Text style={styles.glicemiaValue}>104</Text>
              <Text style={styles.glicemiaUnit}>mg/dL</Text>
            </View>
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreLabel}>Pontos</Text>
              <Text style={styles.scoreValue}>{state.totalPoints}</Text>
            </View>
          </View>
        </View>

        {/* PARTE INFERIOR */}
        <View style={styles.bottomSection}>
          <AnimatedFloat>
            <Image
              source={require('../../assets/images/Glicemilton feliz.png')}
              style={styles.characterImage}
              resizeMode="contain"
            />
          </AnimatedFloat>

          {/* GRID COM OS NOMES DE ARQUIVO CORRIGIDOS PARA O PADRÃO (SNAKE_CASE) */}
          <View style={styles.bottomGrid}>
            {/* LINHA 1 */}
            <View style={styles.gridRow}>
              <TouchableOpacity
                style={[styles.moduleButton, { width: '22%' }]}
                onPress={() => router.navigate('/modulos/exercicios')}
              >
                <Image
                  source={require('../../assets/images/icone_reduzir_os_riscos.png')}
                  style={styles.moduleIcon}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.moduleButton, { width: '22%' }]}
                onPress={() => navigateToGame('Adaptação Saudável')}
              >
                <Image
                  source={require('../../assets/images/icone_adaptacao_saudavel.png')}
                  style={styles.moduleIcon}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.moduleButton, { width: '22%' }]}
                onPress={() => navigateToGame('Comer Saudavelmente')}
              >
                <Image
                  source={require('../../assets/images/icone_comer_saudavelmente.png')}
                  style={styles.moduleIcon}
                />
              </TouchableOpacity>
            </View>

            {/* LINHA 2 */}
            <View style={styles.gridRow}>
              <TouchableOpacity
                style={[styles.moduleButton, { width: '22%' }]}
                onPress={() => navigateToGame('Tomar Medicamentos')}
              >
                <Image
                  source={require('../../assets/images/icone_tomar_medicamentos.png')}
                  style={styles.moduleIcon}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.moduleButton, { width: '22%' }]}
                onPress={() => navigateToGame('Resolver Problemas')}
              >
                <Image
                  source={require('../../assets/images/icone_resolver_problemas.png')}
                  style={styles.moduleIcon}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.moduleButton, { width: '24%' }]}
                onPress={() => navigateToGame('Vigiar Taxas')}
              >
                <Image
                  source={require('../../assets/images/icone_vigiar_taxas.png')}
                  style={styles.moduleIcon}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.moduleButton, { width: '22%' }]}
                onPress={() => navigateToGame('Atividade Física')}
              >
                <Image
                  source={require('../../assets/images/icone_atividade_fisica.png')}
                  style={styles.moduleIcon}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  background: { flex: 1, width: '100%', height: '100%' },
  safeArea: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
    justifyContent: 'space-between',
  },
  topCard: {
    backgroundColor: 'white',
    width: '85%',
    maxWidth: 350,
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  glicemiaLabel: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dropIcon: {
    width: 20,
    height: 20,
    backgroundColor: '#8DB863',
    borderRadius: 10,
    borderTopRightRadius: 2,
    transform: [{ rotate: '45deg' }],
  },
  cardTitle: { fontSize: 24, fontWeight: 'bold', color: '#6C5141' },
  progressBar: { flex: 1, height: 12, backgroundColor: '#E0E0E0', borderRadius: 6, marginLeft: 15 },
  progressFill: { width: '70%', height: '100%', backgroundColor: '#8DB863', borderRadius: 6 },
  cardBody: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  valueRow: { flexDirection: 'row', alignItems: 'baseline' },
  glicemiaValue: { fontSize: 48, fontWeight: '900', color: '#6C5141', lineHeight: 50 },
  glicemiaUnit: { fontSize: 18, fontWeight: 'bold', color: '#6C5141', marginLeft: 5 },
  scoreContainer: {
    alignItems: 'center',
    backgroundColor: '#F29C38',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
  },
  scoreLabel: { fontSize: 14, fontFamily: 'Chewy_400Regular', color: 'white' },
  scoreValue: { fontSize: 22, fontFamily: 'Chewy_400Regular', color: 'white' },
  bottomSection: { width: '100%', alignItems: 'center', justifyContent: 'flex-end' },
  characterImage: { width: 220, height: 270, marginBottom: 5 },
  bottomGrid: { width: '100%', alignItems: 'center', gap: 8, paddingHorizontal: 10 },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 9,
    width: '100%',
  },
  moduleButton: { aspectRatio: 1 },
  moduleIcon: { width: '100%', height: '100%', resizeMode: 'contain' },
});
