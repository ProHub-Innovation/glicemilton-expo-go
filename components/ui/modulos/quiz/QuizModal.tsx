import React, { useState, useEffect, useRef } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { QuizQuestion } from '@/constants/quiz';

interface QuizModalProps {
  visible: boolean;
  question: QuizQuestion;
  onAnswer: (isCorrect: boolean) => void;
}

export function QuizModal({ visible, question, onAnswer }: QuizModalProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      // Se o modal for fechado ou a tela destruída, o React cancela o timer
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Reseta as cores sempre que uma nova pergunta abrir
  useEffect(() => {
    if (visible) {
      setSelectedOption(null);
      setIsAnswered(false);
    }
  }, [visible, question]);

  function handleOption(optionId: string) {
    if (isAnswered) return;

    setSelectedOption(optionId);
    setIsAnswered(true);

    const isCorrect = optionId === question.correctId;

    // 3. GUARDAMOS O TEMPORIZADOR DENTRO DA REFERÊNCIA
    timeoutRef.current = setTimeout(() => {
      onAnswer(isCorrect);
    }, 2000);
  }

  // Função para definir a cor de fundo do botão
  function getOptionStyle(optionId: string) {
    if (!isAnswered) return styles.optionDefault;

    if (optionId === question.correctId) {
      return [styles.optionDefault, styles.optionCorrect]; // Certo = Verde
    }

    if (optionId === selectedOption && optionId !== question.correctId) {
      return [styles.optionDefault, styles.optionWrong]; // Errado = Vermelho
    }

    return [styles.optionDefault, styles.optionDisabled]; // Outros ficam opacos
  }

  // Função para definir a cor do texto (branco quando tem fundo colorido)
  function getOptionTextStyle(optionId: string) {
    if (!isAnswered) return styles.optionTextDefault;

    if (optionId === question.correctId || optionId === selectedOption) {
      return [styles.optionTextDefault, styles.optionTextWhite];
    }

    return [styles.optionTextDefault, styles.optionTextDisabled];
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
                style={getOptionStyle(opt.id)}
                onPress={() => handleOption(opt.id)}
                activeOpacity={0.7}
                disabled={isAnswered} // Desativa o botão após o clique
              >
                <Text style={getOptionTextStyle(opt.id)}>
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
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'rgba(235, 226, 216, 0.92)',
    width: '85%',
    borderRadius: 0,
    padding: 30,
    gap: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  label: {
    fontSize: 36,
    color: '#6D4C41',
    textAlign: 'center',
    fontFamily: 'Chewy_400Regular',
  },
  question: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6D4C41',
    textAlign: 'center',
    lineHeight: 26,
  },
  options: {
    gap: 12,
    width: '100%',
  },

  // --- NOVOS ESTILOS PARA O FEEDBACK DE CORES ---
  optionDefault: {
    paddingVertical: 12, // Aumentei o padding para o fundo colorido ficar bonito
    paddingHorizontal: 16,
    alignItems: 'center',
    borderRadius: 8, // Bordas suaves no botão
    backgroundColor: 'transparent',
  },
  optionCorrect: {
    backgroundColor: '#4CAF50', // Verde Sucesso
  },
  optionWrong: {
    backgroundColor: '#E53935', // Vermelho Erro
  },
  optionDisabled: {
    opacity: 0.4, // Deixa as alternativas não selecionadas clarinhas
  },
  optionTextDefault: {
    fontSize: 17,
    fontWeight: '700',
    color: '#6D4C41',
    textAlign: 'center',
  },
  optionTextWhite: {
    color: '#FFFFFF', // Texto branco para contrastar com o fundo verde/vermelho
  },
  optionTextDisabled: {
    color: '#8D6E63',
  },
});
