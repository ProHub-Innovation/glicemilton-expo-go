import { useGame } from '@/context/GameContext';
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { AnimatedFloat } from '../../components/AnimatedElements';

export default function DashboardScreen() {
  const router = useRouter();
  const { state } = useGame();

  const [modalVisible, setModalVisible] = useState(false);
  const [registro, setRegistro] = useState({
    data: '',
    hora: '',
    condicao: '',
    indice: '',
  });

  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(withTiming(1.1, { duration: 800 }), withTiming(1, { duration: 800 })),
      -1,
      true
    );
  }, []);

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const navigateToGame = (gameName: string) => {
    if (gameName === 'Vigiar Taxas' || gameName === 'Medir Glicemia') {
      router.push('/modulos/vigiarTaxas');
    } else if (gameName === 'Adaptação Saudável') {
      router.push('/modulos/labirinto');
    } else if (gameName === 'Atividade Física') {
      router.push('/modulos/corrida');
    } else {
      Alert.alert('Em breve', `O módulo ${gameName} ainda está em desenvolvimento!`);
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/images/fundo_zoom.jpg')}
      style={styles.background}
      resizeMode="cover"
      imageStyle={{ transform: [{ scale: 1.08 }, { translateY: 15 }] }}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.circleButton}>
            <MaterialCommunityIcons name="cog" size={24} color="white" />
          </TouchableOpacity>

          <Animated.View style={animatedButtonStyle}>
            <TouchableOpacity style={styles.circleButton} onPress={() => setModalVisible(true)}>
              <MaterialCommunityIcons name="folder" size={24} color="white" />
            </TouchableOpacity>
          </Animated.View>
        </View>

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
              <Text style={styles.scoreLabel}>Points</Text>
              <Text style={styles.scoreValue}>{state.totalPoints}</Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomSection}>
          <AnimatedFloat>
            <Image
              source={require('../../assets/images/glicemilton_feliz.png')}
              style={styles.characterImage}
              resizeMode="contain"
            />
          </AnimatedFloat>

          <View style={styles.bottomGrid}>
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
                onPress={() => router.navigate('/modulos/prato')}
              >
                <Image
                  source={require('../../assets/images/icone_comer_saudavelmente.png')}
                  style={styles.moduleIcon}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.gridRow}>
              <TouchableOpacity
                style={[styles.moduleButton, { width: '22%' }]}
                onPress={() => router.navigate('/modulos/medicamentos')}
              >
                <Image
                  source={require('../../assets/images/icone_tomar_medicamentos.png')}
                  style={styles.moduleIcon}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.moduleButton, { width: '22%' }]}
                onPress={() => router.navigate('/modulos/cartoes')}
              >
                <Image
                  source={require('../../assets/images/icone_resolver_problemas.png')}
                  style={styles.moduleIcon}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.moduleButton, { width: '24%' }]}
                onPress={() => navigateToGame('Medir Glicemia')}
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

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <ImageBackground
              source={require('../../assets/images/fundo_zoom.jpg')}
              style={styles.modalBg}
              resizeMode="cover"
            >
              <SafeAreaView style={styles.modalSafeArea}>
                <KeyboardAvoidingView
                  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                  style={{ flex: 1 }}
                >
                  <View style={styles.notebookContainer}>
                    <Text style={styles.notebookTitle}>Registros anteriores</Text>

                    <ScrollView contentContainerStyle={styles.notebookContent}>
                      <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Data:</Text>
                        <TextInput
                          style={styles.input}
                          value={registro.data}
                          onChangeText={(t) => setRegistro({ ...registro, data: t })}
                          placeholder="Ex: 10/10/2023"
                        />
                      </View>

                      <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Hora:</Text>
                        <TextInput
                          style={styles.input}
                          value={registro.hora}
                          onChangeText={(t) => setRegistro({ ...registro, hora: t })}
                          placeholder="Ex: 08:30"
                        />
                      </View>

                      <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Condição:</Text>
                        <Text style={styles.inputSubLabel}>
                          Em jejum / Antes de comer / 1h depois de comer / 2h depois de comer
                        </Text>
                        <TextInput
                          style={styles.input}
                          value={registro.condicao}
                          onChangeText={(t) => setRegistro({ ...registro, condicao: t })}
                          placeholder="Digite a condição..."
                        />
                      </View>

                      <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Índice glicemico (mg/dL):</Text>
                        <TextInput
                          style={styles.input}
                          value={registro.indice}
                          onChangeText={(t) => setRegistro({ ...registro, indice: t })}
                          placeholder="Ex: 110"
                          keyboardType="numeric"
                        />
                      </View>
                    </ScrollView>

                    <TouchableOpacity
                      style={styles.closeModalBtn}
                      onPress={() => setModalVisible(false)}
                    >
                      <MaterialCommunityIcons name="home" size={30} color="white" />
                    </TouchableOpacity>
                  </View>
                </KeyboardAvoidingView>
              </SafeAreaView>
            </ImageBackground>
          </View>
        </Modal>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, width: '100%', height: '100%' },
  safeArea: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
    justifyContent: 'space-between',
  },
  headerButtons: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 10,
    zIndex: 10,
  },
  circleButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(108, 81, 65, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
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

  modalOverlay: { flex: 1 },
  modalBg: { flex: 1 },
  modalSafeArea: { flex: 1 },
  notebookContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    margin: 20,
    borderRadius: 25,
    padding: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  notebookTitle: {
    fontSize: 32,
    fontFamily: 'Chewy_400Regular',
    color: '#8B5E3C',
    textAlign: 'center',
    marginBottom: 20,
  },
  notebookContent: { paddingBottom: 20 },
  inputGroup: { marginBottom: 20 },
  inputLabel: {
    fontSize: 24,
    fontFamily: 'Chewy_400Regular',
    color: '#6C5141',
    marginBottom: 5,
  },
  inputSubLabel: {
    fontSize: 12,
    color: '#8B5E3C',
    fontWeight: 'bold',
    marginBottom: 5,
    lineHeight: 16,
  },
  input: {
    fontSize: 18,
    color: '#6C5141',
    borderBottomWidth: 1,
    borderBottomColor: '#D2B48C',
    paddingVertical: 5,
  },
  closeModalBtn: {
    alignSelf: 'center',
    backgroundColor: '#8B5E3C',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
});
