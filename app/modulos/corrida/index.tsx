import { Chewy_400Regular } from '@expo-google-fonts/chewy';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Image,
  ImageBackground,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import RunnerGame from '@/components/runner/RunnerGame';
import VictoryModal from '@/components/VictoryModal';
import { RUNNER_ASSETS, RUNNER_CONFIG } from '@/constants/runner';

type ScreenState =
  | 'CONCEPT'
  | 'ASK_INSTRUCTIONS'
  | 'INST_STEP_1'
  | 'INST_STEP_2'
  | 'INST_STEP_3'
  | 'PLAYING';

export default function CorridaScreen() {
  const [fontsLoaded] = useFonts({ Chewy_400Regular });
  const insets = useSafeAreaInsets();

  const [currentScreen, setCurrentScreen] = useState<ScreenState>('CONCEPT');
  const [score, setScore] = useState<number>(0);
  const [health, setHealth] = useState<number>(100);
  const [timeLeft, setTimeLeft] = useState<number>(RUNNER_CONFIG.GAME_DURATION_SEC);
  const [gameStatus, setGameStatus] = useState<'PLAYING' | 'LOST' | 'WON'>('PLAYING');
  const [endReason, setEndReason] = useState<'HEALTH' | 'TIME' | null>(null);

  // A estratégia da key impede o estado antigo de vazar no re-render
  const [gameKey, setGameKey] = useState<number>(0);

  // Monitor Central do Tempo Globals do Jogo
  useEffect(() => {
    if (currentScreen !== 'PLAYING' || gameStatus !== 'PLAYING') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setEndReason('TIME');
          setGameStatus('WON');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStatus, currentScreen]);

  const handleHUDUpdate = useCallback((newScore: number, newHealth: number) => {
    setScore(newScore);
    setHealth(newHealth);
  }, []);

  const handleGameOver = useCallback((reason: 'HEALTH' | 'TIME') => {
    setEndReason(reason);
    setGameStatus('LOST');
  }, []);

  const resetGame = () => {
    setScore(0);
    setHealth(100);
    setTimeLeft(RUNNER_CONFIG.GAME_DURATION_SEC);
    setEndReason(null);
    setGameStatus('PLAYING');
    setCurrentScreen('PLAYING');
    setGameKey((prev) => prev + 1);
  };

  if (!fontsLoaded) return null;

  // --- 1. Tela Conceitual ---
  // 1. Tela Conceitual: Praticar Exercícios
  if (currentScreen === 'CONCEPT') {
    return (
      <ImageBackground
        source={RUNNER_ASSETS.bgLandscape}
        style={styles.fullscreenBg}
        imageStyle={{ transform: [{ scale: 1.08 }, { translateY: 15 }] }}
        resizeMode="cover"
      >
        {/* O cardAnchor centraliza o conteúdo e serve de base absoluta para o botão de Home */}
        <View style={styles.cardAnchor}>
          {/* Botão de Home Flutuante na quina superior esquerda do Card */}
          <View style={styles.introHomeBtn}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="home" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.transparentOverlayCard}>
            <Text style={styles.introTitle}>Praticar exercícios</Text>

            <Image
              source={RUNNER_ASSETS.antRunningIcon}
              style={styles.antIconImage}
              resizeMode="contain"
            />

            <Text style={styles.introText}>
              A atividade física faz muito bem para a saúde, controlando o diabetes, protegendo o
              coração, controlando o peso, fortalecendo o corpo e a mente.
            </Text>

            <TouchableOpacity
              style={styles.brownCircleBtn}
              onPress={() => setCurrentScreen('ASK_INSTRUCTIONS')}
              activeOpacity={0.8}
            >
              <Ionicons name="chevron-forward" size={36} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    );
  }
  // --- 2. Tela Decisória ---
  if (currentScreen === 'ASK_INSTRUCTIONS') {
    return (
      <ImageBackground
        source={RUNNER_ASSETS.bgBlueInstructions}
        style={styles.fullscreenBg}
        imageStyle={{ transform: [{ scale: 1.08 }, { translateY: 15 }] }}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.introContainer}>
          <Text style={styles.questionTitle}>Precisa de instruções?</Text>

          <View style={[styles.introHomeBtn, { position: 'absolute', top: 45, left: 20 }]}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="home" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.decisionRow}>
            <TouchableOpacity
              style={[styles.thumbBtn, { backgroundColor: '#689F38', borderColor: '#DCEDC8' }]}
              onPress={() => setCurrentScreen('INST_STEP_1')}
              activeOpacity={0.8}
            >
              <Ionicons name="thumbs-up" size={50} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.thumbBtn, { backgroundColor: '#D32F2F', borderColor: '#FFCDD2' }]}
              onPress={() => setCurrentScreen('PLAYING')}
              activeOpacity={0.8}
            >
              <Ionicons name="thumbs-down" size={50} color="white" />
            </TouchableOpacity>
          </View>

          <Image
            source={RUNNER_ASSETS.antHappy}
            style={styles.antHappyImage}
            resizeMode="contain"
          />
        </SafeAreaView>
      </ImageBackground>
    );
  }

  // --- 3. Passo 1 ---
  if (currentScreen === 'INST_STEP_1') {
    return (
      <ImageBackground
        source={RUNNER_ASSETS.bgBlueInstructions}
        style={styles.fullscreenBg}
        imageStyle={{ transform: [{ scale: 1.12 }] }}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.instructionContainer}>
          <View style={[styles.introHomeBtn, { position: 'absolute', top: 65, left: 15 }]}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="home" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
          <View style={styles.instructionCard}>
            <Text style={styles.instructionHeader}>Instruções:</Text>
            <View style={styles.comparisonRow}>
              <View style={styles.comparisonItem}>
                <Image
                  source={RUNNER_ASSETS.iconCelular}
                  style={styles.itemIcon}
                  resizeMode="contain"
                />
                <MaterialCommunityIcons name="close-circle" size={38} color="#F44336" />
              </View>
              <View style={styles.comparisonItem}>
                <Image
                  source={RUNNER_ASSETS.iconCorda}
                  style={styles.itemIcon}
                  resizeMode="contain"
                />
                <MaterialCommunityIcons name="check-circle" size={38} color="#4CAF50" />
              </View>
            </View>
          </View>

          <View style={styles.characterBottomRight} pointerEvents="none">
            <Image
              source={RUNNER_ASSETS.antExplaining}
              style={styles.characterLarge}
              resizeMode="contain"
            />
          </View>

          <TouchableOpacity
            style={[styles.homeButton, styles.navButtonLeftFloat]}
            onPress={() => setCurrentScreen('INST_STEP_2')}
            activeOpacity={0.8}
          >
            <Ionicons name="chevron-forward" size={36} color="white" />
          </TouchableOpacity>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  // --- 4. Passo 2 ---
  if (currentScreen === 'INST_STEP_2') {
    return (
      <ImageBackground
        source={RUNNER_ASSETS.bgBlueInstructions}
        style={styles.fullscreenBg}
        imageStyle={{ transform: [{ scale: 1.12 }] }}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.instructionContainer}>
          <View style={[styles.introHomeBtn, { position: 'absolute', top: 65, left: 15 }]}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="home" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
          <View style={styles.instructionCard}>
            <Text style={styles.instructionHeader}>Instruções:</Text>
            <View style={styles.comparisonRow}>
              <View style={styles.comparisonItem}>
                <Image
                  source={RUNNER_ASSETS.iconSofa}
                  style={styles.itemIcon}
                  resizeMode="contain"
                />
                <MaterialCommunityIcons name="close-circle" size={38} color="#F44336" />
              </View>
              <View style={styles.comparisonItem}>
                <Image
                  source={RUNNER_ASSETS.iconTenis}
                  style={styles.itemIcon}
                  resizeMode="contain"
                />
                <MaterialCommunityIcons name="check-circle" size={38} color="#4CAF50" />
              </View>
            </View>
          </View>

          <View style={styles.characterBottomRight} pointerEvents="none">
            <Image
              source={RUNNER_ASSETS.antExplaining}
              style={styles.characterLarge}
              resizeMode="contain"
            />
          </View>

          <TouchableOpacity
            style={[styles.homeButton, styles.navButtonLeftFloat]}
            onPress={() => setCurrentScreen('INST_STEP_3')}
            activeOpacity={0.8}
          >
            <Ionicons name="chevron-forward" size={36} color="white" />
          </TouchableOpacity>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  // --- 5. Passo 3 ---
  if (currentScreen === 'INST_STEP_3') {
    return (
      <ImageBackground
        source={RUNNER_ASSETS.bgBlueInstructions}
        style={styles.fullscreenBg}
        imageStyle={{ transform: [{ scale: 1.12 }] }}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.instructionContainer}>
          <View style={[styles.introHomeBtn, { position: 'absolute', top: 65, left: 15 }]}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="home" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
          <View style={styles.instructionCard}>
            <Text style={styles.instructionHeader}>Instruções:</Text>
            <View style={styles.comparisonRow}>
              <View style={styles.comparisonItem}>
                <Image
                  source={RUNNER_ASSETS.iconCama}
                  style={styles.itemIcon}
                  resizeMode="contain"
                />
                <MaterialCommunityIcons name="close-circle" size={38} color="#F44336" />
              </View>
              <View style={styles.comparisonItem}>
                <Image
                  source={RUNNER_ASSETS.iconBicicleta}
                  style={styles.itemIcon}
                  resizeMode="contain"
                />
                <MaterialCommunityIcons name="check-circle" size={38} color="#4CAF50" />
              </View>
            </View>
          </View>

          <View style={styles.characterBottomRight} pointerEvents="none">
            <Image
              source={RUNNER_ASSETS.antExplaining}
              style={styles.characterLarge}
              resizeMode="contain"
            />
          </View>

          <TouchableOpacity
            style={[
              styles.homeButton,
              styles.navButtonLeftFloat,
              { backgroundColor: '#8DB863', borderColor: '#DCEDC8', borderWidth: 4 },
            ]}
            onPress={() => setCurrentScreen('PLAYING')}
            activeOpacity={0.8}
          >
            <Ionicons name="play" size={36} color="white" style={{ marginLeft: 4 }} />
          </TouchableOpacity>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  // --- TELA DE JOGO ATIVA ---
  if (currentScreen === 'PLAYING') {
    return (
      <ImageBackground
        source={RUNNER_ASSETS.bgdirtroad}
        style={{ flex: 1, width: '100%', height: '100%' }}
        imageStyle={{ transform: [{ scale: 1.08 }, { translateY: 15 }] }}
        resizeMode="cover"
      >
        <View style={[styles.introHomeBtn, { position: 'absolute', top: 110, left: 15 }]}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="home" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
        <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent', paddingTop: insets.top }}>
          {/* HUD Integrado no topo de forma translúcida */}
          <View style={styles.hudOverlay}>
            <View style={styles.hudRow}>
              <Text style={styles.scoreText}>Pts: {score}</Text>
              <View style={styles.timeBadge}>
                <MaterialCommunityIcons name="clock-outline" size={18} color="#FFF" />
                <Text style={styles.timeText}>{timeLeft}s</Text>
              </View>
            </View>

            <View style={styles.healthBarOutline}>
              <View style={[styles.healthBarFill, { width: `${health}%` }]} />
            </View>
          </View>

          <RunnerGame
            key={gameKey}
            gameStatus={gameStatus}
            currentHealth={health}
            onUpdateHUD={handleHUDUpdate}
            onGameOver={handleGameOver}
          />

          {/* Modal de Derrota */}
          <Modal visible={gameStatus === 'LOST'} transparent animationType="slide">
            <View style={styles.modalOverlay}>
              <View style={styles.modalCard}>
                <View style={[styles.introHomeBtn, { position: 'absolute', top: -10, left: -5 }]}>
                  <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="home" size={24} color="#FFF" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.modalEmoji}>💥</Text>
                <Text style={styles.modalTitle}>Fim de Jogo!</Text>
                <Text style={styles.modalMessage}>
                  Sua energia acabou! Cuidado com o excesso de doces e o sedentarismo no cotidiano.
                </Text>
                <View style={styles.modalActions}>
                  <TouchableOpacity style={styles.modalBtnPrimary} onPress={resetGame}>
                    <Text style={styles.modalBtnText}>Tentar Novamente</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalBtnSecondary}
                    onPress={() => router.replace('/(tabs)/onboarding')}
                  >
                    <Text style={styles.modalBtnSecondaryText}>Sair para o Menu</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          {/* Modal de Vitória — padrão do projeto */}
          <VictoryModal visible={gameStatus === 'WON'} pointsEarned={score} moduleName="Corrida" />
        </SafeAreaView>
      </ImageBackground>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  fullscreenBg: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#6C5141',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  navButtonLeftFloat: {
    position: 'absolute',
    bottom: 40,
    left: 30,
    zIndex: 20,
  },
  antIconImage: {
    width: 130,
    height: 130,
    marginBottom: 24,
  },
  introContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    width: '100%',
  },
  questionTitle: {
    fontFamily: 'Chewy_400Regular',
    fontSize: 36,
    color: 'white',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    marginBottom: 10,
  },
  decisionRow: {
    flexDirection: 'row',
    gap: 30,
    marginTop: 20,
    justifyContent: 'center',
    zIndex: 5,
  },
  thumbBtn: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 5,
    elevation: 5,
  },
  antHappyImage: {
    width: 320,
    height: 400,
    marginTop: 20,
  },
  instructionContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 60,
    width: '100%',
  },
  instructionCard: {
    backgroundColor: 'white',
    alignSelf: 'center',
    width: '90%',
    maxWidth: 380,
    borderRadius: 20,
    padding: 20,
    elevation: 8,
    marginTop: 10,
  },
  instructionHeader: {
    fontSize: 30,
    fontFamily: 'Chewy_400Regular',
    color: '#6C5141',
    marginBottom: 15,
    textAlign: 'center',
  },
  comparisonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingVertical: 10,
  },
  comparisonItem: {
    alignItems: 'center',
    gap: 12,
  },
  itemIcon: {
    width: 80,
    height: 160,
    marginBottom: 6,
  },
  characterBottomRight: {
    position: 'absolute',
    bottom: -15,
    right: -35,
    zIndex: 1,
  },
  characterLarge: {
    width: 320,
    height: 400,
  },
  hudOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: 12,
    borderRadius: 16,
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  hudRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  scoreText: {
    fontFamily: 'Chewy_400Regular',
    fontSize: 24,
    color: '#FFF',
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 4,
  },
  timeText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  healthBarOutline: {
    width: '100%',
    height: 12,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#FFF',
  },
  healthBarFill: {
    height: '100%',
    backgroundColor: '#E57373',
    borderRadius: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: '100%',
    maxWidth: 340,
    padding: 24,
    borderRadius: 24,
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 4,
    borderColor: '#6C5141',
    elevation: 10,
  },
  modalEmoji: {
    fontSize: 56,
    marginBottom: 8,
  },
  modalTitle: {
    fontFamily: 'Chewy_400Regular',
    fontSize: 32,
    color: '#6C5141',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
    fontWeight: '500',
  },
  modalActions: {
    width: '100%',
    gap: 12,
  },
  modalBtnPrimary: {
    backgroundColor: '#6C5141',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalBtnText: {
    color: '#FFF',
    fontSize: 18,
    fontFamily: 'Chewy_400Regular',
  },
  modalBtnSecondary: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#6C5141',
  },
  modalBtnSecondaryText: {
    color: '#6C5141',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardAnchor: {
    width: '100%',
    maxWidth: 340,
    position: 'relative',
  },
  transparentOverlayCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)', // Fundo translúcido do padrão
    borderRadius: 24,
    paddingVertical: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
    elevation: 8,
  },
  introHomeBtn: {
    position: 'absolute',
    top: -15,
    left: -10,
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#8B5A2B', // Marrom original do projeto
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
    zIndex: 99,
  },
  introTitle: {
    fontFamily: 'Chewy_400Regular',
    fontSize: 34,
    color: '#6D4C41',
    textAlign: 'center',
    marginBottom: 12,
  },
  introText: {
    fontSize: 18,
    color: '#5D4037',
    textAlign: 'center',
    lineHeight: 26,
    fontWeight: '600',
    marginBottom: 24,
  },
  brownCircleBtn: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#6D4C41',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
});
