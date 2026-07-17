import { SplashScreen, Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { useFonts, Chewy_400Regular } from '@expo-google-fonts/chewy';

import { GameProvider } from '../context/GameContext';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    Chewy_400Regular,
  });

  useEffect(() => {
    if (fontsLoaded || error) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    <GameProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </GameProvider>
  );
}
