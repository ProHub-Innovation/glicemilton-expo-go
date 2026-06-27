import { useGame } from '@/context/GameContext';
import { Chewy_400Regular } from '@expo-google-fonts/chewy';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFonts as useExpoFonts } from 'expo-font';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  FadeIn,
  ZoomIn,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ==========================================
// 1. CONFIGURAÇÕES DA MATRIZ POR BORDAS (9x9)
// ==========================================
// "T" = Parede em Cima | "B" = Parede Em Baixo
// "L" = Parede na Esquerda | "R" = Parede na Direita
// "0" = Caminho totalmente aberto

const INITIAL_MAZE = [
  ['EXIT', 'T', 'TB_SUGAR', 'TR', 'TL', 'TR', 'TL', 'TB', 'TR'], // Linha 0
  ['LRB', 'LR', 'LRT', 'LB', 'BR', 'LB', 'BR', 'LRT', 'LR'], // Linha 1
  ['LT_SUGAR', 'B', 'R', 'LT', 'TR', 'LT', 'BT', 'R_SUGAR', 'LR'], // Linha 2
  ['LB', 'TR', 'LB', 'BR', 'LB', 'BR', 'LTR', 'LBR', 'LR'], // Linha 3
  ['LT', 'B', 'T', 'TRB', 'LT', 'T', 'R', 'LT', 'BR'], // Linha 4
  ['LB', 'TR', 'L', 'TB', 'BR_SUGAR', 'LR', 'LR', 'LB', 'TR'], // Linha 5
  ['LT', 'BR', 'LB', 'TR', 'LTR', 'LR', 'LB', 'TRB', 'LR'], // Linha 6
  ['LB', 'TR', 'BLT', 'B', 'R', 'LB', 'BT', 'RT', 'LBR_SUGAR'], // Linha 7
  ['BLT', 'B_SUGAR', 'BT', 'BTR', 'BL', 'BT', 'TBR', 'BL', 'BRT'], // Linha 8
];

const START_ROW = 8;
const START_COL = 8;

const MAZE_CONTAINER_SIZE = SCREEN_WIDTH - 40;
const GRID_SIZE = INITIAL_MAZE[0].length;
const CELL_SIZE = MAZE_CONTAINER_SIZE / GRID_SIZE;

