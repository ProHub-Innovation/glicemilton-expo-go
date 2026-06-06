import React, { createContext, ReactNode, useCallback, useMemo, useState } from 'react';

export const ScoreContext = createContext<any>(null);

export const ScoreProvider = ({ children }: { children: ReactNode }) => {
  const [score, setScore] = useState(0); // Pontuação inicial

  const addScore = useCallback((points: number) => {
    setScore((prevScore) => prevScore + points);
  }, []);

  const contextValue = useMemo(() => ({ score, addScore }), [score, addScore]);

  return <ScoreContext.Provider value={contextValue}>{children}</ScoreContext.Provider>;
};
