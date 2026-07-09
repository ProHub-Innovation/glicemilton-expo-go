import { Chewy_400Regular } from '@expo-google-fonts/chewy';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFonts as useExpoFonts } from 'expo-font';
import { router } from 'expo-router';
import React, { useEffect, useReducer, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { BoardTrail } from '@/components/ui/modulos/quiz/BoardTrail';
import { DiceButton } from '@/components/ui/modulos/quiz/DiceButton';
import { QuizModal } from '@/components/ui/modulos/quiz/QuizModal';
import VictoryModal from '@/components/VictoryModal';
import { QUIZ_QUESTIONS, TOTAL_BOARD_SQUARES } from '../../../constants/quiz';
import { useGame } from '../../../context/GameContext';

interface QuizScreenState {
  position: number;
  lastRoll: number | null;
  isLocked: boolean;
  quizVisible: boolean;
  phase: 'intro' | 'playing' | 'finished';
}

type QuizScreenAction =
  | { type: 'START_GAME' }
  | { type: 'ROLL_DICE'; payload: number }
  | { type: 'ANSWER_CORRECT' }
  | { type: 'ANSWER_WRONG' }
  | { type: 'RESET' };

const INITIAL_SCREEN_STATE: QuizScreenState = {
  position: 0,
  lastRoll: null,
  isLocked: false,
  quizVisible: false,
  phase: 'intro',
};

function quizScreenReducer(state: QuizScreenState, action: QuizScreenAction): QuizScreenState {
  switch (action.type) {
    case 'START_GAME':
      return { ...state, phase: 'playing' };

    case 'ROLL_DICE': {
      const steps = action.payload;
      const rawNext = state.position + steps;
      const nextPosition = Math.min(rawNext, TOTAL_BOARD_SQUARES - 1);

      return {
        ...state,
        lastRoll: steps,
        isLocked: true,
        quizVisible: true,
        position: nextPosition,
        phase: 'playing',
      };
    }

    case 'ANSWER_CORRECT': {
      const isFinished = state.position === TOTAL_BOARD_SQUARES - 1;
      return {
        ...state,
        isLocked: false,
        quizVisible: false,
        phase: isFinished ? 'finished' : 'playing',
      };
    }

    case 'ANSWER_WRONG': {
      return {
        ...state,
        quizVisible: false,
        isLocked: true,
      };
    }

    case 'RESET':
      return { ...INITIAL_SCREEN_STATE, phase: 'playing' };

    default:
      return state;
  }
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function QuizScreen() {
  const [sessionScore, setSessionScore] = useState(0);
  const [state, dispatch] = useReducer(quizScreenReducer, INITIAL_SCREEN_STATE);
  const { addPoints } = useGame();

  const [showIntroBtn, setShowIntroBtn] = useState(false);
  const [hasFailedQuestion, setHasFailedQuestion] = useState(false);

  const [fontsLoaded] = useExpoFonts({
    Chewy_400Regular,
  });

  const homePulseAnim = useRef(new Animated.Value(1)).current;
  const nextBtnOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(homePulseAnim, { toValue: 1.1, duration: 800, useNativeDriver: true }),
        Animated.timing(homePulseAnim, { toValue: 1.0, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, [homePulseAnim]);

  useEffect(() => {
    if (state.phase === 'intro') {
      nextBtnOpacity.setValue(0);
      setShowIntroBtn(false);

      const timer = setTimeout(() => {
        setShowIntroBtn(true);
        Animated.timing(nextBtnOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }).start();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [state.phase, nextBtnOpacity]);

  function handleRoll(value: number) {
    dispatch({ type: 'ROLL_DICE', payload: value });
  }

  function handleAnswer(isCorrect: boolean) {
    if (isCorrect) {
      const isFinished = state.position === TOTAL_BOARD_SQUARES - 1;
      const newScore = sessionScore + 10;
      setSessionScore(newScore);
      setHasFailedQuestion(false);

      if (isFinished) {
        addPoints('exercicios', newScore);
      }

      dispatch({ type: 'ANSWER_CORRECT' });
    } else {
      dispatch({ type: 'ANSWER_WRONG' });
      setHasFailedQuestion(true);
    }
  }

  let questionIndex = 0;
  if (state.position === TOTAL_BOARD_SQUARES - 1) {
    questionIndex = QUIZ_QUESTIONS.length - 1;
  } else if (QUIZ_QUESTIONS.length > 1) {
    questionIndex = Math.max(0, (state.position - 1) % (QUIZ_QUESTIONS.length - 1));
  }

  const currentQuestion = QUIZ_QUESTIONS[questionIndex];

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6D4C41" />
      </View>
    );
  }

  if (state.phase === 'intro') {
    return (
      <View style={styles.introWrapper}>
        <ImageBackground
          source={require('@/assets/images/background.jpg')}
          style={styles.introBackground}
          resizeMode="cover"
        >
          <View style={styles.introContainerClean}>
            <View style={styles.cardAnchor}>
              <AnimatedTouchableOpacity
                style={[styles.introHomeBtn, { transform: [{ scale: homePulseAnim }] }]}
                onPress={() => {
                  dispatch({ type: 'RESET' });
                  router.back();
                }}
              >
                <MaterialCommunityIcons name="home" size={22} color="#fff" />
              </AnimatedTouchableOpacity>

              <View style={styles.introCard}>
                <Text style={styles.introTitle}>Reduzir os riscos</Text>

                <MaterialCommunityIcons
                  name="alert"
                  size={96}
                  color="#FBC02D"
                  style={styles.alertIcon}
                />

                <Text style={styles.introText}>
                  A gestão de riscos é complementada pela educação, por mudanças no estilo de vida e
                  pelo monitoramento regular (exames e aspectos emocionais).
                </Text>

                {showIntroBtn && (
                  <Animated.View style={{ opacity: nextBtnOpacity }}>
                    <TouchableOpacity
                      style={styles.introCircleBtn}
                      onPress={() => dispatch({ type: 'START_GAME' })}
                    >
                      <MaterialCommunityIcons name="chevron-right" size={38} color="#fff" />
                    </TouchableOpacity>
                  </Animated.View>
                )}
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }

  if (state.phase === 'finished') {
    return (
      <ImageBackground
        source={require('@/assets/images/background.jpg')}
        style={styles.container}
        resizeMode="cover"
      >
        <VictoryModal visible={true} pointsEarned={sessionScore} moduleName="Reduzir os Riscos" />
      </ImageBackground>
    );
  }

  return (
    <View style={styles.gameContainer}>
      <View style={styles.gameOverlay}>
        <View style={styles.floatingHeaderOnlyHome}>
          <AnimatedTouchableOpacity
            style={[styles.gameHomeBtn, { transform: [{ scale: homePulseAnim }] }]}
            onPress={() => {
              dispatch({ type: 'RESET' });
              router.back();
            }}
          >
            <MaterialCommunityIcons name="home" size={22} color="#fff" />
          </AnimatedTouchableOpacity>
        </View>

        <View style={styles.staticBoardContainer}>
          <BoardTrail currentPosition={state.position} />
        </View>

        {hasFailedQuestion && (
          <View style={styles.failureOverlay}>
            <View style={styles.failureCard}>
              <MaterialCommunityIcons name="close-circle" size={54} color="#D32F2F" />
              <Text style={styles.failureText}>Resposta Incorreta!</Text>

              <TouchableOpacity
                style={styles.btnResetGame}
                onPress={() => {
                  setHasFailedQuestion(false);
                  setSessionScore(0);
                  dispatch({ type: 'RESET' });
                }}
              >
                <Text style={styles.btnResetText}>Recomeçar Minijogo</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.btnExitGame}
                onPress={() => {
                  dispatch({ type: 'RESET' });
                  router.back();
                }}
              >
                <Text style={styles.btnExitText}>Voltar para Tela Inicial</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ✅ O SEGREDO ESTÁ AQUI: pointerEvents="box-none" permite clicar no tabuleiro, mas posiciona o dado perfeitamente */}
        <View style={styles.absoluteDiceContainer} pointerEvents="box-none">
          <DiceButton lastRoll={state.lastRoll} isLocked={state.isLocked} onRoll={handleRoll} />
        </View>
      </View>

      {state.quizVisible && currentQuestion && (
        <QuizModal visible={state.quizVisible} question={currentQuestion} onAnswer={handleAnswer} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#222',
  },
  gameContainer: {
    flex: 1,
    backgroundColor: '#8B5A2B',
  },
  gameOverlay: {
    flex: 1,
    paddingTop: 48,
    position: 'relative',
  },
  floatingHeaderOnlyHome: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 60,
    zIndex: 50,
  },
  gameHomeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#66401dbe',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
    elevation: 4,
  },
  staticBoardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  absoluteDiceContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingBottom: '8%',
    paddingRight: '6%',
    zIndex: 99,
  },
  introWrapper: {
    flex: 1,
    backgroundColor: '#222',
  },
  introBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  introContainerClean: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
  },
  cardAnchor: {
    width: '100%',
    maxWidth: 340,
    position: 'relative',
  },
  introCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    borderRadius: 24,
    paddingVertical: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
    width: '100%',
    elevation: 8,
  },
  introHomeBtn: {
    position: 'absolute',
    top: -15,
    left: -10,
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#8B5A2B',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
    zIndex: 99,
    elevation: 9,
  },
  introTitle: {
    fontFamily: 'Chewy_400Regular',
    fontSize: 34,
    color: '#6D4C41',
    textAlign: 'center',
    marginBottom: 12,
    marginTop: 15,
  },
  alertIcon: {
    marginBottom: 20,
  },
  introText: {
    fontSize: 16,
    color: '#5D4037',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '600',
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  failureOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  failureCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    width: '80%',
    maxWidth: 300,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    gap: 12,
    elevation: 10,
  },
  failureText: {
    fontFamily: 'Chewy_400Regular',
    fontSize: 22,
    color: '#333',
    marginBottom: 8,
  },
  btnResetGame: {
    backgroundColor: '#6D4C41',
    width: '100%',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnResetText: {
    color: '#fff',
    fontFamily: 'Chewy_400Regular',
    fontSize: 16,
  },
  btnExitGame: {
    borderWidth: 1.5,
    borderColor: '#6D4C41',
    width: '100%',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnExitText: {
    color: '#6D4C41',
    fontFamily: 'Chewy_400Regular',
    fontSize: 16,
  },
  introCircleBtn: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#6D4C41',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
});
