import { Chewy_400Regular, useFonts } from '@expo-google-fonts/chewy';
import { useRouter } from 'expo-router';
import React, { useContext } from 'react';
import {
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ScoreContext } from '../../contexts/ScoreContext';

export default function DashboardScreen() {
  const router = useRouter();
  const { score } = useContext(ScoreContext); // Consumindo o Estado Global
  const [fontsLoaded] = useFonts({ Chewy_400Regular });

  if (!fontsLoaded)
    return (
      <View style={styles.loadingContainer}>
        <Text>A carregar...</Text>
      </View>
    );

  // Função genérica para navegar para os minigames
  const navigateToGame = (gameName: string) => {
    // Por enquanto, apenas dá um alerta com o nome do jogo.
    // No futuro, substitua por router.navigate(gameName)
    alert(`Navegando para o módulo: ${gameName}`);
  };

  return (
    <ImageBackground
      source={require('../../assets/images/background.jpg')}
      style={styles.background}
      imageStyle={{ transform: [{ scale: 1.1 }] }}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* TOPO: Container de Glicemia e Pontuação */}
          <View style={styles.topCard}>
            <View style={styles.cardHeader}>
              <View style={styles.glicemiaLabel}>
                <View style={styles.dropIcon} />
                <Text style={styles.cardTitle}>Glicemia</Text>
              </View>
              {/* Barra de progresso ilustrativa */}
              <View style={styles.progressBar}>
                <View style={styles.progressFill} />
              </View>
            </View>

            <View style={styles.cardBody}>
              <View style={styles.valueRow}>
                <Text style={styles.glicemiaValue}>110</Text>
                <Text style={styles.glicemiaUnit}>mg/dL</Text>
              </View>
              {/* Exibição da Pontuação Global */}
              <View style={styles.scoreContainer}>
                <Text style={styles.scoreLabel}>Pontos</Text>
                <Text style={styles.scoreValue}>{score}</Text>
              </View>
            </View>
          </View>

          {/* CENTRO: Glicemilton Feliz */}
          <View style={styles.characterContainer}>
            <Image
              source={require('../../assets/images/Glicemilton feliz.png')}
              style={styles.characterImage}
              resizeMode="contain"
            />
          </View>

          {/* BASE: Mapa de Módulos (Grid de Botões) */}
          <View style={styles.modulesGrid}>
            <TouchableOpacity
              style={styles.moduleButton}
              onPress={() => navigateToGame('Reduzir Riscos')}
              activeOpacity={0.7}
            >
              <Image
                source={require('../../assets/images/ícone reduzir os riscos.png')}
                style={styles.moduleIcon}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.moduleButton}
              onPress={() => navigateToGame('Adaptação Saudável')}
              activeOpacity={0.7}
            >
              <Image
                source={require('../../assets/images/ícone de adaptação saudável.png')}
                style={styles.moduleIcon}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.moduleButton}
              onPress={() => navigateToGame('Comer Saudavelmente')}
              activeOpacity={0.7}
            >
              <Image
                source={require('../../assets/images/Ícone do Jogo Comer Saudavelmente.png')}
                style={styles.moduleIcon}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.moduleButton}
              onPress={() => navigateToGame('Tomar Medicamentos')}
              activeOpacity={0.7}
            >
              <Image
                source={require('../../assets/images/ícone de tomar os medicamentos.png')}
                style={styles.moduleIcon}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.moduleButton}
              onPress={() => navigateToGame('Resolver Problemas')}
              activeOpacity={0.7}
            >
              <Image
                source={require('../../assets/images/ícone de resolver problemas.png')}
                style={styles.moduleIcon}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.moduleButton}
              onPress={() => navigateToGame('Vigiar Taxas')}
              activeOpacity={0.7}
            >
              <Image
                source={require('../../assets/images/ícone de vigiar as taxas.png')}
                style={styles.moduleIcon}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.moduleButton}
              onPress={() => navigateToGame('Atividade Física')}
              activeOpacity={0.7}
            >
              <Image
                source={require('../../assets/images/ícone de atividade física.png')}
                style={styles.moduleIcon}
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  background: { flex: 1, width: '100%', height: '100%' },
  safeArea: { flex: 1 },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
    alignItems: 'center',
  },

  // Estilos do Cartão de Glicemia
  topCard: {
    backgroundColor: 'white',
    width: '100%',
    maxWidth: 350,
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    zIndex: 10,
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
  }, // Gotinha feita com CSS
  cardTitle: { fontSize: 24, fontWeight: 'bold', color: '#6C5141' },
  progressBar: { flex: 1, height: 12, backgroundColor: '#E0E0E0', borderRadius: 6, marginLeft: 15 },
  progressFill: { width: '70%', height: '100%', backgroundColor: '#8DB863', borderRadius: 6 },
  cardBody: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  valueRow: { flexDirection: 'row', alignItems: 'baseline' },
  glicemiaValue: { fontSize: 48, fontWeight: '900', color: '#6C5141', lineHeight: 50 },
  glicemiaUnit: { fontSize: 18, fontWeight: 'bold', color: '#6C5141', marginLeft: 5 },

  // Estilos da Pontuação Global
  scoreContainer: {
    alignItems: 'center',
    backgroundColor: '#F29C38',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
  },
  scoreLabel: { fontSize: 14, fontFamily: 'Chewy_400Regular', color: 'white' },
  scoreValue: { fontSize: 22, fontFamily: 'Chewy_400Regular', color: 'white' },

  // Estilos do Personagem
  characterContainer: { width: '100%', alignItems: 'center', marginVertical: 20, zIndex: 5 },
  characterImage: { width: 180, height: 220 },

  // Estilos do Grid de Módulos (Responsivo)
  modulesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 15,
    width: '100%',
    maxWidth: 350,
  },
  moduleButton: {
    width: '28%',
    aspectRatio: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 50,
    padding: 5,
  },
  moduleIcon: { width: '100%', height: '100%', resizeMode: 'contain' },
});
