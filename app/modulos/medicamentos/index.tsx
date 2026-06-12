import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  Image,
  Modal,
  Animated,
} from 'react-native';
import { router } from 'expo-router';
import { useFonts as useExpoFonts } from 'expo-font';
import { Chewy_400Regular } from '@expo-google-fonts/chewy';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type Phase = 'intro' | 'storage' | 'application' | 'finished';

export default function MedicamentosScreen() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [feedbackData, setFeedbackData] = useState({ isCorrect: false, title: '', message: '' });

  const [fontsLoaded] = useExpoFonts({ Chewy_400Regular });
  const homePulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(homePulseAnim, { toValue: 1.1, duration: 800, useNativeDriver: true }),
        Animated.timing(homePulseAnim, { toValue: 1.0, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, [homePulseAnim]);

  if (!fontsLoaded) return null;

  function showFeedback(isCorrect: boolean, title: string, message: string) {
    setFeedbackData({ isCorrect, title, message });
    setFeedbackVisible(true);
  }

  function handleCloseFeedback() {
    setFeedbackVisible(false);
    if (feedbackData.isCorrect) {
      if (phase === 'storage') setPhase('application');
      else if (phase === 'application') setPhase('finished');
    }
  }

  // ==================== RENDERIZAÇÃO DAS FASES ====================

  // FASE 1: INTRODUÇÃO
  if (phase === 'intro') {
    return (
      <ImageBackground
        source={require('@/assets/images/background.jpg')}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.introContainerClean}>
          <View style={styles.cardAnchor}>
            <Animated.View style={[styles.introHomeBtn, { transform: [{ scale: homePulseAnim }] }]}>
              <TouchableOpacity onPress={() => router.back()}>
                <MaterialCommunityIcons name="home" size={24} color="#fff" />
              </TouchableOpacity>
            </Animated.View>

            <View style={styles.introCard}>
              <Text style={styles.introTitle}>Tomar os medicamentos</Text>
              <Image
                source={require('@/assets/images/icone_tomar_medicamentos.png')}
                style={styles.introIcon}
                resizeMode="contain"
              />
              <Text style={styles.introText}>
                Administrar seus medicamentos de forma responsável, seguindo rigorosamente a
                prescrição médica, é essencial para o autocuidado no diabetes.
              </Text>

              <TouchableOpacity style={styles.introCircleBtn} onPress={() => setPhase('storage')}>
                <MaterialCommunityIcons name="chevron-right" size={38} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>
    );
  }

  // FASE 2: ARMAZENAMENTO (CENA DO QUARTO)
  if (phase === 'storage') {
    return (
      <View style={styles.storageWrapper}>
        {/* TRUQUE DO FUNDO DUPLO PARA PREENCHER A TELA */}
        <View style={styles.topBackground} />
        <View style={styles.bottomBackground} />

        <ImageBackground
          source={require('@/assets/images/armazenamento_insulina.png')}
          style={styles.background}
          resizeMode="contain"
        >
          <TouchableOpacity style={styles.topHomeBtn} onPress={() => router.back()}>
            <MaterialCommunityIcons name="home" size={24} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.gameTitle}>
            Qual melhor local para armazenar a caneta de insulina em uso?
          </Text>

          <View style={styles.interactiveArea}>
            <Image
              source={require('@/assets/images/Glicemilton_feliz.png')}
              style={styles.storageCharacterImage}
              resizeMode="contain"
            />

            {/* CANETA NO SOL (Errado) */}
            <TouchableOpacity
              style={[styles.penButton, { top: '50%', left: '13%' }]}
              onPress={() =>
                showFeedback(
                  false,
                  'Atenção!',
                  'O calor e o contato direto com o sol podem estragar a insulina. Tente novamente!'
                )
              }
              activeOpacity={0.7}
            >
              <Image
                source={require('@/assets/images/insulina.png')}
                style={styles.penImage}
                resizeMode="contain"
              />
            </TouchableOpacity>

            {/* CANETA NA SOMBRA (Certo) */}
            <TouchableOpacity
              style={[styles.penButton, { top: '50%', right: '15%' }]}
              onPress={() =>
                showFeedback(
                  true,
                  'Parabéns!',
                  'Você escolheu o local correto! A caneta em uso deve ficar protegida da luz solar e do calor excessivo.'
                )
              }
              activeOpacity={0.7}
            >
              <Image
                source={require('@/assets/images/insulina.png')}
                style={styles.penImage}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
          {RenderFeedbackModal(feedbackVisible, feedbackData, handleCloseFeedback)}
        </ImageBackground>
      </View>
    );
  }

  // FASE 3: LOCAIS DE APLICAÇÃO (CENA DA COZINHA)
  if (phase === 'application') {
    return (
      <ImageBackground
        source={require('@/assets/images/uso_insulina.jpg')}
        style={styles.background}
        resizeMode="cover"
      >
        <TouchableOpacity style={styles.topHomeBtn} onPress={() => router.back()}>
          <MaterialCommunityIcons name="home" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.gameTitle}>
          Quais são os locais corretos de aplicação da caneta de insulina?
        </Text>

        <View style={styles.interactiveArea}>
          {/* ÁREA DE ERRO GIGANTE (Fica no fundo, capturando qualquer clique errado) */}
          <TouchableOpacity
            style={styles.wrongAreaFull}
            activeOpacity={1} // Impede que a tela inteira pisque ao clicar
            onPress={() =>
              showFeedback(
                false,
                'Ops!',
                'Este não é o local correto. A insulina deve ser aplicada na barriga, coxas ou parte posterior dos braços.'
              )
            }
          />

          {/* ÁREAS CORRETAS (Ficam por cima, interceptando os cliques certos) */}
          <TouchableOpacity // Braço Esquerdo
            style={[
              styles.invisibleButton,
              {
                top: '58%',
                left: '22%',
                width: '14%',
                height: '13%',
                transform: [{ rotate: '-82deg' }],
              },
            ]}
            onPress={() =>
              showFeedback(true, 'Parabéns!', 'Os braços são ótimos locais para aplicação!')
            }
          />

          <TouchableOpacity // Braço Direito
            style={[
              styles.invisibleButton,
              {
                top: '63%',
                right: '24%',
                width: '15%',
                height: '10.5%',
                transform: [{ rotate: '35deg' }],
              },
            ]}
            onPress={() =>
              showFeedback(true, 'Parabéns!', 'Excelente! O braço é um local recomendado.')
            }
          />

          <TouchableOpacity // Barriga (Região Abdominal)
            style={[
              styles.invisibleButton,
              { top: '73%', left: '41%', width: '30%', height: '8%' },
            ]}
            onPress={() =>
              showFeedback(
                true,
                'Parabéns!',
                'A barriga (região abdominal) é um dos melhores locais para absorção da insulina!'
              )
            }
          />

          <TouchableOpacity // Pernas / Coxas
            style={[
              styles.invisibleButton,
              { top: '81%', left: '43%', width: '33%', height: '8%' },
            ]}
            onPress={() =>
              showFeedback(
                true,
                'Parabéns!',
                'As coxas são locais seguros e muito usados para aplicar a insulina.'
              )
            }
          />

          <Image
            source={require('@/assets/images/insulina.png')}
            style={styles.applicationPenImage}
            resizeMode="contain"
          />
        </View>

        {RenderFeedbackModal(feedbackVisible, feedbackData, handleCloseFeedback)}
      </ImageBackground>
    );
  }

  // FASE 4: TELA FINAL
  if (phase === 'finished') {
    return (
      <ImageBackground
        source={require('@/assets/images/background.jpg')}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.finishedCard}>
          <Text style={styles.emojiTrophy}>🏅</Text>
          <Text style={styles.introTitle}>Parabéns!</Text>
          <Text style={styles.introText}>
            Você aprendeu perfeitamente como armazenar e aplicar sua insulina.
          </Text>
          <TouchableOpacity style={styles.introCircleBtn} onPress={() => router.back()}>
            <MaterialCommunityIcons name="check" size={38} color="#fff" />
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }

  return null;
}

