import CardAssociationGrid from '@/components/cartao/CardAssociationGrid';
import { Chewy_400Regular } from '@expo-google-fonts/chewy';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CartoesScreen() {
  const [fontsLoaded] = useFonts({ Chewy_400Regular });
  const [showIntro, setShowIntro] = useState(true);
  const insets = useSafeAreaInsets();

  const handleGameComplete = useCallback(() => {
    router.replace('/(tabs)/onboarding');
  }, []);

  if (!fontsLoaded) return null;

  if (showIntro) {
    return (
      <ImageBackground
        source={require('../../../assets/images/fundo_zoom.jpg')}
        style={styles.container}
        resizeMode="cover"
      >
        <TouchableOpacity
          style={[styles.backButton, { top: Math.max(insets.top + 10, 40) }]}
          onPress={() => router.navigate('/(tabs)/onboarding')}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
        >
          <MaterialCommunityIcons name="home" size={24} color="#FFF" />
        </TouchableOpacity>

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

          <TouchableOpacity
            style={styles.startButton}
            onPress={() => setShowIntro(false)}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Iniciar jogo"
          >
            <MaterialCommunityIcons name="chevron-right" size={44} color="#FFF" />
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={require('@/assets/images/background.jpg')}
      style={styles.container}
      resizeMode="cover"
    >
      <TouchableOpacity
        style={[styles.backButton, { top: Math.max(insets.top + 10, 40) }]}
        onPress={() => setShowIntro(true)}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Voltar para introdução"
      >
        <MaterialCommunityIcons name="home" size={24} color="#FFF" />
      </TouchableOpacity>

      <CardAssociationGrid onGameComplete={handleGameComplete} />
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
  backButton: {
    position: 'absolute',
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
  introCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    width: '90%',
    maxWidth: 360,
    borderRadius: 24,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  introTitle: {
    fontFamily: 'Chewy_400Regular',
    fontSize: 34,
    color: '#795548',
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
    backgroundColor: '#795548',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
});
