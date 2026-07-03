// context/GameContext.types.ts
// Tipos e interfaces do estado global de jogo.
// Exportados separadamente para uso em constantes e componentes sem importar o contexto inteiro.

export type ModuleId =
  | 'prato'
  | 'exercicios'
  | 'glicemia'
  | 'labirinto'
  | 'medicamentos'
  | 'quiz'
  | 'modulo6_vigiar_taxas'
  | 'modulo_cartoes';

export interface ModuleScore {
  moduleId: ModuleId;
  points: number;
  completedAt: number; // timestamp em ms
}

export interface GameState {
  totalPoints: number;
  moduleScores: ModuleScore[];
  sessionStartedAt: number; // timestamp em ms — início da sessão atual
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

export type GameAction =
  | {
      type: 'ADD_POINTS';
      payload: {
        moduleId: ModuleId;
        points: number;
        completedAt: number;
      };
    }
  | {
      type: 'RESET_SESSION';
      payload: {
        sessionStartedAt: number;
      };
    };

// ---------------------------------------------------------------------------
// Contexto
// ---------------------------------------------------------------------------

export interface GameContextValue {
  state: GameState;
  /** Soma pontos ao total global e registra no histórico do módulo. */
  addPoints: (moduleId: ModuleId, points: number) => void;
  /** Reinicia toda a sessão — score volta a 0. */
  resetSession: () => void;
}
