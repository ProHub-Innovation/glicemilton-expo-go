import React from 'react';
import { StyleSheet, Text, View, DimensionValue, Image } from 'react-native';

interface BoardTrailProps {
  currentPosition: number;
}

interface SquarePosition {
  id: number;
  top: DimensionValue;
  left: DimensionValue;
  rotate: number; // Trabalhando apenas com números
}

const SQUARES_POSITIONS: SquarePosition[] = [
  { id: 0, top: '8%', left: '85%', rotate: -15 },
  { id: 1, top: '10%', left: '60%', rotate: -5 },
  { id: 2, top: '15%', left: '39%', rotate: 30 },
  { id: 3, top: '22%', left: '18%', rotate: -20 },
  { id: 4, top: '30%', left: '40%', rotate: -100 },
  { id: 5, top: '30%', left: '70%', rotate: -270 },
  { id: 6, top: '37%', left: '85%', rotate: -100 },
  { id: 7, top: '45%', left: '62%', rotate: -20 },
  { id: 8, top: '46%', left: '38%', rotate: -20 },
  { id: 9, top: '53%', left: '20%', rotate: 20 },
  { id: 10, top: '60%', left: '37%', rotate: -100 },
  { id: 11, top: '61%', left: '60%', rotate: 70 },
  { id: 12, top: '63%', left: '80%', rotate: -90 },
  { id: 13, top: '75%', left: '80%', rotate: 70 },
  { id: 14, top: '80%', left: '55%', rotate: -60 },
  { id: 15, top: '78%', left: '28%', rotate: -15 },
  { id: 16, top: '85%', left: '15%', rotate: 45 },
];

export function BoardTrail({ currentPosition }: BoardTrailProps) {
  return (
    <View style={styles.boardContainer}>
      {SQUARES_POSITIONS.map((square, index) => {
        const isSpecialLeaf = index === 0 || index === 16;

        // Juntamos a rotação da folha e a escala da folha cinza no mesmo array
        const imageTransforms: ({ rotate: string } | { scale: number })[] = [
          { rotate: `${square.rotate}deg` },
        ];
        if (isSpecialLeaf) {
          imageTransforms.push({ scale: 1.3 });
        }

        return (
          <View
            key={square.id}
            style={[
              styles.leafWrapper,
              // A ROTAÇÃO SAIU DO CONTÊINER PAI
              { top: square.top, left: square.left },
            ]}
          >
            {/* A ROTAÇÃO É APLICADA APENAS DIRETAMENTE NA IMAGEM */}
            <Image
              source={
                isSpecialLeaf
                  ? require('@/assets/images/folhas/folha_cinza.png')
                  : require('@/assets/images/folhas/folha_verde.png')
              }
              style={[styles.leafImage, { transform: imageTransforms }]}
              resizeMode="contain"
            />

            {/* O NÚMERO NÃO PRECISA MAIS DE ROTAÇÃO INVERTIDA */}
            {!isSpecialLeaf && <Text style={styles.leafNumber}>{index}</Text>}

            {/* O GLICEMILTON FICA FIXO, SEMPRE NO EIXO VERTICAL DA TELA */}
            {index === currentPosition && (
              <View style={styles.mascotContainer}>
                <Image
                  source={require('@/assets/images/Glicemilton_feliz.png')}
                  style={styles.mascotToken}
                  resizeMode="contain"
                />
              </View>
            )}
            {index === 16 && currentPosition !== 16 && (
              <View style={styles.pinContainer}>
                <Image
                  source={require('@/assets/images/pin.png')}
                  style={styles.pinImage}
                  resizeMode="contain"
                />
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  pinContainer: {
    position: 'absolute',
    top: 0, // Ajuste para o pin ficar "espetado" levemente para cima da folha
    width: 40,
    height: 40,
    zIndex: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinImage: {
    width: '150%',
    height: '150%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
  },
  boardContainer: {
    width: '100%',
    height: 700,
    position: 'relative',
  },
  leafWrapper: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: 75,
    height: 75,
    zIndex: 5,
    marginLeft: -37.5,
    marginTop: -37.5,
  },
  leafImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  leafNumber: {
    fontFamily: 'Chewy_400Regular',
    fontSize: 24,
    color: '#3E2723',
    zIndex: 6,
    transform: [{ translateY: 0 }],
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  mascotContainer: {
    position: 'absolute',
    top: -45,
    width: 110,
    height: 110,
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mascotToken: {
    width: '100%',
    height: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});
