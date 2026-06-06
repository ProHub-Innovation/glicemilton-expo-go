// constants/quiz.ts
// Perguntas, alternativas e gabaritos do módulo Quiz (Reduzir Riscos).
// Cada casa numerada da trilha (1–15) dispara uma pergunta desta lista por índice rotativo.

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  correctId: string;
}

export const POINTS_PER_CORRECT_ANSWER = 10;
export const TOTAL_BOARD_SQUARES = 17; // casa 0 (início) + 15 numeradas + casa 16 (chegada)
export const NUMBERED_SQUARES = 15; // casas que disparam quiz

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question:
      'Além de tomar a medicação, qual é um dos comportamentos de estilo de vida mais importantes para reduzir os riscos do diabetes?',
    options: [
      { id: 'a', text: 'Comer mais doce' },
      { id: 'b', text: 'Parar de beber água' },
      { id: 'c', text: 'Fazer exercícios físicos regularmente' },
      { id: 'd', text: 'Ignorar o estresse' },
    ],
    correctId: 'c',
  },
  {
    id: 'q2',
    question:
      'Qual exame é usado para verificar a média do açúcar no sangue em um período de 2 a 3 meses?',
    options: [
      { id: 'a', text: 'Exame de Colesterol' },
      { id: 'b', text: 'Avaliação da função renal' },
      { id: 'c', text: 'Teste rápido na ponta do dedo' },
      { id: 'd', text: 'Hemoglobina Glicada' },
    ],
    correctId: 'd',
  },
  {
    id: 'q3',
    question:
      'Cuidar dos aspectos emocionais é importante porque as emoções podem afetar diretamente qual aspecto do controle do diabetes?',
    options: [
      { id: 'a', text: 'A cor da pele' },
      { id: 'b', text: 'Os níveis de glicose no sangue' },
      { id: 'c', text: 'A altura da pessoa' },
      { id: 'd', text: 'A força muscular' },
    ],
    correctId: 'b',
  },
  {
    id: 'q4',
    question:
      'O exame de Fundo de Olho é essencial na prevenção de riscos do diabetes para proteger qual parte vital do corpo?',
    options: [
      { id: 'a', text: 'Os rins' },
      { id: 'b', text: 'Os pés' },
      { id: 'c', text: 'A visão' },
      { id: 'd', text: 'O coração' },
    ],
    correctId: 'c',
  },
  {
    id: 'q5',
    question:
      'Por que é importante para Glicemilton conhecer como o medicamento prescrito funciona no organismo?',
    options: [
      { id: 'a', text: 'Para poder vender o medicamento' },
      { id: 'b', text: 'Para poder criar novos remédios' },
      { id: 'c', text: 'Para poder parar de tomá-lo' },
      {
        id: 'd',
        text: 'Para fazer uma tomada de decisão adequada e ter mais adesão ao tratamento',
      },
    ],
    correctId: 'd',
  },
  {
    id: 'q6',
    question:
      'Se você vivenciar possíveis efeitos colaterais de um medicamento, qual é o procedimento correto?',
    options: [
      { id: 'a', text: 'Ignorar e esperar que passe' },
      { id: 'b', text: 'Parar de tomar o remédio imediatamente' },
      { id: 'c', text: 'Tomar uma dose extra' },
      { id: 'd', text: 'Relatar o problema à equipe médica' },
    ],
    correctId: 'd',
  },
];
