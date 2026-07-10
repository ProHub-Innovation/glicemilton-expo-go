import React, { createContext, useCallback, useContext, useReducer } from 'react';

import { gameReducer, INITIAL_STATE } from './gameReducer';
import type { GameContextValue, ModuleId } from './GameContext.types';

const GameContext = createContext<GameContextValue | undefined>(undefined);
GameContext.displayName = 'GameContext';

interface GameProviderProps {
  children: React.ReactNode;
}

export function GameProvider({ children }: GameProviderProps) {
  const [state, dispatch] = useReducer(gameReducer, INITIAL_STATE, (initial) => ({
    ...initial,
    sessionStartedAt: Date.now(),
  }));

  const addPoints = useCallback((moduleId: ModuleId, points: number) => {
    dispatch({ type: 'ADD_POINTS', payload: { moduleId, points, completedAt: Date.now() } });
  }, []);

  const resetSession = useCallback(() => {
    dispatch({ type: 'RESET_SESSION', payload: { sessionStartedAt: Date.now() } });
  }, []);

  const value = React.useMemo(
    () => ({
      state,
      addPoints,
      resetSession,
    }),
    [state, addPoints, resetSession]
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

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
