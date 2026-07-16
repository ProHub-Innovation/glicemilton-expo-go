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
  completedAt: number;
}

export interface GameState {
  totalPoints: number;
  moduleScores: ModuleScore[];
  sessionStartedAt: number;
}

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

export interface GameContextValue {
  state: GameState;
  addPoints: (moduleId: ModuleId, points: number) => void;
  resetSession: () => void;
}
