import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleProp, ViewStyle, useWindowDimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';

// 1. ANIMATED FLOAT
interface AnimatedFloatProps {
  children: React.ReactNode;
  delay?: number;
  style?: StyleProp<ViewStyle>;
}

export const AnimatedFloat = ({ children, delay = 0, style }: AnimatedFloatProps) => {
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
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
    );
    animation.start();
    return () => animation.stop();
  }, [delay, translateY]);

  return <Animated.View style={[style, { transform: [{ translateY }] }]}>{children}</Animated.View>;
};

// 2. ANIMATED CLOUD
interface AnimatedCloudProps {
  top: string | number;
  width: number;
  duration: number;
  initialX: number;
  opacity?: number;
}

export const AnimatedCloud = ({
  top,
  width: cloudWidth,
  duration,
  initialX,
  opacity = 1,
}: AnimatedCloudProps) => {
  // Hook responsivo adicionado dentro do componente para se adaptar à tela
  const { width } = useWindowDimensions();
  const translateX = useRef(new Animated.Value(initialX)).current;

  useEffect(() => {
    const totalDistance = width + 50 + cloudWidth + 50;
    const distanceLeft = initialX - (-cloudWidth - 50);
    const firstDuration = duration * (distanceLeft / totalDistance);

    const animation = Animated.sequence([
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
    ]);
    animation.start();
    return () => animation.stop();
  }, [cloudWidth, duration, initialX, translateX, width]);

  return (
    <Animated.View
      style={
        {
          position: 'absolute',
          top,
          width: cloudWidth,
          opacity,
          transform: [{ translateX }],
          zIndex: 1,
        } as any
      }
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

// 3. GRASS CLUMP
interface GrassClumpProps {
  left: string | number;
  delay: number;
  scale: number;
}

export const GrassClump = ({ left, delay, scale }: GrassClumpProps) => {
  const rotate = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    const animation = Animated.loop(
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
    );
    animation.start();
    return () => animation.stop();
  }, [delay, rotate]);

  const spin = rotate.interpolate({ inputRange: [-1, 1], outputRange: ['-8deg', '8deg'] });
  return (
    <Animated.View
      style={[
        { position: 'absolute', bottom: -10, left, width: 50, height: 50, zIndex: 3 },
        { transform: [{ scale }, { rotate: spin }] } as any,
      ]}
    >
      <Svg viewBox="0 0 50 50" width="100%" height="100%">
        <Path d="M 25 50 Q 15 25 10 0 Q 20 20 25 50 Z" fill="#7DB045" />
        <Path d="M 25 50 Q 25 25 30 5 Q 30 30 25 50 Z" fill="#8AC24E" />
        <Path d="M 25 50 Q 35 30 45 10 Q 35 35 25 50 Z" fill="#6A9C3A" />
      </Svg>
    </Animated.View>
  );
};
