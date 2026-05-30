import { Chewy_400Regular, useFonts } from '@expo-google-fonts/chewy';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

const { width } = Dimensions.get('window');

// --- COMPONENTES ANIMADOS ---
const AnimatedFloat = ({ children, delay = 0, style }: any) => {
  const translateY = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: -12,
          duration: 2000,
          delay,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ])
    ).start();
  }, []);
  return <Animated.View style={[style, { transform: [{ translateY }] }]}>{children}</Animated.View>;
};

const AnimatedCloud = ({ top, width: cloudWidth, duration, initialX, opacity }: any) => {
  const translateX = useRef(new Animated.Value(initialX)).current;

  useEffect(() => {
    const totalDistance = width + 50 + cloudWidth + 50;
    const distanceLeft = initialX - (-cloudWidth - 50);
    const firstDuration = duration * (distanceLeft / totalDistance);

    Animated.sequence([
      Animated.timing(translateX, {
        toValue: -cloudWidth - 50,
        duration: firstDuration,
        useNativeDriver: true,
        easing: Easing.linear,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(translateX, { toValue: width + 50, duration: 0, useNativeDriver: true }),
          Animated.timing(translateX, {
            toValue: -cloudWidth - 50,
            duration: duration,
            useNativeDriver: true,
            easing: Easing.linear,
          }),
        ])
      ),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top,
        width: cloudWidth,
        opacity,
        transform: [{ translateX }],
        zIndex: 1,
      }}
    >
      <Svg viewBox="0 0 512 512" width="100%" height={cloudWidth * 0.6}>
        <Path
          fill="#FFFFFF"
          d="M417.4,228.6c-4.4-78.6-69.5-140.2-149.3-140.2c-46.7,0-88.6,21.6-116.5,55.4C137.9,134.7,120.3,130,101.4,130 c-56,0-101.4,45.4-101.4,101.4c0,56,45.4,101.4,101.4,101.4h316.1c52.2,0,94.5-42.3,94.5-94.5C511.9,281.8,470.9,240.2,417.4,228.6z"
        />
      </Svg>
    </Animated.View>
  );
};

const GrassClump = ({ left, delay, scale }: any) => {
  const rotate = useRef(new Animated.Value(-1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotate, {
          toValue: 1,
          duration: 1500,
          delay,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(rotate, {
          toValue: -1,
          duration: 1500,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ])
    ).start();
  }, []);
  const spin = rotate.interpolate({ inputRange: [-1, 1], outputRange: ['-8deg', '8deg'] });
  return (
    <Animated.View
      style={{
        position: 'absolute',
        bottom: -10,
        left,
        width: 50,
        height: 50,
        transform: [{ scale }, { rotate: spin }],
        zIndex: 3,
      }}
    >
      <Svg viewBox="0 0 50 50" width="100%" height="100%">
        <Path d="M 25 50 Q 15 25 10 0 Q 20 20 25 50 Z" fill="#7DB045" />
        <Path d="M 25 50 Q 25 25 30 5 Q 30 30 25 50 Z" fill="#8AC24E" />
        <Path d="M 25 50 Q 35 30 45 10 Q 35 35 25 50 Z" fill="#6A9C3A" />
      </Svg>
    </Animated.View>
  );
};

export default function HomeScreen() {
  const router = useRouter();
  const [fontsLoaded] = useFonts({ Chewy_400Regular });

  if (!fontsLoaded)
    return (
      <View style={styles.loadingContainer}>
        <Text>A carregar...</Text>
      </View>
    );

  return (
    <View style={styles.screenWrapper}>
      <ImageBackground
        source={require('../../assets/images/background.jpg')}
        style={styles.homeArea}
        imageStyle={{ transform: [{ scale: 1.1 }, { translateX: -15 }] }}
      >
        {/* Nuvens começando já espalhadas pela tela */}
        <AnimatedCloud top="5%" width={80} duration={30000} initialX={width * 0.1} opacity={0.9} />
        <AnimatedCloud
          top="20%"
          width={120}
          duration={45000}
          initialX={width * 0.6}
          opacity={0.7}
        />
        <AnimatedCloud top="8%" width={60} duration={50000} initialX={width * 0.9} opacity={0.6} />
        <AnimatedCloud top="28%" width={90} duration={35000} initialX={width * 0.3} opacity={0.8} />
        <AnimatedCloud
          top="2%"
          width={150}
          duration={60000}
          initialX={width * 0.75}
          opacity={0.5}
        />

        <AnimatedFloat style={styles.welcomeArea}>
          <Text style={styles.smallText}>Bem-vindo ao</Text>
          <View style={styles.titleRow}>
            <Text style={styles.bigTitle}>Glicemilt</Text>
            <Svg
              viewBox="0 0 100 100"
              width={32}
              height={32}
              style={{ marginTop: 8, marginHorizontal: 2 }}
            >
              <Path
                d="M 35 30 Q 28 10 20 15"
                fill="none"
                stroke="#523624"
                strokeWidth="5"
                strokeLinecap="round"
              />
              <Circle cx="20" cy="15" r="4" fill="#523624" />
              <Path
                d="M 65 30 Q 72 10 80 15"
                fill="none"
                stroke="#523624"
                strokeWidth="5"
                strokeLinecap="round"
              />
              <Circle cx="80" cy="15" r="4" fill="#523624" />
              <Circle cx="50" cy="60" r="34" fill="#BA7D53" stroke="#523624" strokeWidth="5" />
              <Circle cx="38" cy="55" r="5" fill="#523624" />
              <Circle cx="62" cy="55" r="5" fill="#523624" />
              <Path
                d="M 38 70 Q 50 82 62 70"
                fill="none"
                stroke="#523624"
                strokeWidth="4.5"
                strokeLinecap="round"
              />
            </Svg>
            <Text style={styles.bigTitle}>n!</Text>
          </View>
        </AnimatedFloat>

        {/* Navega para a aba de Login (two) */}
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => router.navigate('/two')}
          activeOpacity={0.8}
        >
          <Text style={styles.startButtonText}>COMEÇAR</Text>
        </TouchableOpacity>

        <AnimatedFloat style={styles.characterPosition}>
          <Image
            source={require('../../assets/images/character.png')}
            style={styles.characterImage}
            resizeMode="contain"
          />
        </AnimatedFloat>

        <GrassClump left="10%" delay={0} scale={1.2} />
        <GrassClump left="40%" delay={1000} scale={0.9} />
        <GrassClump left="75%" delay={500} scale={1.1} />
        <GrassClump left="90%" delay={2000} scale={0.8} />
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  screenWrapper: { flex: 1, backgroundColor: '#222' },
  homeArea: { flex: 1, width: '100%', alignItems: 'center' },
  welcomeArea: { position: 'absolute', top: '15%', alignItems: 'center', zIndex: 2 },
  smallText: {
    fontSize: 38,
    fontFamily: 'Chewy_400Regular',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
    marginBottom: -10,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center' },
  bigTitle: {
    fontSize: 48,
    fontFamily: 'Chewy_400Regular',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
  },
  startButton: {
    position: 'absolute',
    top: '45%',
    backgroundColor: '#B3E0FF',
    paddingVertical: 12,
    paddingHorizontal: 35,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#000',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  startButtonText: {
    fontFamily: 'Chewy_400Regular',
    fontSize: 24,
    color: '#000',
    textTransform: 'uppercase',
  },
  characterPosition: {
    position: 'absolute',
    bottom: '12%',
    left: '15%',
    width: 100,
    height: 100,
    zIndex: 2,
  },
  characterImage: { width: '100%', height: '100%' },
});
