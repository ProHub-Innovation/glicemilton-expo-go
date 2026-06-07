import React, { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';

// 1. Definindo as regras exatas do nosso contexto
export interface ScoreContextType {
  score: number;
  addScore: (points: number) => void;
}

// 2. Criando o contexto sem o tipo "any"
const ScoreContext = createContext<ScoreContextType | undefined>(undefined);

// 3. Provedor do Contexto
export const ScoreProvider = ({ children }: { children: ReactNode }) => {
  const [score, setScore] = useState(0);

  const addScore = useCallback((points: number) => {
    setScore((prevScore) => prevScore + points);
  }, []);

  const contextValue = useMemo(() => ({ score, addScore }), [score, addScore]);

  return <ScoreContext.Provider value={contextValue}>{children}</ScoreContext.Provider>;
};

// 4. Criando um Hook personalizado e super seguro para usar nas telas
export const useScore = () => {
  const context = useContext(ScoreContext);
  if (context === undefined) {
    throw new Error('useScore deve ser usado dentro de um ScoreProvider');
  }
  return context;
};
