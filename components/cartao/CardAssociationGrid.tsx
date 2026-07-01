import { Chewy_400Regular } from '@expo-google-fonts/chewy';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Image, Modal, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { CARTOES_COLORS, CARTOES_THEORY, CardItem, TABULEIRO_CARTOES } from '@/constants/cartoes';

export default function CardAssociationGrid({ onGameComplete }: { onGameComplete?: () => void }) {
  const [fontsLoaded] = useFonts({ Chewy_400Regular });

  const [firstSelected, setFirstSelected] = useState<CardItem | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Set<string>>(new Set());
  const [wrongIds, setWrongIds] = useState<Set<string>>(new Set());
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

  const timerRef = useRef<any>(null);

  const onGameCompleteRef = useRef(onGameComplete);
  useEffect(() => {
    onGameCompleteRef.current = onGameComplete;
  });

  const tabuleiro = useMemo(() => {
    const cartas = [...TABULEIRO_CARTOES];
    for (let i = cartas.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cartas[i], cartas[j]] = [cartas[j], cartas[i]];
    }
    return cartas;
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (matchedPairs.size === 8) {
      setShowSuccessModal(true);
    }
  }, [matchedPairs]);

  if (!fontsLoaded) return null;

  const handleCardPress = (card: CardItem) => {
    if (matchedPairs.has(card.pairId) || wrongIds.size > 0) return;

    if (firstSelected && firstSelected.id === card.id) {
      return;
    }

    if (!firstSelected) {
      setFirstSelected(card);
    } else {
      if (firstSelected.pairId === card.pairId) {
        setMatchedPairs((prev) => {
          const next = new Set(prev);
          next.add(card.pairId);
          return next;
        });
        setFirstSelected(null);
      } else {
        setWrongIds(new Set([firstSelected.id, card.id]));
        setFirstSelected(null);

        timerRef.current = setTimeout(() => {
          setWrongIds(new Set());
        }, 1200);
      }
    }
  };

  const handleFinishGame = () => {
    setShowSuccessModal(false);
    onGameCompleteRef.current?.();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.gridContainer}>
        <View style={styles.grid}>
          {tabuleiro.map((item) => {
            const isMatched = matchedPairs.has(item.pairId);
            const isSelected = firstSelected?.id === item.id;
            const isWrong = wrongIds.has(item.id);

            const isRevealed = isMatched || isSelected || isWrong;

            let cardStyle = styles.cardHidden;

            if (isMatched) {
              cardStyle = styles.cardSuccess;
            } else if (isWrong) {
              cardStyle = styles.cardError;
            } else if (isSelected) {
              cardStyle = styles.cardSelected;
            }

            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.cardBase, cardStyle]}
                onPress={() => handleCardPress(item)}
                activeOpacity={isMatched ? 1 : 0.7}
                disabled={isMatched}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={item.alt}
              >
                {isRevealed ? (
                  <Image source={item.image} style={styles.cardImage} resizeMode="cover" />
                ) : (
                  <View style={styles.hiddenCover} />
                )}

                {isMatched && (
                  <View style={styles.iconOverlay}>
                    <MaterialCommunityIcons
                      name="check-circle"
                      size={18}
                      color={CARTOES_COLORS.successBorder}
                    />
                  </View>
                )}
                {isWrong && (
                  <View style={styles.iconOverlay}>
                    <MaterialCommunityIcons
                      name="close-circle"
                      size={18}
                      color={CARTOES_COLORS.errorBorder}
                    />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalEmoji}>🏆</Text>
            <Text style={styles.modalTitle}>{CARTOES_THEORY.successTitle}</Text>
            <Text style={styles.modalMessage}>{CARTOES_THEORY.successMessage}</Text>
            <TouchableOpacity style={styles.modalBtn} onPress={handleFinishGame}>
              <Text style={styles.modalBtnText}>Concluir</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  gridContainer: {
    width: '100%',
    paddingHorizontal: 16,
    paddingTop: 60,
    justifyContent: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    rowGap: 14,
  },
  cardBase: {
    width: '24%',
    aspectRatio: 0.42,
    borderRadius: 2,
    borderWidth: 2,
    position: 'relative',
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  hiddenCover: {
    flex: 1,
    backgroundColor: CARTOES_COLORS.cardBackBg,
  },
  iconOverlay: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 10,
    padding: 1,
  },
  cardHidden: {
    backgroundColor: CARTOES_COLORS.cardBackBg,
    borderColor: CARTOES_COLORS.cardBackBorder,
  },
  cardSelected: {
    backgroundColor: CARTOES_COLORS.selectedBg,
    borderColor: CARTOES_COLORS.selectedBorder,
  },
  cardSuccess: {
    backgroundColor: CARTOES_COLORS.successBg,
    borderColor: CARTOES_COLORS.successBorder,
  },
  cardError: {
    backgroundColor: CARTOES_COLORS.errorBg,
    borderColor: CARTOES_COLORS.errorBorder,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: CARTOES_COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 320,
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: CARTOES_COLORS.brandDark,
    backgroundColor: CARTOES_COLORS.white,
    alignSelf: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalEmoji: {
    fontSize: 54,
    marginBottom: 12,
  },
  modalTitle: {
    fontFamily: 'Chewy_400Regular',
    fontSize: 30,
    color: CARTOES_COLORS.brandDark,
    marginBottom: 8,
    textAlign: 'center',
    paddingHorizontal: 12,
  },
  modalMessage: {
    fontSize: 16,
    color: CARTOES_COLORS.textMuted,
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '500',
    lineHeight: 22,
    paddingHorizontal: 12,
  },
  modalBtn: {
    backgroundColor: CARTOES_COLORS.brandDark,
    paddingVertical: 14,
    borderRadius: 12,
    width: '90%',
    alignItems: 'center',
  },
  modalBtnText: {
    color: CARTOES_COLORS.white,
    fontSize: 18,
    fontFamily: 'Chewy_400Regular',
  },
});
