import CardAssociationGrid from '@/components/cartao/CardAssociationGrid';
import { Chewy_400Regular } from '@expo-google-fonts/chewy';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import VictoryModal from '../../../components/VictoryModal';
import { useGame } from '../../../context/GameContext';

export default function CartoesScreen() {
  const [fontsLoaded] = useFonts({ Chewy_400Regular });
  const [showIntro, setShowIntro] = useState(true);
  const insets = useSafeAreaInsets();

  const [showIntroBtn, setShowIntroBtn] = useState(false);
  const btnOpacity = useRef(new Animated.Value(0)).current;
  const homePulseAnim = useRef(new Animated.Value(1)).current;

  const { addPoints } = useGame();
  const [showVictory, setShowVictory] = useState(false);

  const handleGameComplete = useCallback(() => {
    addPoints('modulo_cartoes' as any, 10);
    setShowVictory(true);
  }, [addPoints]);

  useEffect(() => {
    if (showIntro) {
      const timer = setTimeout(() => {
        setShowIntroBtn(true);
        Animated.timing(btnOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }).start();
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      setShowIntroBtn(false);
      btnOpacity.setValue(0);
    }
  }, [showIntro, btnOpacity]);

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(homePulseAnim, { toValue: 1.1, duration: 800, useNativeDriver: true }),
        Animated.timing(homePulseAnim, { toValue: 1.0, duration: 800, useNativeDriver: true }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [homePulseAnim]);

  if (!fontsLoaded) return null;

  if (showIntro) {
    return (
      <ImageBackground
        source={require('../../../assets/images/background.jpg')}
        style={styles.container}
        resizeMode="cover"
      >
        <View style={styles.introContainerClean}>
          {}
          <View style={styles.cardAnchor}>
            {}
            <Animated.View style={[styles.introHomeBtn, { transform: [{ scale: homePulseAnim }] }]}>
              <TouchableOpacity
                onPress={() => router.navigate('/(tabs)/onboarding')}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Voltar para o Menu"
              >
                <Ionicons name="home" size={24} color="#FFF" />
              </TouchableOpacity>
            </Animated.View>

            <View style={styles.introCard}>
              <Text style={styles.introTitle}>Resolver problemas</Text>

              <Image
                source={require('../../../assets/images/icone_resolver_problemas.png')}
                style={styles.introIcon}
                resizeMode="contain"
              />

              <Text style={styles.introText}>
                No manejo do diabetes, a prevenção activa de picos (hiper) e quedas (hipoglicemia) é
                crucial. Agir nas duas frentes é o segredo para o bom controle glicêmico.
              </Text>

              {}
              {showIntroBtn && (
                <Animated.View style={{ opacity: btnOpacity }}>
                  <TouchableOpacity
                    style={styles.startButton}
                    onPress={() => setShowIntro(false)}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel="Iniciar jogo"
                  >
                    <Ionicons name="chevron-forward" size={40} color="#FFF" />
                  </TouchableOpacity>
                </Animated.View>
              )}
            </View>
          </View>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={require('../../../assets/images/fundo_zoom.jpg')}
      style={styles.container}
      resizeMode="cover"
    >
      {}
      <View style={{ position: 'absolute', top: insets.top + 15, left: 20, zIndex: 99 }}>
        <Animated.View style={[styles.gameHomeBtn, { transform: [{ scale: homePulseAnim }] }]}>
          <TouchableOpacity
            onPress={() => setShowIntro(true)}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Voltar para introdução"
          >
            <Ionicons name="home" size={24} color="#FFF" />
          </TouchableOpacity>
        </Animated.View>
      </View>

      <CardAssociationGrid onGameComplete={handleGameComplete} />

      {}
      <VictoryModal visible={showVictory} pointsEarned={10} moduleName="Resolver Problemas" />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  introContainerClean: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  cardAnchor: {
    width: '100%',
    maxWidth: 360,
    position: 'relative',
  },
  introHomeBtn: {
    position: 'absolute',
    top: -15,
    left: -10,
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#6D4C41',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
    zIndex: 99,
    elevation: 6,
  },
  gameHomeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#6D4C41',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
    elevation: 4,
  },
  introCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    width: '100%',
    borderRadius: 24,
    paddingVertical: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  introTitle: {
    fontFamily: 'Chewy_400Regular',
    fontSize: 34,
    color: '#6D4C41',
    textAlign: 'center',
    marginBottom: 16,
  },
  introIcon: {
    width: 160,
    height: 160,
    marginBottom: 20,
  },
  introText: {
    fontSize: 19,
    color: '#5D4037',
    textAlign: 'center',
    lineHeight: 26,
    fontWeight: '600',
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  startButton: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#6D4C41',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
});
