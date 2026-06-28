import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AnimatedFloat } from './AnimatedElements';

interface VictoryModalProps {
  visible: boolean;
  pointsEarned: number;
  moduleName?: string;
}

const { width } = Dimensions.get('window');

export default function VictoryModal({
  visible,
  pointsEarned,
  moduleName = 'Módulo',
}: VictoryModalProps) {
  const router = useRouter();

  const handleClose = () => {
    // O fechamento obrigatoriamente redireciona o usuário de volta ao Dashboard limpo
    router.replace('/(tabs)/onboarding');
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <AnimatedFloat delay={0}>
          <View style={styles.card}>
            {/* Ícone festivo no topo */}
            <View style={styles.iconContainer}>
              <Ionicons name="star" size={60} color="#FFD700" />
            </View>

            <Text style={styles.title}>Parabéns!</Text>

            <Text style={styles.message}>Você concluiu o {moduleName} com sucesso!</Text>

            <View style={styles.pointsContainer}>
              <Text style={styles.pointsLabel}>Pontos Ganhos:</Text>
              <Text style={styles.pointsValue}>+{pointsEarned}</Text>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleClose} activeOpacity={0.8}>
              <Text style={styles.buttonText}>VOLTAR AOS MINIGAMES</Text>
            </TouchableOpacity>
          </View>
        </AnimatedFloat>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: width * 0.85,
    maxWidth: 350,
    backgroundColor: '#F0FFF0',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#4CAF50',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  iconContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#FFF9C4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 3,
    borderColor: '#FFD700',
    marginTop: -50, // Faz o ícone "saltar" para fora do card
  },
  title: {
    fontSize: 32,
    fontFamily: 'Chewy_400Regular',
    color: '#2E7D32',
    marginBottom: 10,
  },
  message: {
    fontSize: 20,
    fontFamily: 'Chewy_400Regular',
    color: '#4e342e',
    textAlign: 'center',
    marginBottom: 20,
  },
  pointsContainer: {
    backgroundColor: '#6C5141',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 25,
    width: '100%',
  },
  pointsLabel: {
    fontSize: 16,
    color: '#E0E0E0',
    fontFamily: 'Chewy_400Regular',
    marginBottom: 5,
  },
  pointsValue: {
    fontSize: 36,
    color: '#FFD700',
    fontFamily: 'Chewy_400Regular',
  },
  button: {
    backgroundColor: '#8DB863',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'Chewy_400Regular',
  },
});
