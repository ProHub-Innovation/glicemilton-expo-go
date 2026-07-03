// app/_layout.tsx
// Layout raiz da aplicação — ponto de entrada do Expo Router.
// O GameProvider deve ficar aqui para que todos os módulos acessem o contexto.

import { Stack } from 'expo-router';
import React from 'react';

import { GameProvider } from '../context/GameContext';

export default function RootLayout() {
  return (
    <GameProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </GameProvider>
  );
}
