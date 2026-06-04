import React, { createContext, ReactNode, useState } from 'react';

// Tipagem do nosso Contexto
interface ScoreContextData {
  score: number;
  addScore: (points: number) => void;
}

// Criação do Contexto com valores iniciais vazios
export const ScoreContext = createContext<ScoreContextData>({} as ScoreContextData);

// Provedor do Contexto que vai abraçar o nosso aplicativo
export const ScoreProvider = ({ children }: { children: ReactNode }) => {
  const [score, setScore] = useState(0); // Pontuação inicial

  const addScore = (points: number) => {
    setScore((prevScore) => prevScore + points);
  };

  return <ScoreContext.Provider value={{ score, addScore }}>{children}</ScoreContext.Provider>;
};
