import React, { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';

export interface ScoreContextType {
  score: number;
  addScore: (points: number) => void;
}

const ScoreContext = createContext<ScoreContextType | undefined>(undefined);

export const ScoreProvider = ({ children }: { children: ReactNode }) => {
  const [score, setScore] = useState(0);

  const addScore = useCallback((points: number) => {
    setScore((prevScore) => prevScore + points);
  }, []);

  const contextValue = useMemo(() => ({ score, addScore }), [score, addScore]);

  return <ScoreContext.Provider value={contextValue}>{children}</ScoreContext.Provider>;
};


export const useScore = () => {
  const context = useContext(ScoreContext);
  if (context === undefined) {
    throw new Error('useScore deve ser usado dentro de um ScoreProvider');
  }
  return context;
};
