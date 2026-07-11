import React, { useState, useEffect } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { QuizQuestion, QuizOption } from '@/constants/quiz';

interface QuizModalProps {
  visible: boolean;
  question: QuizQuestion;
  onAnswer: (isCorrect: boolean) => void;
}

export function QuizModal({ visible, question, onAnswer }: QuizModalProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

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
  }

  function handleContinue() {
    const isCorrect = selectedOption === question.correctId;
    onAnswer(isCorrect);
  }

  function getOptionStyle(optionId: string) {
    if (!isAnswered) return styles.optionDefault;

    if (optionId === question.correctId) {
      return [styles.optionDefault, styles.optionCorrect];
    }

    if (optionId === selectedOption && optionId !== question.correctId) {
      return [styles.optionDefault, styles.optionWrong];
    }

    return [styles.optionDefault, styles.optionDisabled];
  }

  function getOptionTextStyle(optionId: string) {
    if (!isAnswered) return styles.optionTextDefault;

    if (optionId === question.correctId || optionId === selectedOption) {
      return [styles.optionTextDefault, styles.optionTextWhite];
    }

    return [styles.optionTextDefault, styles.optionTextDisabled];
  }

  const currentExplanation =
    isAnswered && selectedOption
      ? question.options.find((opt) => opt.id === selectedOption)?.explanation
      : '';

  const isCorrectAnswer = selectedOption === question.correctId;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.label}>PERGUNTA</Text>
            <Text style={styles.question}>{question.question}</Text>

            <View style={styles.options}>
              {question.options.map((opt: QuizOption) => (
                <TouchableOpacity
                  key={opt.id}
                  style={getOptionStyle(opt.id)}
                  onPress={() => handleOption(opt.id)}
                  activeOpacity={0.7}
                  disabled={isAnswered}
                >
                  <Text style={getOptionTextStyle(opt.id)}>
                    {opt.id.toUpperCase()}. {opt.text}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {isAnswered && (
              <View
                style={[
                  styles.explanationBox,
                  isCorrectAnswer ? styles.explanationBoxCorrect : styles.explanationBoxWrong,
                ]}
              >
                <Text style={styles.explanationTitle}>
                  {isCorrectAnswer ? 'Mandou bem!' : 'Atenção!'}
                </Text>
                <Text style={styles.explanationText}>{currentExplanation}</Text>

                <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
                  <Text style={styles.continueButtonText}>Continuar</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'rgba(235, 226, 216, 0.98)',
    width: '90%',
    maxHeight: '85%',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  scrollContent: {
    padding: 24,
    gap: 20,
    alignItems: 'center',
  },
  label: {
    fontSize: 32,
    color: '#6D4C41',
    textAlign: 'center',
    fontFamily: 'Chewy_400Regular',
  },
  question: {
    fontSize: 17,
    fontWeight: '600',
    color: '#3E2723',
    textAlign: 'center',
    lineHeight: 24,
  },
  options: {
    gap: 12,
    width: '100%',
  },
  optionDefault: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  optionCorrect: {
    backgroundColor: '#4CAF50',
  },
  optionWrong: {
    backgroundColor: '#E53935',
  },
  optionDisabled: {
    opacity: 0.4,
  },
  optionTextDefault: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6D4C41',
    textAlign: 'center',
  },
  optionTextWhite: {
    color: '#FFFFFF',
  },
  optionTextDisabled: {
    color: '#8D6E63',
  },
  explanationBox: {
    width: '100%',
    marginTop: 10,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
  },
  explanationBoxCorrect: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
  },
  explanationBoxWrong: {
    backgroundColor: '#FFEBEE',
    borderColor: '#E53935',
  },
  explanationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3E2723',
    marginBottom: 8,
  },
  explanationText: {
    fontSize: 15,
    color: '#4E342E',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
  },
  continueButton: {
    backgroundColor: '#6D4C41',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});
