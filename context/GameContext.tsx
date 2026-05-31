// context/GameContext.tsx
// Contexto global de jogo. Centraliza pontuação acumulada durante a sessão.
//
// Uso:
//   1. Envolva a raiz com <GameProvider> (ver app/_layout.tsx)
//   2. Em qualquer tela/componente: const { state, addPoints } = useGame();

import React, { createContext, useCallback, useContext, useReducer } from 'react';

import { gameReducer, INITIAL_STATE } from './gameReducer';
import type { GameContextValue, ModuleId } from './GameContext.types';

// ---------------------------------------------------------------------------
// Criação do contexto
// ---------------------------------------------------------------------------

const GameContext = createContext<GameContextValue | undefined>(undefined);
GameContext.displayName = 'GameContext';

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

interface GameProviderProps {
  children: React.ReactNode;
}

export function GameProvider({ children }: GameProviderProps) {
  const [state, dispatch] = useReducer(gameReducer, INITIAL_STATE);

  const addPoints = useCallback((moduleId: ModuleId, points: number) => {
    dispatch({ type: 'ADD_POINTS', payload: { moduleId, points } });
  }, []);

  const resetSession = useCallback(() => {
    dispatch({ type: 'RESET_SESSION' });
  }, []);

  const value: GameContextValue = {
    state,
    addPoints,
    resetSession,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Acessa o estado global de jogo.
 *
 * @throws {Error} Se chamado fora de um <GameProvider>.
 *
 * @example
 * const { state, addPoints } = useGame();
 * addPoints('quiz', 10);
 */
export function useGame(): GameContextValue {
  const context = useContext(GameContext);

  if (context === undefined) {
    throw new Error(
      '[useGame] deve ser utilizado dentro de um <GameProvider>.\n' +
        'Verifique se o GameProvider está injetado no layout raiz (app/_layout.tsx).'
    );
  }

  return context;
}
