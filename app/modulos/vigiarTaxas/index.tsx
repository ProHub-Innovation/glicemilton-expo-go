import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  PanResponder,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// IMPORTAÇÃO DO ESTADO GLOBAL (Ajuste o caminho se for diferente no seu projeto)
import { useGame } from '../../../context/GameContext';

const { width, height } = Dimensions.get('window');

// Tolerância de toque vs arraste, em pixels. Abaixo disso o gesto é um "tap".
const TAP_TOLERANCE = 10;

type DropZone = { x: number; y: number; width: number; height: number };

function pointInZone(px: number, py: number, zone: DropZone | null): boolean {
  if (!zone) return false;
  return px >= zone.x && px <= zone.x + zone.width && py >= zone.y && py <= zone.y + zone.height;
}

// --- COMPONENTE DO MINIGAME ARRASTÁVEL E CLICÁVEL ---
function DraggableItem({
  name,
  imageSource,
  itemWidth,
  itemHeight,
  startX,
  startY,
  onDrop,
  onTap,
  disabled,
  zIndex = 100,
}: {
  name: string;
  imageSource: any;
  itemWidth: number;
  itemHeight: number;
  startX: number;
  startY: number;
  onDrop: (name: string, x: number, y: number) => void | Promise<void>;
  onTap?: (name: string) => void;
  disabled?: boolean;
  zIndex?: number;
}) {
  const pan = useRef(new Animated.ValueXY()).current;

  const disabledRef = useRef(disabled);
  disabledRef.current = disabled;

  const onDropRef = useRef(onDrop);
  onDropRef.current = onDrop;

  const onTapRef = useRef(onTap);
  onTapRef.current = onTap;

  const resetPosition = () => {
    Animated.spring(pan, {
      toValue: { x: 0, y: 0 },
      friction: 6,
      tension: 50,
      useNativeDriver: false,
    }).start();
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !disabledRef.current,
      onMoveShouldSetPanResponder: () => !disabledRef.current,
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: async (e, gesture) => {
        if (disabledRef.current) {
          resetPosition();
          return;
        }

        const isTap = Math.abs(gesture.dx) < TAP_TOLERANCE && Math.abs(gesture.dy) < TAP_TOLERANCE;

        if (isTap) {
          if (onTapRef.current) onTapRef.current(name);
          resetPosition();
          return;
        }

        const dropResult = onDropRef.current(name, gesture.moveX, gesture.moveY);
        if (dropResult instanceof Promise) {
          await dropResult;
        }

        resetPosition();
      },
      onPanResponderTerminate: () => {
        resetPosition();
      },
    })
  ).current;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      pointerEvents={disabled ? 'none' : 'auto'}
      style={[
        {
          position: 'absolute',
          left: startX,
          top: startY,
          width: itemWidth,
          height: itemHeight,
          justifyContent: 'center',
          alignItems: 'center',
          elevation: 10,
          zIndex,
          transform: pan.getTranslateTransform(),
        },
      ]}
    >
      <Image source={imageSource} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
    </Animated.View>
  );
}

// --- MINIATURA PARA A TELA "CLIQUE NO GLICEMILTON" ---
function MiniatureSetup() {
  return (
    <View style={styles.miniatureContainer}>
      <Image
        source={require('../../../assets/images/lixo_infectante.png')}
        style={[styles.miniItemAbsolute, { left: 120, bottom: 100, width: 50, height: 60 }]}
        resizeMode="contain"
      />
      <Image
        source={require('../../../assets/images/glicemilton_aferindo.png')}
        style={[styles.miniItemAbsolute, { left: 190, bottom: 60, width: 110, height: 100 }]}
        resizeMode="contain"
      />
      <Image
        source={require('../../../assets/images/pedra.png')}
        style={[styles.miniItemAbsolute, { left: 160, bottom: 0, width: 100, height: 150 }]}
        resizeMode="stretch"
      />
      <Image
        source={require('../../../assets/images/caixa_de_perfurocortantes.png')}
        style={[styles.miniItemAbsolute, { left: 165, bottom: 55, width: 50, height: 60 }]}
        resizeMode="contain"
      />
      <Image
        source={require('../../../assets/images/alcool.png')}
        style={[styles.miniItemAbsolute, { left: 202, bottom: 70, width: 15, height: 30 }]}
        resizeMode="contain"
      />
      <Image
        source={require('../../../assets/images/lanceta_abrindo.png')}
        style={[styles.miniItemAbsolute, { left: 215, bottom: 64, width: 20, height: 20 }]}
        resizeMode="contain"
      />
      <Image
        source={require('../../../assets/images/algodao_seco.png')}
        style={[styles.miniItemAbsolute, { left: 200, bottom: 60, width: 15, height: 15 }]}
        resizeMode="contain"
      />
      <Image
        source={require('../../../assets/images/glicosimetro_desligado.png')}
        style={[styles.miniItemAbsolute, { left: 210, bottom: 48, width: 20, height: 25 }]}
        resizeMode="contain"
      />
    </View>
  );
}

// --- ENUM DA MÁQUINA DE ESTADOS DO MINIGAME ---
type FasePasso =
  | 'SELECIONAR_DEDO'
  | 'ASSEPSIA'
  | 'ABRIR_LANCETA'
  | 'FURO'
  | 'LIMPAR_PRIMEIRA_GOTA'
  | 'SEGUNDA_GOTA'
  | 'AFERICAO'
  | 'DESCARTE';