export default function LabirintoScreen() {
  const [phase, setPhase] = useState<'intro' | 'game' | 'finished'>('intro');
  const [mazeMap, setMazeMap] = useState<string[][]>(INITIAL_MAZE);
  const [playerPos, setPlayerPos] = useState({ row: START_ROW, col: START_COL });
  const [score, setScore] = useState(0);
  const [hasWon, setHasWon] = useState(false);
  const [showIntroBtn, setShowIntroBtn] = useState(false);

  const insets = useSafeAreaInsets();
  const [fontsLoaded] = useExpoFonts({ Chewy_400Regular });

  const { addPoints } = useGame();

  const pulseAnim = useSharedValue(1);

  useEffect(() => {
    pulseAnim.value = withRepeat(
      withSequence(
        withSpring(1.1, { damping: 2, stiffness: 80 }),
        withSpring(1.0, { damping: 2, stiffness: 80 })
      ),
      -1,
      true
    );
  }, []);

  const animatedPulseStyle = useAnimatedStyle(() => {
    return { transform: [{ scale: pulseAnim.value }] };
  });

  useEffect(() => {
    if (phase === 'intro') {
      const timer = setTimeout(() => setShowIntroBtn(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  if (!fontsLoaded) return null;

  const movePlayer = (direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
    if (hasWon) return;

    const currentCellWalls = mazeMap[playerPos.row][playerPos.col];

    // 🔥 COLISÃO POR BORDA: Bloqueia se a célula atual tiver a parede na direção do clique
    if (direction === 'UP' && currentCellWalls.includes('T')) return;
    if (direction === 'DOWN' && currentCellWalls.includes('B')) return;
    if (direction === 'LEFT' && currentCellWalls.includes('L')) return;
    if (direction === 'RIGHT' && currentCellWalls.includes('R')) return;

    let nextRow = playerPos.row;
    let nextCol = playerPos.col;
    if (direction === 'UP') nextRow -= 1;
    if (direction === 'DOWN') nextRow += 1;
    if (direction === 'LEFT') nextCol -= 1;
    if (direction === 'RIGHT') nextCol += 1;

    if (nextRow < 0 || nextRow >= mazeMap.length || nextCol < 0 || nextCol >= mazeMap[0].length)
      return;

    // Atualiza a posição do Glicemilton
    setPlayerPos({ row: nextRow, col: nextCol });

    // Checa itens na nova célula usando strings
    const nextCell = mazeMap[nextRow][nextCol];

    if (nextCell.includes('SUGAR')) {
      setScore((prev) => prev + 10);
      setMazeMap((prevMap) => {
        const newMap = prevMap.map((row) => [...row]);
        // Remove apenas a palavra SUGAR, mantendo as paredes intactas!
        newMap[nextRow][nextCol] = nextCell.replace('_SUGAR', '');
        return newMap;
      });
    }

    if (nextCell.includes('EXIT')) {
      setHasWon(true);
      addPoints('labirinto', score);
      setPhase('finished');
      return;
    }
  };

  const reiniciarJogo = () => {
    setMazeMap(INITIAL_MAZE.map((row) => [...row]));
    setPlayerPos({ row: START_ROW, col: START_COL });
    setScore(0);
    setHasWon(false);
    setPhase('game');
  };

  // ==========================================
  // RENDERIZAÇÃO: FASE INTRODUÇÃO
  // ==========================================

  if (phase === 'intro') {
    return (
      <ImageBackground
        source={require('@/assets/images/background.jpg')}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.introContainerClean}>
          <View style={styles.cardAnchor}>
            <Animated.View style={[styles.introHomeBtn, animatedPulseStyle]}>
              <TouchableOpacity onPress={() => router.back()}>
                <MaterialCommunityIcons name="home" size={24} color="#fff" />
              </TouchableOpacity>
            </Animated.View>

            <View style={styles.introCard}>
              <Text style={styles.introTitle}>Adaptação saudável</Text>

              <Image
                source={require('@/assets/images/icone_adaptacao_saudavel.png')}
                style={styles.introIcon}
                resizeMode="contain"
              />

              <Text style={styles.introText}>
                Atitudes positivas fazem com que a convivência com o diabetes seja mais tranquila,
                reduzindo complicações e contribuindo para melhores resultados de bem-estar.
              </Text>

              {showIntroBtn && (
                <Animated.View entering={FadeIn.duration(800)} style={animatedPulseStyle}>
                  <TouchableOpacity style={styles.introCircleBtn} onPress={() => setPhase('game')}>
                    <MaterialCommunityIcons name="chevron-right" size={38} color="#fff" />
                  </TouchableOpacity>
                </Animated.View>
              )}
            </View>
          </View>
        </View>
      </ImageBackground>
    );
  }

  // FASE 2: TELA FINAL DE PARABÉNS (FINISHED)
  if (phase === 'finished') {
    return (
      <ImageBackground
        source={require('@/assets/images/background.jpg')}
        style={styles.finishedContainer}
        resizeMode="cover"
      >
        <Animated.View entering={FadeIn} style={styles.finishedCard}>
          {/* ÍCONE DO TROFÉU IGUAL AOS OUTROS MÓDULOS */}
          <Text style={{ fontSize: 50 }}>🏆</Text>

          <Text style={styles.finishedTitle}>Você chegou ao fim!</Text>
          <Text style={styles.finishedSub}>Açúcares Coletados: {score} pts</Text>

          <TouchableOpacity style={styles.btnFinished} onPress={reiniciarJogo}>
            <Text style={styles.btnFinishedText}>Jogar novamente</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnFinishedOutline} onPress={() => router.back()}>
            <Text style={styles.btnFinishedOutlineText}>Voltar ao início</Text>
          </TouchableOpacity>
        </Animated.View>
      </ImageBackground>
    );
  }

  // ==========================================
  // RENDERIZAÇÃO: FASE JOGO (LABIRINTO EM TELA CHEIA)
  // ==========================================
  return (
    /* 🔥 AQUI ESTÁ A MÁGICA: A sua imagem virou o fundo de toda a tela do jogo! */
    <ImageBackground
      source={require('@/assets/images/mapa_completo.png')}
      style={styles.gameContainer}
      resizeMode="contain"
    >
      {/* Botão de Home flutuando no topo */}
      <TouchableOpacity
        style={[styles.topHomeBtn, { top: Math.max(insets.top, 20) }]}
        onPress={() => router.back()}
      >
        <MaterialCommunityIcons name="home" size={24} color="#fff" />
      </TouchableOpacity>

      <Text style={[styles.gameSubtitle, { marginTop: Math.max(insets.top + 60, 80) }]}>
        Ajude-o a encontrar a saída!
      </Text>

      {/* GRADE DE COLISÕES INVISÍVEL (Alinhada exatamente por cima do desenho do labirinto) */}
      <View style={styles.mazeGridContainer}>
        {mazeMap.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.row}>
            {row.map((cell, colIndex) => {
              const isPlayer = playerPos.row === rowIndex && playerPos.col === colIndex;
              return (
                <View key={`cell-${rowIndex}-${colIndex}`} style={styles.cell}>
                  {/* BÔNUS (Cubinho de açúcar) */}
                  {cell.includes('SUGAR') && !isPlayer && (
                    <Animated.View entering={ZoomIn}>
                      <Image
                        source={require('@/assets/images/cubo.png')}
                        style={{ width: CELL_SIZE * 1.25, height: CELL_SIZE * 1.25 }}
                        resizeMode="contain"
                      />
                    </Animated.View>
                  )}

                  {/* SINALIZADOR DA SAÍDA: Mudou de cell === 4 para incluir 'EXIT' */}
                  {cell.includes('EXIT') && !isPlayer && (
                    <View style={styles.invisibleExitAnchor} />
                  )}

                  {/* JOGADOR (Formiguinha) */}
                  {isPlayer && (
                    <Animated.View
                      entering={ZoomIn.duration(150)}
                      style={{ justifyContent: 'center', alignItems: 'center' }}
                    >
                      <Image
                        source={require('@/assets/images/Glicemilton_feliz.png')}
                        style={{
                          width: CELL_SIZE * 1.25,
                          height: CELL_SIZE * 1.25,
                          transform: [{ translateY: -10 }, { translateX: 0 }],
                        }}
                        resizeMode="contain"
                      />
                    </Animated.View>
                  )}
                </View>
              );
            })}
          </View>
        ))}
      </View>

      {/* TECLADO DIRECIONAL EM DIAMANTE */}
      <View style={styles.controlsArea}>
        <TouchableOpacity style={styles.dPadBtn} onPress={() => movePlayer('UP')}>
          <MaterialCommunityIcons name="arrow-up" size={28} color="#FFF" />
        </TouchableOpacity>

        <View style={styles.controlRowMiddle}>
          <TouchableOpacity style={styles.dPadBtn} onPress={() => movePlayer('LEFT')}>
            <MaterialCommunityIcons name="arrow-left" size={28} color="#FFF" />
          </TouchableOpacity>

          <View style={styles.dPadCenterSpace} />

          <TouchableOpacity style={styles.dPadBtn} onPress={() => movePlayer('RIGHT')}>
            <MaterialCommunityIcons name="arrow-right" size={28} color="#FFF" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.dPadBtn} onPress={() => movePlayer('DOWN')}>
          <MaterialCommunityIcons name="arrow-down" size={28} color="#FFF" />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, width: '100%', height: '100%' },
  introContainerClean: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  cardAnchor: { width: '100%', maxWidth: 340, position: 'relative' },
  introCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
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
    backgroundColor: '#7A5C4E',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
    zIndex: 99,
  },
  introIcon: { width: 160, height: 160, marginVertical: 20 },
  introTitle: {
    fontFamily: 'Chewy_400Regular',
    fontSize: 32,
    color: '#7A5C4E',
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
  introCircleBtn: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#7A5C4E',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },

  /* 🔥 AJUSTADO: Removido paddingHorizontal para o plano de fundo tocar as bordas do aparelho */
  gameContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#8b4e1f',
  },
  topHomeBtn: {
    position: 'absolute',
    left: 20,
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#7A5C4E',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
    zIndex: 99,
  },
  gameSubtitle: {
    fontFamily: 'Chewy_400Regular',
    fontSize: 24,
    color: '#FFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 3,
  },

  // ALTERE APENAS ESTA CLASSE NO SEU STYLESHEET:
  mazeGridContainer: {
    position: 'absolute',
    top: '44%',
    left: '50%',
    width: MAZE_CONTAINER_SIZE,
    height: MAZE_CONTAINER_SIZE,
    marginTop: -MAZE_CONTAINER_SIZE / 2, // Centra verticalmente na perfeição
    marginLeft: -MAZE_CONTAINER_SIZE / 2, // Centra horizontalmente na perfeição
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    zIndex: 10, // Garante que fica por cima do fundo
  },
  row: { flexDirection: 'row' },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  invisibleExitAnchor: { width: '100%', height: '100%', backgroundColor: 'transparent' },

  controlsArea: {
    position: 'absolute',
    bottom: 50, // Grampeia o D-Pad na parte inferior da tela
    alignItems: 'center',
    width: '100%',
    gap: 6,
    zIndex: 20, // Garante que as setas fiquem por cima de qualquer fundo e clicáveis
  },
  controlRowMiddle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  dPadBtn: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: '#7A5C4E',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#A88B7E',
    elevation: 5,
  },
  dPadCenterSpace: { width: 66, height: 66 },
  finishedContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  finishedCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    width: '85%',
    maxWidth: 340,
    borderRadius: 24,
    paddingVertical: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  finishedIcon: {
    width: 120, // Tamanho ideal para o ícone/troféu do cartão
    height: 120,
    marginBottom: 10,
  },
  finishedTitle: {
    fontSize: 28,
    fontFamily: 'Chewy_400Regular',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  finishedSub: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
    marginBottom: 8,
  },
  btnFinished: {
    backgroundColor: '#7A5C4E',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  btnFinishedText: {
    color: '#fff',
    fontFamily: 'Chewy_400Regular',
    fontSize: 18,
  },
  btnFinishedOutline: {
    borderWidth: 1.5,
    borderColor: '#7A5C4E',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  btnFinishedOutlineText: {
    color: '#7A5C4E',
    fontFamily: 'Chewy_400Regular',
    fontSize: 18,
  },
});
