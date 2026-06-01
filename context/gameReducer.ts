// context/gameReducer.ts
// Reducer puro — sem efeitos colaterais, sem dependências externas.
// Toda mutação de estado passa obrigatoriamente por aqui.

import { GameAction, GameState } from './GameContext.types';

export const INITIAL_STATE: GameState = {
  totalPoints: 0,
  moduleScores: [],
  sessionStartedAt: 0,
};

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'ADD_POINTS': {
      const { moduleId, points } = action.payload;

      if (points <= 0) {
        // Pontos inválidos não alteram o estado — imutabilidade garantida
        return state;
      }

      const entry = {
        moduleId,
        points,
        completedAt: action.payload.completedAt,
      };

      return {
        ...state,
        totalPoints: state.totalPoints + points,
        moduleScores: [...state.moduleScores, entry],
      };
    }

    case 'RESET_SESSION': {
      return {
        ...INITIAL_STATE,
        sessionStartedAt: action.payload.sessionStartedAt, // novo timestamp para a sessão reiniciada
      };
    }

    default: {
      // Garante exhaustive check em TypeScript — never deve ser atingível
      const _exhaustiveCheck: never = action;
      return _exhaustiveCheck;
    }
  }
}