const INSTRUCOES: Record<FasePasso, string> = {
  SELECIONAR_DEDO: '1. Clique no dedo do Glicemilton.',
  ASSEPSIA: '2. Arraste o álcool até o dedo para higienizar.',
  ABRIR_LANCETA: '3. Clique na lanceta para abri-la.',
  FURO: '4. Arraste a lanceta aberta até o dedo para furar.',
  LIMPAR_PRIMEIRA_GOTA: '5. Arraste o algodão seco até o dedo para limpar a primeira gota.',
  SEGUNDA_GOTA: '6. Clique novamente no dedo para a segunda gota.',
  AFERICAO: '7. Arraste o glicosímetro até a gota de sangue.',
  DESCARTE: '8. Descarte a lanceta na caixa de perfurocortantes e o algodão na lixeira!',
};

// --- COMPONENTE PRINCIPAL DO JOGO DE AFERIÇÃO ---
function AfericaoGame({ onFinish }: { onFinish: () => void }) {
  const [fase, setFase] = useState<FasePasso>('SELECIONAR_DEDO');

  const [sangueVisible, setSangueVisible] = useState(false);
  const [isSpraying, setIsSpraying] = useState(false);
  const [lancetaAberta, setLancetaAberta] = useState(false);
  const [lancetaDescartada, setLancetaDescartada] = useState(false);
  const [algodaoSujo, setAlgodaoSujo] = useState(false);
  const [algodaoDescartado, setAlgodaoDescartado] = useState(false);
  const [glicosimetroLigado, setGlicosimetroLigado] = useState(false);

  const [inputBloqueado, setInputBloqueado] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const dedoRef = useRef<View>(null);
  const caixaPerfuroRef = useRef<View>(null);
  const lixeiraRef = useRef<View>(null);

  const [dedoZone, setDedoZone] = useState<DropZone | null>(null);
  const [caixaPerfuroZone, setCaixaPerfuroZone] = useState<DropZone | null>(null);
  const [lixeiraZone, setLixeiraZone] = useState<DropZone | null>(null);

  const medirZona = (ref: React.RefObject<View | null>, setZone: (z: DropZone) => void) => {
    setTimeout(() => {
      ref.current?.measureInWindow((x, y, w, h) => {
        if (w > 0 && h > 0) {
          setZone({ x, y, width: w, height: h });
        }
      });
    }, 500);
  };

  const handleTap = (itemName: string) => {
    if (inputBloqueado) return;

    if (fase === 'ABRIR_LANCETA' && itemName === 'lanceta') {
      setLancetaAberta(true);
      setFase('FURO');
    }
  };

  const handleDedoClick = () => {
    if (inputBloqueado) return;

    if (fase === 'SELECIONAR_DEDO') {
      setFase('ASSEPSIA');
      return;
    }
    if (fase === 'SEGUNDA_GOTA') {
      setSangueVisible(true);
      setFase('AFERICAO');
      return;
    }
  };

  const handleDrop = (itemName: string, moveX: number, moveY: number) => {
    if (inputBloqueado) return;

    const acertouDedo = pointInZone(moveX, moveY, dedoZone) || moveX > width * 0.55;
    const acertouCaixa = pointInZone(moveX, moveY, caixaPerfuroZone) || moveX < width * 0.45;
    const acertouLixo = pointInZone(moveX, moveY, lixeiraZone) || moveX < width * 0.45;

    switch (fase) {
      case 'ASSEPSIA': {
        if (itemName === 'alcool' && acertouDedo) {
          setInputBloqueado(true);
          setIsSpraying(true);

          return new Promise<void>((resolve) => {
            setTimeout(() => {
              setIsSpraying(false);
              setInputBloqueado(false);
              setFase('ABRIR_LANCETA');
              resolve();
            }, 1000);
          });
        }
        break;
      }

      case 'FURO': {
        if (itemName === 'lanceta' && lancetaAberta && acertouDedo) {
          setSangueVisible(true);
          setFase('LIMPAR_PRIMEIRA_GOTA');
        }
        break;
      }

      case 'LIMPAR_PRIMEIRA_GOTA': {
        if (itemName === 'algodao' && acertouDedo) {
          setSangueVisible(false);
          setAlgodaoSujo(true);
          setFase('SEGUNDA_GOTA');
        }
        break;
      }

      case 'AFERICAO': {
        if (itemName === 'glicosimetro' && sangueVisible && acertouDedo) {
          setGlicosimetroLigado(true);
          setSangueVisible(false);
          setFase('DESCARTE');
        }
        break;
      }

      case 'DESCARTE': {
        if (itemName === 'lanceta' && acertouCaixa) {
          setLancetaDescartada(true);
          checkWin(true, algodaoDescartado);
        } else if (itemName === 'algodao' && acertouLixo) {
          setAlgodaoDescartado(true);
          checkWin(lancetaDescartada, true);
        }
        break;
      }

      default:
        break;
    }
  };

  const checkWin = (lancetaOk: boolean, algodaoOk: boolean) => {
    if (lancetaOk && algodaoOk) {
      setInputBloqueado(true);
      setTimeout(() => {
        // Exibe o nosso modal visual customizado ao invés do Alert nativo
        setShowSuccessModal(true);
      }, 500);
    }
  };

  const alcoolDisabled = fase !== 'ASSEPSIA' || inputBloqueado;
  const lancetaDisabled =
    !(fase === 'ABRIR_LANCETA' || fase === 'FURO' || fase === 'DESCARTE') || inputBloqueado;
  const algodaoDisabled =
    !(fase === 'LIMPAR_PRIMEIRA_GOTA' || fase === 'DESCARTE') || inputBloqueado;
  const glicosimetroDisabled = fase !== 'AFERICAO' || inputBloqueado;

  const cenaWidth = width;
  const cenaHeight = cenaWidth * 0.42;

  const RATIO = {
    pedra: 1.673,
    caixaPerfuro: 0.713,
    lixeira: 0.683,
    alcoolFechado: 0.388,
    alcoolBorrifando: 0.545,
    lancetaAberta: 2.705,
    lancetaAbrindo: 3.139,
    algodao: 1.02,
    glicosimetro: 0.52,
  };

  const pedraHeight = cenaHeight * 5;
  const pedraWidth = pedraHeight * RATIO.pedra;
  const pedraLeft = (cenaWidth - pedraWidth) / 2;

  const TOUCH_AREA_HEIGHT = height;
  const offsetTop = TOUCH_AREA_HEIGHT - cenaHeight;

  return (
    <View style={styles.gameContainer}>
      <View style={styles.instructionBadge}>
        <Text style={styles.floatingTitleText}>{INSTRUCOES[fase]}</Text>
      </View>

      <View
        style={[styles.cenaContainer, { width: cenaWidth, height: TOUCH_AREA_HEIGHT }]}
        pointerEvents="box-none"
      >
        <View
          style={{ position: 'absolute', bottom: 0, left: 0, width: cenaWidth, height: cenaHeight }}
          pointerEvents="box-none"
        >
          <Image
            source={require('../../../assets/images/pedra.png')}
            style={[
              styles.rockImageBase,
              { width: pedraWidth, height: pedraHeight, left: pedraLeft },
            ]}
            resizeMode="contain"
          />

          <View
            ref={caixaPerfuroRef}
            style={[
              styles.sharpsContainerFix,
              { width: cenaHeight * 0.7 * RATIO.caixaPerfuro, height: cenaHeight * 0.5 },
            ]}
            onLayout={() => medirZona(caixaPerfuroRef, setCaixaPerfuroZone)}
          >
            <Image
              source={require('../../../assets/images/caixa_de_perfurocortantes.png')}
              style={{ width: '300%', height: '300%' }}
              resizeMode="contain"
            />
          </View>

          <View
            ref={lixeiraRef}
            style={[
              styles.trashImageFix,
              { width: cenaHeight * 0.7 * RATIO.lixeira, height: cenaHeight * 0.7 },
            ]}
            onLayout={() => medirZona(lixeiraRef, setLixeiraZone)}
          >
            <Image
              source={require('../../../assets/images/lixo_infectante.png')}
              style={{ width: '200%', height: '200%' }}
              resizeMode="contain"
            />
          </View>

          <View
            style={[styles.characterWrapper, { width: cenaWidth * 0.4, height: cenaHeight * 3.35 }]}
            pointerEvents="box-none"
          >
            <View style={styles.characterImageFill} pointerEvents="none">
              <Image
                source={require('../../../assets/images/glicemilton_aferindo.png')}
                style={{ width: '95%', height: '55%' }}
                resizeMode="contain"
              />
            </View>

            {sangueVisible && (
              <View style={styles.bloodDrop} pointerEvents="none">
                <Image
                  source={require('../../../assets/images/gota_de_sangue.png')}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="contain"
                />
              </View>
            )}

            <TouchableOpacity
              ref={dedoRef}
              style={styles.dedoHitbox}
              onLayout={() => medirZona(dedoRef, setDedoZone)}
              onPress={handleDedoClick}
              activeOpacity={0.6}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            />
          </View>
        </View>

        <DraggableItem
          name="alcool"
          imageSource={
            isSpraying
              ? require('../../../assets/images/alcool_borrifando.png')
              : require('../../../assets/images/alcool.png')
          }
          itemWidth={cenaHeight * 0.7 * RATIO.alcoolBorrifando}
          itemHeight={cenaHeight * 0.7}
          startX={cenaWidth * 0.45}
          startY={cenaHeight * -1.25 + offsetTop}
          onDrop={handleDrop}
          disabled={alcoolDisabled}
          zIndex={90}
        />

        {!lancetaDescartada && (
          <DraggableItem
            name="lanceta"
            imageSource={
              lancetaAberta
                ? require('../../../assets/images/lanceta_aberta.png')
                : require('../../../assets/images/lanceta_abrindo.png')
            }
            itemWidth={cenaHeight * 0.5 * RATIO.lancetaAbrindo}
            itemHeight={cenaHeight * 0.5}
            startX={cenaWidth * 0.35}
            startY={cenaHeight * -0.9 + offsetTop}
            onDrop={handleDrop}
            onTap={handleTap}
            disabled={lancetaDisabled}
            zIndex={91}
          />
        )}

        {!algodaoDescartado && (
          <DraggableItem
            name="algodao"
            imageSource={
              algodaoSujo
                ? require('../../../assets/images/algodao_com_sangue.png')
                : require('../../../assets/images/algodao_seco.png')
            }
            itemWidth={cenaHeight * 0.5 * RATIO.algodao}
            itemHeight={cenaHeight * 0.5}
            startX={cenaWidth * 0.35}
            startY={cenaHeight * -0.75 + offsetTop}
            onDrop={handleDrop}
            disabled={algodaoDisabled}
            zIndex={92}
          />
        )}

        <DraggableItem
          name="glicosimetro"
          imageSource={
            glicosimetroLigado
              ? require('../../../assets/images/glicosimetro_ligado.png')
              : require('../../../assets/images/glicosimetro_desligado.png')
          }
          itemWidth={cenaHeight * 0.5 * RATIO.glicosimetro}
          itemHeight={cenaHeight * 0.5}
          startX={cenaWidth * 0.55}
          startY={cenaHeight * -0.56 + offsetTop}
          onDrop={handleDrop}
          disabled={glicosimetroDisabled}
          zIndex={93}
        />
      </View>

      {/* --- NOVO MODAL DE SUCESSO DO MINIGAME COM A MESMA IDENTIDADE VISUAL --- */}
      {showSuccessModal && (
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.customAlertContainer,
              {
                backgroundColor: '#F0FFF0',
                borderColor: '#4CAF50',
                width: '85%',
                maxWidth: 350,
                elevation: 10,
              },
            ]}
          >
            <Text style={styles.customAlertTitle}>Simulação Concluída!</Text>
            <Text style={styles.customAlertMessage}>Agora vamos avaliar o resultado obtido.</Text>
            <TouchableOpacity style={styles.customAlertButton} onPress={onFinish}>
              <Text style={styles.customAlertButtonText}>AVANÇAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

// --- TELA PRINCIPAL QUE GERE O FLUXO ---
export default function VigiarTaxasScreen() {
  const router = useRouter();

  // Utilização do contexto global de jogo para atribuir pontos
  const { addPoints } = useGame();

  const [step, setStep] = useState('intro');
  const [contextoMedicacao, setContextoMedicacao] = useState<'jejum' | 'alimentado' | null>(null);
  const [glicemiaGerada, setGlicemiaGerada] = useState<number>(0);

  // O gameKey permite forçar o React a destruir e recriar o minigame caso o usuário erre
  const [gameKey, setGameKey] = useState(0);

  // Estados para o feedback visual da nova tela de alerta
  const [selectedGuess, setSelectedGuess] = useState<string | null>(null);
  const [correctAnswer, setCorrectAnswer] = useState<string | null>(null);
  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    type: 'success' | 'error';
    title: string;
    message: string;
  } | null>(null);

  // Inicia a fase de interpretação ao gerar um valor fictício e limpar estados anteriores
  const iniciarInterpretacao = (estado: 'jejum' | 'alimentado') => {
    setContextoMedicacao(estado);
    setGlicemiaGerada(Math.floor(Math.random() * (250 - 50 + 1)) + 50);
    setSelectedGuess(null);
    setCorrectAnswer(null);
    setAlertConfig(null);
    setStep('result_interpretation');
  };

  // Função para validar o palpite do usuário com as regras clínicas e ativar interface
  const verificarInterpretacao = (palpite: string) => {
    if (selectedGuess) return; // Previne múltiplos cliques

    let classificacaoCorreta = '';

    if (contextoMedicacao === 'jejum') {
      if (glicemiaGerada < 70) classificacaoCorreta = 'hipo';
      else if (glicemiaGerada <= 99) classificacaoCorreta = 'meta';
      else if (glicemiaGerada <= 125) classificacaoCorreta = 'hiper';
      else classificacaoCorreta = 'hiperglicemia';
    } else {
      if (glicemiaGerada < 70) classificacaoCorreta = 'hipo';
      else if (glicemiaGerada <= 140) classificacaoCorreta = 'meta';
      else if (glicemiaGerada <= 199) classificacaoCorreta = 'hiper';
      else classificacaoCorreta = 'hiperglicemia';
    }

    // Grava o que o usuário escolheu e qual a certa
    setSelectedGuess(palpite);
    setCorrectAnswer(classificacaoCorreta);

    // Mapeamento para exibir o nome bonito no alerta quando errar
    const nomesDasRespostas: Record<string, string> = {
      hipo: 'Hipoglicemia',
      meta: 'Na Meta',
      hiper: 'Hiper',
      hiperglicemia: 'Hiperglicemia',
    };

    if (palpite === classificacaoCorreta) {
      addPoints('modulo6_vigiar_taxas' as any, 10);
      setAlertConfig({
        visible: true,
        type: 'success',
        title: 'Excelente!',
        message: 'Você interpretou o resultado corretamente! +10 Pontos!',
      });
    } else {
      setAlertConfig({
        visible: true,
        type: 'error',
        title: 'Atenção!',
        // Exibe a resposta que era a correta e informa o reinício
        message: `Incorreto. A resposta certa era "${nomesDasRespostas[classificacaoCorreta]}".\nVamos gerar um novo valor para você tentar novamente!`,
      });
    }
  };

  // Funções de estilo dinâmico para pintar os botões
  const getButtonStyle = (guessType: string) => {
    if (!selectedGuess) {
      return styles.guessButton; // Estilo inicial (Castanho neutro)
    }
    if (guessType === correctAnswer) return [styles.guessButton, { backgroundColor: '#4CAF50' }];
    if (guessType === selectedGuess && guessType !== correctAnswer)
      return [styles.guessButton, { backgroundColor: '#E53935' }];
    return [styles.guessButton, { backgroundColor: '#E0E0E0', elevation: 0 }]; // Outros botões ficam cinzentos
  };

  const getButtonTextStyle = (guessType: string) => {
    if (!selectedGuess) return styles.guessButtonText;
    if (guessType === correctAnswer || guessType === selectedGuess) return styles.guessButtonText;
    return [styles.guessButtonText, { color: '#9E9E9E' }];
  };

  const renderContent = () => {
    switch (step) {
      case 'intro':
        return (
          <ImageBackground
            source={require('../../../assets/images/background.jpg')}
            style={styles.background}
          >
            <SafeAreaView style={styles.safeArea}>
              <View style={styles.header}>
                <TouchableOpacity style={styles.homeButton} onPress={() => router.back()}>
                  <Ionicons name="home" size={24} color="white" />
                </TouchableOpacity>
              </View>
              <View style={styles.introCard}>
                <Text style={styles.introTitle}>Vigiar as taxas</Text>
                <Image
                  source={require('../../../assets/images/icone_vigiar_taxas.png')}
                  style={styles.introImage}
                  resizeMode="contain"
                />
                <Text style={styles.introText}>
                  É necessário verificar se as metas estão sendo atingidas, o que é crucial para
                  prevenir complicações agudas e crônicas.
                </Text>
                <View style={{ flex: 1 }} />
                <TouchableOpacity style={styles.navButton} onPress={() => setStep('story')}>
                  <Ionicons name="chevron-forward" size={32} color="white" />
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </ImageBackground>
        );

      case 'story':
        return (
          <ImageBackground
            source={require('../../../assets/images/background.jpg')}
            style={styles.background}
          >
            <SafeAreaView style={styles.safeArea}>
              <View style={styles.header}>
                <TouchableOpacity style={styles.homeButton} onPress={() => router.back()}>
                  <Ionicons name="home" size={24} color="white" />
                </TouchableOpacity>
              </View>
              <View style={styles.characterStory} pointerEvents="none">
                <Image
                  source={require('../../../assets/images/Glicemilton_feliz.png')}
                  style={styles.characterLarge}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.storyContent}>
                <View style={styles.textBackdrop}>
                  <Text style={styles.floatingText}>
                    Usuário, eu convivo com Diabetes Mellitus tipo x e preciso que você interprete
                    meus resultados, tá bom?
                  </Text>
                </View>
                <TouchableOpacity
                  style={[styles.navButton, { marginTop: 30 }]}
                  onPress={() => setStep('question')}
                >
                  <Ionicons name="chevron-forward" size={32} color="white" />
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </ImageBackground>
        );

      case 'question':
        return (
          <ImageBackground
            source={require('../../../assets/images/fundo_azul.jpg')}
            style={styles.background}
            imageStyle={{ transform: [{ scale: 1.12 }] }}
          >
            <SafeAreaView style={styles.safeArea}>
              <View style={styles.header}>
                <TouchableOpacity style={styles.homeButton} onPress={() => router.back()}>
                  <Ionicons name="home" size={24} color="white" />
                </TouchableOpacity>
              </View>
              <View style={styles.characterBottomCenter} pointerEvents="none">
                <Image
                  source={require('../../../assets/images/Glicemilton_feliz.png')}
                  style={styles.characterLarge}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.storyContent}>
                <Text style={styles.floatingTitle}>Precisa de instruções?</Text>
                <View style={styles.thumbsContainerRow}>
                  <TouchableOpacity style={styles.thumbGreen} onPress={() => setStep('inst1')}>
                    <Ionicons name="thumbs-up" size={50} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.thumbRed} onPress={() => setStep('reference')}>
                    <Ionicons name="thumbs-down" size={50} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            </SafeAreaView>
          </ImageBackground>
        );

      case 'inst1':
        return (
          <ImageBackground
            source={require('../../../assets/images/fundo_azul.jpg')}
            style={styles.background}
            imageStyle={{ transform: [{ scale: 1.12 }] }}
          >
            <SafeAreaView style={styles.safeArea}>
              <View style={styles.header}>
                <TouchableOpacity style={styles.homeButton} onPress={() => router.back()}>
                  <Ionicons name="home" size={24} color="white" />
                </TouchableOpacity>
              </View>
              <View style={styles.characterBottomRight} pointerEvents="none">
                <Image
                  source={require('../../../assets/images/glicemilton_explicando.png')}
                  style={styles.characterLarge}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.instructionCard}>
                <Text style={styles.instructionTitle}>Instruções:</Text>
                <View style={styles.listItem}>
                  <View style={styles.listNumber}>
                    <Text style={styles.listNumberText}>1</Text>
                  </View>
                  <Text style={styles.listText}>Clique no dedo desejado pelo Glicemilton.</Text>
                </View>
                <View style={styles.listItem}>
                  <View style={styles.listNumber}>
                    <Text style={styles.listNumberText}>2</Text>
                  </View>
                  <Text style={styles.listText}>
                    Realize a limpeza com álcool 70% apenas uma vez
                  </Text>
                </View>
                <View style={styles.listItem}>
                  <View style={styles.listNumber}>
                    <Text style={styles.listNumberText}>3</Text>
                  </View>
                  <Text style={styles.listText}>
                    Pegue a lanceta e perfure a lateral do dedo escolhido
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={[styles.navButton, styles.navButtonLeftFloat]}
                onPress={() => setStep('inst2')}
              >
                <Ionicons name="chevron-forward" size={32} color="white" />
              </TouchableOpacity>
            </SafeAreaView>
          </ImageBackground>
        );

      case 'inst2':
        return (
          <ImageBackground
            source={require('../../../assets/images/fundo_azul.jpg')}
            style={styles.background}
            imageStyle={{ transform: [{ scale: 1.12 }] }}
          >
            <SafeAreaView style={styles.safeArea}>
              <View style={styles.header}>
                <TouchableOpacity style={styles.homeButton} onPress={() => router.back()}>
                  <Ionicons name="home" size={24} color="white" />
                </TouchableOpacity>
              </View>
              <View style={styles.characterBottomRight} pointerEvents="none">
                <Image
                  source={require('../../../assets/images/glicemilton_explicando.png')}
                  style={styles.characterLarge}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.instructionCard}>
                <Text style={styles.instructionTitle}>Instruções:</Text>
                <View style={styles.listItem}>
                  <View style={styles.listNumber}>
                    <Text style={styles.listNumberText}>4</Text>
                  </View>
                  <Text style={styles.listText}>
                    Aperte até sair a primeira gota de sangue e descarte com um algodão seco
                  </Text>
                </View>
                <View style={styles.listItem}>
                  <View style={styles.listNumber}>
                    <Text style={styles.listNumberText}>5</Text>
                  </View>
                  <Text style={styles.listText}>Aperte novamente até sair a segunda gota</Text>
                </View>
                <View style={styles.listItem}>
                  <View style={styles.listNumber}>
                    <Text style={styles.listNumberText}>6</Text>
                  </View>
                  <Text style={styles.listText}>
                    Coloque a fita no glicosímetro, realize a aferição e interprete
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={[styles.navButton, styles.navButtonLeftFloat]}
                onPress={() => setStep('reminder')}
              >
                <Ionicons name="chevron-forward" size={32} color="white" />
              </TouchableOpacity>
            </SafeAreaView>
          </ImageBackground>
        );

      case 'reminder':
        return (
          <ImageBackground
            source={require('../../../assets/images/fundo_azul.jpg')}
            style={styles.background}
            imageStyle={{ transform: [{ scale: 1.12 }] }}
          >
            <SafeAreaView style={styles.safeArea}>
              <View style={styles.header}>
                <TouchableOpacity style={styles.homeButton} onPress={() => router.back()}>
                  <Ionicons name="home" size={24} color="white" />
                </TouchableOpacity>
              </View>
              <View style={styles.characterBottomRight} pointerEvents="none">
                <Image
                  source={require('../../../assets/images/glicemilton_explicando.png')}
                  style={styles.characterLarge}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.instructionCard}>
                <Text style={styles.instructionTitle}>Lembrando!</Text>
                <Text style={styles.introText}>
                  O furo é realizado na lateral do dedo pois assim trará menos desconforto para o
                  Glicemilton, visto que é uma área menos vascularizada.
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.navButton, styles.navButtonLeftFloat]}
                onPress={() => setStep('reference')}
              >
                <Ionicons name="chevron-forward" size={32} color="white" />
              </TouchableOpacity>
            </SafeAreaView>
          </ImageBackground>
        );

      case 'reference':
        return (
          <ImageBackground
            source={require('../../../assets/images/fundo_azul.jpg')}
            style={styles.background}
            imageStyle={{ transform: [{ scale: 1.12 }] }}
          >
            <SafeAreaView style={styles.safeArea}>
              <View style={styles.header}>
                <TouchableOpacity style={styles.homeButton} onPress={() => router.back()}>
                  <Ionicons name="home" size={24} color="white" />
                </TouchableOpacity>
              </View>
              <View style={styles.referenceCard}>
                <Text style={styles.instructionTitle}>Valores de referência:</Text>
                <Text style={styles.tableSectionTitle}>Em JEJUM</Text>
                <View style={styles.tableRow}>
                  <Text style={styles.tableLeft}>&lt; 70 mg/dL</Text>
                  <Text style={styles.tableRight}>Hipoglicemia</Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={styles.tableLeft}>De 70 a 99 mg/dL</Text>
                  <Text style={styles.tableRight}>Na meta</Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={styles.tableLeft}>De 100 a 125 mg/dL</Text>
                  <Text style={styles.tableRight}>Hiper</Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={styles.tableLeft}>&gt; 126 mg/dL</Text>
                  <Text style={styles.tableRight}>Hiperglicemia</Text>
                </View>
                <Text style={[styles.tableSectionTitle, { marginTop: 15 }]}>
                  Alimentado a 1h atrás
                </Text>
                <View style={styles.tableRow}>
                  <Text style={styles.tableLeft}>&lt; 70 mg/dL</Text>
                  <Text style={styles.tableRight}>Hipo</Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={styles.tableLeft}>De 70 a 140 mg/dL</Text>
                  <Text style={styles.tableRight}>Na meta</Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={styles.tableLeft}>De 140 a 199 mg/dL</Text>
                  <Text style={styles.tableRight}>Hiper</Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={styles.tableLeft}>&gt; 200 mg/dL</Text>
                  <Text style={styles.tableRight}>Hiperglicemia</Text>
                </View>
              </View>
              <TouchableOpacity
                style={[styles.navButton, styles.navButtonPlay]}
                onPress={() => setStep('click_glicemilton')}
              >
                <Ionicons name="play" size={40} color="white" style={{ marginLeft: 5 }} />
              </TouchableOpacity>
            </SafeAreaView>
          </ImageBackground>
        );

      case 'click_glicemilton':
        return (
          <ImageBackground
            source={require('../../../assets/images/background.jpg')}
            style={styles.background}
          >
            <SafeAreaView style={styles.safeArea}>
              <View style={styles.header}>
                <TouchableOpacity style={styles.homeButton} onPress={() => setStep('reference')}>
                  <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
              </View>

              <View style={styles.clickTitleContainer}>
                <Text style={styles.floatingTitle}>Clique no Glicemilton!</Text>
              </View>

              <View style={styles.miniatureVisualWrapper} pointerEvents="none">
                <MiniatureSetup />
              </View>

              <TouchableOpacity
                style={styles.hitboxGlicemilton}
                onPress={() => setStep('game')}
                activeOpacity={0.5}
              />
            </SafeAreaView>
          </ImageBackground>
        );

      case 'game':
        return (
          <ImageBackground
            source={require('../../../assets/images/fundo_zoom.jpg')}
            style={styles.background}
          >
            <SafeAreaView style={styles.safeAreaCenter}>
              <View style={styles.header}>
                <TouchableOpacity
                  style={styles.homeButton}
                  onPress={() => setStep('click_glicemilton')}
                >
                  <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
              </View>
              {/* Utilizando o gameKey para permitir recriar o minigame caso o usuário erre a interpretação */}
              <AfericaoGame key={gameKey} onFinish={() => setStep('context_selection')} />
            </SafeAreaView>
          </ImageBackground>
        );

      case 'context_selection':
        return (
          <ImageBackground
            source={require('../../../assets/images/fundo_azul.jpg')}
            style={styles.background}
            imageStyle={{ transform: [{ scale: 1.12 }] }}
          >
            <SafeAreaView style={styles.safeAreaCenter}>
              <View style={styles.header}>
                <TouchableOpacity style={styles.homeButton} onPress={() => setStep('game')}>
                  <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
              </View>
              <View style={styles.introCard}>
                <Text style={styles.introTitle}>Para interpretar o resultado...</Text>
                <Text style={styles.introText}>Qual é o estado atual do Glicemilton?</Text>

                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => iniciarInterpretacao('jejum')}
                >
                  <Text style={styles.actionButtonText}>Em JEJUM</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, { marginTop: 15, backgroundColor: '#8DB863' }]}
                  onPress={() => iniciarInterpretacao('alimentado')}
                >
                  <Text style={styles.actionButtonText}>Alimentado a 1h atrás</Text>
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </ImageBackground>
        );

      case 'result_interpretation':
        return (
          <ImageBackground
            source={require('../../../assets/images/background.jpg')}
            style={styles.background}
          >
            <SafeAreaView style={styles.safeAreaCenter}>
              <View style={styles.header}>
                <TouchableOpacity
                  style={styles.homeButton}
                  onPress={() => setStep('context_selection')}
                >
                  <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
              </View>

              {/* 1. O BALÃO DE AVALIAÇÃO AGORA FICA AQUI NO TOPO */}
              <View
                style={[styles.referenceCard, { marginTop: 10, paddingVertical: 15, width: '95%' }]}
              >
                <Text style={[styles.instructionTitle, { fontSize: 24, marginBottom: 5 }]}>
                  O paciente está: {contextoMedicacao === 'jejum' ? 'Em JEJUM' : 'Alimentado (1h)'}
                </Text>
                <Text style={[styles.introText, { fontSize: 18, lineHeight: 22 }]}>
                  Baseado na tabela, classifique o valor de {glicemiaGerada} mg/dL:
                </Text>

                {/* Botões com cores dinâmicas baseadas na seleção */}
                <View style={styles.guessGrid}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={getButtonStyle('hipo')}
                    onPress={() => verificarInterpretacao('hipo')}
                  >
                    <Text style={getButtonTextStyle('hipo')}>Hipoglicemia</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={getButtonStyle('meta')}
                    onPress={() => verificarInterpretacao('meta')}
                  >
                    <Text style={getButtonTextStyle('meta')}>Na Meta</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={getButtonStyle('hiper')}
                    onPress={() => verificarInterpretacao('hiper')}
                  >
                    <Text style={getButtonTextStyle('hiper')}>Hiper</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={getButtonStyle('hiperglicemia')}
                    onPress={() => verificarInterpretacao('hiperglicemia')}
                  >
                    <Text style={getButtonTextStyle('hiperglicemia')}>Hiperglicemia</Text>
                  </TouchableOpacity>
                </View>

                {/* ALERTA CUSTOMIZADO IGUAL AO DA IMAGEM */}
                {alertConfig && alertConfig.visible && (
                  <View
                    style={[
                      styles.customAlertContainer,
                      alertConfig.type === 'error'
                        ? styles.customAlertError
                        : styles.customAlertSuccess,
                    ]}
                  >
                    <Text style={styles.customAlertTitle}>{alertConfig.title}</Text>
                    <Text style={styles.customAlertMessage}>{alertConfig.message}</Text>
                    <TouchableOpacity
                      style={styles.customAlertButton}
                      onPress={() => {
                        if (alertConfig.type === 'success') {
                          router.replace('/'); // Vai para a tela principal
                        } else {
                          // Limpa e volta para a seleção de contexto (Jejum/Alimentado)
                          setAlertConfig(null);
                          setSelectedGuess(null);
                          setCorrectAnswer(null);
                          setStep('context_selection');
                        }
                      }}
                    >
                      <Text style={styles.customAlertButtonText}>CONTINUAR</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              {/* 2. O GLICEMILTON FICA NO CHÃO */}
              <View style={[styles.resultImageContainer, { marginTop: 'auto', marginBottom: 0 }]}>
                <Image
                  source={require('../../../assets/images/glicemilton_glico.png')}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="contain"
                />

                {/* O LCD acompanha a imagem automaticamente */}
                <View style={styles.lcdOverlay}>
                  <Text style={styles.lcdText}>{glicemiaGerada}</Text>
                </View>
              </View>
            </SafeAreaView>
          </ImageBackground>
        );
    }
  };

  return renderContent();
}