function RenderFeedbackModal(
  visible: boolean,
  data: { isCorrect: boolean; title: string; message: string },
  onClose: () => void
) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={[styles.modalCard, data.isCorrect ? styles.modalCorrect : styles.modalWrong]}>
          <Text
            style={[
              styles.modalTitle,
              data.isCorrect ? { color: '#2E7D32' } : { color: '#C62828' },
            ]}
          >
            {data.title}
          </Text>
          <Text style={styles.modalMessage}>{data.message}</Text>
          <TouchableOpacity
            style={[
              styles.modalBtn,
              data.isCorrect ? { backgroundColor: '#4CAF50' } : { backgroundColor: '#E53935' },
            ]}
            onPress={onClose}
          >
            <Text style={styles.modalBtnText}>Continuar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ==================== ESTILOS ====================
const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topHomeBtn: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#8B5A2B',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
    zIndex: 50,
  },
  gameTitle: {
    position: 'absolute',
    top: 100,
    fontFamily: 'Chewy_400Regular',
    fontSize: 30,
    color: '#FFF',
    textAlign: 'center',
    paddingHorizontal: 20,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 3,
    zIndex: 10,
  },

  // Áreas Interativas
  interactiveArea: { flex: 1, width: '100%', position: 'relative' },
  invisibleButton: {
    position: 'absolute',
    zIndex: 30, // Nível 20 (frente): Botões corretos
    //backgroundColor: 'rgba(255, 0, 0, 0.5)', // trecho para testar
  },
  wrongAreaFull: {
    position: 'absolute',
    top: '33%',
    bottom: '10%',
    left: '28%',
    right: '18%',
    zIndex: 10, // Nível 10 (fundo): Botão de erro que cobre a tela toda
    // backgroundColor: 'rgba(29, 168, 76, 0.5)', // trecho para teste
  },

  storageWrapper: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  topBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: '50%', // Ocupa exatamente a metade de cima
    backgroundColor: '#894C16',
  },
  bottomBackground: {
    position: 'absolute',
    top: '50%', // Começa da metade para baixo
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#613915',
  },
  storageCharacterImage: {
    position: 'absolute',
    bottom: '19%',
    left: '-11%',
    width: 500,
    height: 400,
    zIndex: 15,
  },
  penButton: {
    position: 'absolute',
    width: 90,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  penImage: {
    width: 150,
    height: 150,
    transform: [{ rotate: '-90deg' }],
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: '85%',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 3,
    backgroundColor: '#FFF',
  },
  modalCorrect: { borderColor: '#4CAF50' },
  modalWrong: { borderColor: '#E53935' },
  modalTitle: { fontSize: 28, fontFamily: 'Chewy_400Regular', marginBottom: 12 },
  modalMessage: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '500',
    lineHeight: 22,
  },
  modalBtn: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  modalBtnText: { color: '#FFF', fontSize: 18, fontFamily: 'Chewy_400Regular' },

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
  finishedCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    width: '85%',
    borderRadius: 24,
    padding: 40,
    alignItems: 'center',
    elevation: 8,
    gap: 16,
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
  },
  introIcon: { width: 140, height: 140, marginVertical: 20 },
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
  introCircleBtn: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#6D4C41',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  emojiTrophy: { fontSize: 64 },

  applicationPenImage: {
    position: 'absolute',
    top: '51%',
    left: '5%',
    width: 150,
    height: 220,
    zIndex: 15,
    transform: [{ rotate: '-165deg' }],
  },
});
