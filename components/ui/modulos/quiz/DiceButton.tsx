import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface DiceButtonProps {
  lastRoll: number | null;
  isLocked: boolean;
  onRoll: (value: number) => void;
}

export function DiceButton({ lastRoll, isLocked, onRoll }: DiceButtonProps) {
  const [displayFace, setDisplayFace] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  function handlePress() {
    if (isLocked || isRolling) return;

    setIsRolling(true);
    let counter = 0;
    const maxSpins = 10;

    intervalRef.current = setInterval(() => {
      const randomFace = Math.floor(Math.random() * 6) + 1;
      setDisplayFace(randomFace);
      counter++;

      if (counter >= maxSpins) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        const finalRoll = Math.floor(Math.random() * 6) + 1;
        setDisplayFace(finalRoll);
        setIsRolling(false);
        onRoll(finalRoll);
      }
    }, 80);
  }

  const currentNumber =
    isRolling || displayFace !== null ? displayFace || 1 : lastRoll ? lastRoll : 1;

  const renderDots = () => {
    const dots: React.ReactElement[] = [];

    const dotMap: { [key: number]: number[] } = {
      1: [4],
      2: [0, 8],
      3: [0, 4, 8],
      4: [0, 2, 6, 8],
      5: [0, 2, 4, 6, 8],
      6: [0, 1, 2, 6, 7, 8],
    };

    const activePositions = dotMap[currentNumber] || [4];

    for (let i = 0; i < 9; i++) {
      const isActive = activePositions.includes(i);
      dots.push(
        <View key={i} style={styles.dotCell}>
          {isActive && <View style={styles.dot} />}
        </View>
      );
    }
    return dots;
  };

  return (
    <TouchableOpacity
      style={[styles.diceContainer, isLocked && styles.diceLocked]}
      onPress={handlePress}
      disabled={isLocked || isRolling}
      activeOpacity={0.8}
    >
      <View style={styles.diceOuterBorder}>
        <View style={styles.diceBody}>
          <View style={styles.dotsGrid}>{renderDots()}</View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  diceContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },
  diceLocked: {
    opacity: 0.5,
    transform: [{ rotate: '-8deg' }, { scale: 0.95 }],
  },
  diceOuterBorder: {
    width: 90,
    height: 90,
    backgroundColor: '#D2D7DF',
    borderRadius: 22,
    padding: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  diceBody: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 19,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotsGrid: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dotCell: {
    width: '33.33%',
    height: '33.33%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#0A142F',
  },
});