const styles = StyleSheet.create({
  background: { flex: 1, width: '100%', height: '100%' },
  safeArea: { flex: 1, paddingTop: 40, paddingBottom: 20 },
  safeAreaCenter: { flex: 1, paddingTop: 40, paddingBottom: 20, alignItems: 'center' },
  header: {
    width: '100%',
    paddingHorizontal: 20,
    alignItems: 'flex-start',
    marginBottom: 10,
    zIndex: 20,
  },
  homeButton: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: '#6C5141',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },

  introCard: {
    flex: 1,
    backgroundColor: 'white',
    alignSelf: 'center',
    width: '90%',
    maxWidth: 380,
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    elevation: 8,
    marginTop: 15,
    marginBottom: 35,
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
  referenceCard: {
    backgroundColor: 'white',
    alignSelf: 'center',
    width: '90%',
    maxWidth: 380,
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 20,
    elevation: 8,
    marginTop: 10,
  },

  introTitle: { fontSize: 32, fontFamily: 'Chewy_400Regular', color: '#6C5141', marginBottom: 20 },
  instructionTitle: {
    fontSize: 30,
    fontFamily: 'Chewy_400Regular',
    color: '#6C5141',
    marginBottom: 15,
    textAlign: 'center',
  },
  introText: {
    fontSize: 28,
    fontFamily: 'Chewy_400Regular',
    color: '#6C5141',
    textAlign: 'center',
    lineHeight: 36,
    paddingHorizontal: 10,
  },
  floatingText: {
    fontSize: 28,
    fontFamily: 'Chewy_400Regular',
    color: 'white',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    lineHeight: 34,
  },
  floatingTitle: {
    fontSize: 36,
    fontFamily: 'Chewy_400Regular',
    color: 'white',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    marginBottom: 10,
  },

  introImage: { width: 170, height: 170, marginBottom: 20 },
  storyContent: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 60,
    zIndex: 10,
    elevation: 10,
  },
  textBackdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 20,
    marginHorizontal: 20,
  },

  clickTitleContainer: {
    marginTop: 30,
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },

  thumbsContainerRow: { flexDirection: 'row', gap: 30, marginTop: 20, justifyContent: 'center' },
  thumbGreen: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#689F38',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 5,
    borderColor: '#DCEDC8',
    elevation: 5,
  },
  thumbRed: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#D32F2F',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 5,
    borderColor: '#FFCDD2',
    elevation: 5,
  },

  listItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 15, paddingRight: 10 },
  listNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#6C5141',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginTop: 2,
  },
  listNumberText: { color: 'white', fontFamily: 'Chewy_400Regular', fontSize: 18 },
  listText: {
    flex: 1,
    fontSize: 18,
    color: '#6C5141',
    fontFamily: 'Chewy_400Regular',
    lineHeight: 22,
  },

  tableSectionTitle: {
    fontSize: 24,
    fontFamily: 'Chewy_400Regular',
    color: '#6C5141',
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginBottom: 10,
  },
  tableRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  tableLeft: { fontSize: 16, fontFamily: 'Chewy_400Regular', color: '#6C5141' },
  tableRight: { fontSize: 16, fontFamily: 'Chewy_400Regular', color: '#6C5141' },

  characterBottomCenter: { position: 'absolute', bottom: -10, alignSelf: 'center', zIndex: 1 },
  characterStory: { position: 'absolute', bottom: 30, alignSelf: 'center', zIndex: 1 },
  characterBottomRight: { position: 'absolute', bottom: -10, right: -25, zIndex: 1 },
  characterLarge: { width: 270, height: 340 },

  navButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#6C5141',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
  },
  navButtonLeftFloat: { position: 'absolute', bottom: 40, left: 30, zIndex: 20 },
  navButtonPlay: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: '#8DB863',
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 4,
    borderColor: '#DCEDC8',
    zIndex: 20,
  },

  gameContainer: { flex: 1, width: '100%', justifyContent: 'flex-end', paddingBottom: 10 },

  instructionBadge: {
    position: 'absolute',
    top: 60,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    zIndex: 50,
  },

  floatingTitleText: {
    fontSize: 20,
    fontFamily: 'Chewy_400Regular',
    color: 'white',
    textAlign: 'center',
  },

  cenaContainer: { position: 'relative', alignSelf: 'center', overflow: 'visible' },

  rockImageBase: { position: 'absolute', bottom: '-90%', zIndex: 2 },
  sharpsContainerFix: { position: 'absolute', bottom: '200%', left: '-5%', zIndex: 3 },
  trashImageFix: { position: 'absolute', bottom: '270%', left: '-4%', zIndex: 3 },
  characterWrapper: { position: 'absolute', right: '0%', bottom: '0%', zIndex: 5 },
  characterImageFill: { width: '100%', height: '100%' },
  bloodDrop: {
    position: 'absolute',
    left: '20%',
    top: '28%',
    width: '12%',
    height: '14%',
    zIndex: 11,
  },

  dedoHitbox: {
    position: 'absolute',
    left: '21%',
    top: '31%',
    width: '15%',
    height: '7%',
    zIndex: 200,
    backgroundColor: 'transparent',
  },

  miniatureVisualWrapper: { position: 'absolute', bottom: 60, left: 20, width: 250, height: 200 },
  hitboxGlicemilton: {
    position: 'absolute',
    bottom: 130,
    left: 250,
    width: 30,
    height: 50,
    zIndex: 100,
  },
  miniatureContainer: { flex: 1 },
  miniItemAbsolute: { position: 'absolute', zIndex: 4 },

  // --- ESTILOS DAS NOVAS TELAS: RESULTADO E INTERPRETAÇÃO ---
  actionButton: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: 15,
    backgroundColor: '#6C5141',
    alignItems: 'center',
    elevation: 4,
    marginTop: 20,
  },
  actionButtonText: { color: 'white', fontSize: 22, fontFamily: 'Chewy_400Regular' },

  resultImageContainer: { width: 280, height: 350, alignSelf: 'center', position: 'relative' },

  lcdOverlay: {
    position: 'absolute',
    top: '56%',
    left: '40%',
    width: '7%',
    height: '6.3%',
    backgroundColor: '#A8C9A2',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3,
  },
  lcdText: { fontSize: 13, color: '#333', fontFamily: 'Chewy_400Regular' },

  guessGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginTop: 15,
  },
  guessButton: {
    backgroundColor: '#6C5141',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    width: '45%',
    alignItems: 'center',
    elevation: 3,
  },
  guessButtonText: { color: 'white', fontSize: 18, fontFamily: 'Chewy_400Regular' },

  // --- ESTILOS DO MODAL OVERLAY PARA O MINIGAME ---
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },

  // --- ESTILOS DO ALERTA CUSTOMIZADO (CAIXA DE FEEDBACK E MINIGAME) ---
  customAlertContainer: {
    marginTop: 20,
    padding: 15,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    width: '100%',
  },
  customAlertError: {
    backgroundColor: '#FFF0F0',
    borderColor: '#E53935',
  },
  customAlertSuccess: {
    backgroundColor: '#F0FFF0',
    borderColor: '#4CAF50',
  },
  customAlertTitle: {
    fontSize: 24,
    fontFamily: 'Chewy_400Regular',
    color: '#3e2723',
    marginBottom: 8,
  },
  customAlertMessage: {
    fontSize: 18,
    fontFamily: 'Chewy_400Regular',
    color: '#4e342e',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 22,
  },
  customAlertButton: {
    backgroundColor: '#6C5141',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    elevation: 2,
  },
  customAlertButtonText: {
    color: 'white',
    fontFamily: 'Chewy_400Regular',
    fontSize: 18,
  },
});
