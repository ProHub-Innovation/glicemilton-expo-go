import { Chewy_400Regular } from '@expo-google-fonts/chewy';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Image, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { CARTOES_COLORS, CardItem, TABULEIRO_CARTOES } from '@/constants/cartoes';

export default function CardAssociationGrid({ onGameComplete }: { onGameComplete?: () => void }) {
  const [fontsLoaded] = useFonts({ Chewy_400Regular });

  const [firstSelected, setFirstSelected] = useState<CardItem | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Set<string>>(new Set());
  const [wrongIds, setWrongIds] = useState<Set<string>>(new Set());

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

  // --- LÓGICA DE VITÓRIA ATUALIZADA ---
  useEffect(() => {
    if (matchedPairs.size === 4) {
      // Adiciona um pequeno atraso para o usuário ver a última carta virar
      setTimeout(() => {
        onGameCompleteRef.current?.();
      }, 500);
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
    borderRadius: 18,
    borderWidth: 2,
    position: 'relative',
    overflow: 'hidden',
    elevation: 3,
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
});
