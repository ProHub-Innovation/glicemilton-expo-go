import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Nota: Removi o import do POINTS_PER_CORRECT_ANSWER pois não vamos mais usar a mensagem
import { QuizQuestion } from '@/constants/quiz';

interface QuizModalProps {
  visible: boolean;
  question: QuizQuestion;
  onAnswer: (isCorrect: boolean) => void;
}

export function QuizModal({ visible, question, onAnswer }: QuizModalProps) {
  function handleOption(optionId: string) {
    onAnswer(optionId === question.correctId);
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.label}>PERGUNTA</Text>
          <Text style={styles.question}>{question.question}</Text>

          <View style={styles.options}>
            {question.options.map((opt) => (
              <TouchableOpacity
                key={opt.id}
                style={styles.option}
                onPress={() => handleOption(opt.id)}
                activeOpacity={0.6}
              >
                {/* Juntei a letra e o texto na mesma tag para centralizar perfeitamente */}
                <Text style={styles.optionText}>
                  {opt.id.toUpperCase()}. {opt.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)', // Fundo escurecido suave
    justifyContent: 'center', // Centraliza na vertical
    alignItems: 'center', // Centraliza na horizontal
  },
  card: {
    backgroundColor: 'rgba(235, 226, 216, 0.81)', // Fundo bege translúcido idêntico ao protótipo
    width: '85%', // Ocupa 85% da tela, formando um formato agradável
    borderRadius: 0, // Bordas retas
    padding: 30, // Respiro interno maior
    gap: 24, // Espaço entre título, pergunta e opções
    alignItems: 'center', // Centraliza todo o texto interno

    // Sombrinha para descolar a caixa das folhas do fundo
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  label: {
    fontSize: 36, // Aumentei um pouquinho para dar mais destaque
    color: '#6D4C41',
    textAlign: 'center',
    fontFamily: 'Chewy_400Regular', // Aqui está a fonte que usamos antes!
  },
  question: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6D4C41', // Fonte marrom
    textAlign: 'center', // Texto centralizado
    lineHeight: 26, // Espaçamento entre linhas agradável para leitura
  },
  options: {
    gap: 16, // Espaço entre as alternativas
    width: '100%',
  },
  option: {
    paddingVertical: 4, // Área de clique vertical
    paddingHorizontal: 10,
    alignItems: 'center', // Centraliza o texto do botão
  },
  optionText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#6D4C41', // Marrom nas opções também
    textAlign: 'center',
  },
});
