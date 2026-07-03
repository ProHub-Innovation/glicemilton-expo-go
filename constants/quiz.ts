// constants/quiz.ts
// Perguntas, alternativas e gabaritos do módulo Quiz (Reduzir Riscos).

export interface QuizOption {
  id: string;
  text: string;
  explanation: string;
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
      {
        id: 'a',
        text: 'Comer mais doce',
        explanation:
          'Incorreto, pois o excesso de açúcar dificulta o controle glicêmico e a alimentação deve priorizar itens saudáveis.',
      },
      {
        id: 'b',
        text: 'Parar de beber água',
        explanation:
          'Incorreto, pois manter-se bem hidratado é uma recomendação essencial, especialmente durante exercícios.',
      },
      {
        id: 'c',
        text: 'Fazer exercícios físicos regularmente',
        explanation:
          'Correto, a prática de atividades físicas melhora o controle metabólico ao aumentar a captação de glicose e reduzir a resistência à insulina.',
      },
      {
        id: 'd',
        text: 'Ignorar o estresse',
        explanation:
          'Incorreto, pois os aspectos emocionais impactam diretamente a saúde e o controle do diabetes.',
      },
    ],
    correctId: 'c',
  },
  {
    id: 'q2',
    question:
      'Qual exame é usado para verificar a média de açúcar no sangue do Glicemilton em um período de 2 a 3 meses, e não apenas o valor do momento?',
    options: [
      {
        id: 'a',
        text: 'Exame de colesterol',
        explanation:
          'Incorreto, pois serve para medir os níveis de gordura no sangue, não o açúcar.',
      },
      {
        id: 'b',
        text: 'Avaliação da função renal',
        explanation: 'Incorreto, pois este exame serve para verificar a saúde dos rins.',
      },
      {
        id: 'c',
        text: 'Teste rápido na ponta do dedo',
        explanation:
          'Incorreto, pois ele mostra apenas o valor da glicose naquele exato momento, não a média de meses.',
      },
      {
        id: 'd',
        text: 'Hemoglobina glicada',
        explanation:
          'Correto, este é um exame laboratorial essencial para monitorar o controle clínico a longo prazo e reduzir os riscos de complicações.',
      },
    ],
    correctId: 'd',
  },
  {
    id: 'q3',
    question:
      'Cuidar dos aspectos emocionais, como estresse e a ansiedade, é importante na prevenção de riscos do diabetes porque as emoções podem afetar diretamente qual aspecto do controle?',
    options: [
      {
        id: 'a',
        text: 'A cor da pele',
        explanation:
          'Incorreto, pois o diabetes e o estresse afetam principalmente o equilíbrio metabólico e os níveis de açúcar, não alterando essas características físicas.',
      },
      {
        id: 'b',
        text: 'Os níveis de glicose no sangue',
        explanation:
          'Correto, o cuidado com a saúde mental é vital pois situações de estresse e questões emocionais podem impactar diretamente a glicemia.',
      },
      {
        id: 'c',
        text: 'A altura da pessoa',
        explanation:
          'Incorreto, pois o diabetes e o estresse afetam principalmente o equilíbrio metabólico e os níveis de açúcar, não alterando essas características físicas.',
      },
      {
        id: 'd',
        text: 'A força muscular',
        explanation:
          'Incorreto, pois o diabetes e o estresse afetam principalmente o equilíbrio metabólico e os níveis de açúcar, não alterando essas características físicas.',
      },
    ],
    correctId: 'b',
  },
  {
    id: 'q4',
    question:
      'O exame de Fundo de Olho, que faz parte dos exames complementares, é essencial na prevenção de riscos do diabetes para proteger qual parte vital do corpo do Glicemilton?',
    options: [
      {
        id: 'a',
        text: 'Os rins',
        explanation: 'Incorreto, pois são monitorados pela avaliação da função renal.',
      },
      {
        id: 'b',
        text: 'Os pés',
        explanation: 'Incorreto, pois são protegidos por meio da avaliação clínica regular.',
      },
      {
        id: 'c',
        text: 'A visão',
        explanation:
          'Correto, o exame de fundo de olho é uma medida preventiva necessária para minimizar resultados negativos e proteger a saúde ocular.',
      },
      {
        id: 'd',
        text: 'O coração',
        explanation:
          'Incorreto, pois a proteção cardiovascular vem do controle do colesterol e da prática de exercícios.',
      },
    ],
    correctId: 'c',
  },
  {
    id: 'q5',
    question:
      'Por que é importante para o Glicemilton conhecer como o medicamento prescrito funciona no organismo?',
    options: [
      {
        id: 'a',
        text: 'Para poder vender o medicamento',
        explanation:
          'Incorreto, pois o objetivo do conhecimento é o cuidado pessoal e não atividades comerciais ou científicas.',
      },
      {
        id: 'b',
        text: 'Para poder criar novos remédios',
        explanation:
          'Incorreto, pois o objetivo do conhecimento é o cuidado pessoal e não atividades comerciais ou científicas.',
      },
      {
        id: 'c',
        text: 'Para poder parar de tomá-lo',
        explanation:
          'Incorreto, pois o conhecimento serve para aumentar a adesão e o uso correto, não para interromper o tratamento por conta própria.',
      },
      {
        id: 'd',
        text: 'Para fazer uma tomada de decisão adequada e ter mais adesão ao tratamento',
        explanation:
          'Correto, compreender como o medicamento funciona facilita a tomada de decisão correta e aumenta a adesão às recomendações médicas.',
      },
    ],
    correctId: 'd',
  },
  {
    id: 'q6',
    question:
      'Se Glicemilton vivenciar possíveis efeitos colaterais de um medicamento, como um desconforto inesperado, qual é o procedimento de segurança correto?',
    options: [
      {
        id: 'a',
        text: 'Ignorar e esperar que passe',
        explanation:
          'Incorreto, pois o sintoma pode ser um sinal de alerta que precisa de atenção profissional.',
      },
      {
        id: 'b',
        text: 'Parar de tomar o medicamento imediatamente',
        explanation:
          'Incorreto, pois suspender a medicação sem orientação pode desequilibrar as taxas de glicose.',
      },
      {
        id: 'c',
        text: 'Tomar uma dose extra',
        explanation:
          'Incorreto, pois o excesso de medicação é uma das causas de hipoglicemia perigosa.',
      },
      {
        id: 'd',
        text: 'Relatar o problema à equipe de saúde',
        explanation:
          'Correto, caso o paciente sinta qualquer efeito colateral, a orientação é comunicar o problema imediatamente aos profissionais de saúde que o acompanham.',
      },
    ],
    correctId: 'd',
  },
  {
    id: 'q7',
    question:
      'Quais alimentos o Glicemilton deve evitar para seguir as recomendações do Guia Alimentar para a População Brasileira?',
    options: [
      {
        id: 'a',
        text: 'Alimentos in natura',
        explanation:
          'Incorreto, pois estes devem ser a base da alimentação por serem mais saudáveis.',
      },
      {
        id: 'b',
        text: 'Alimentos minimamente processados',
        explanation:
          'Incorreto, pois estes devem ser a base da alimentação por serem mais saudáveis.',
      },
      {
        id: 'c',
        text: 'Alimentos ultraprocessados',
        explanation:
          'Correto, segundo o Guia Alimentar para a População Brasileira, esses itens devem ser evitados para manter uma alimentação equilibrada.',
      },
      {
        id: 'd',
        text: 'Água e sucos naturais sem açúcar',
        explanation:
          'Incorreto, pois a água é a bebida ideal para hidratação e sucos naturais sem açúcar são opções melhores que os ultraprocessados.',
      },
    ],
    correctId: 'c',
  },
  {
    id: 'q8',
    question:
      'Ao praticar atividade física, especialmente se fizer uso de insulina, qual é uma recomendação importante para o Glicemilton garantir sua segurança?',
    options: [
      {
        id: 'a',
        text: 'Praticar exercícios apenas em jejum absoluto',
        explanation: 'Perigoso, pois aumenta o risco de hipoglicemia durante o esforço físico.',
      },
      {
        id: 'b',
        text: 'Evitar beber água durante o treino',
        explanation:
          'Incorreto, as fontes recomendam "caprichar no consumo de água" para manter a hidratação.',
      },
      {
        id: 'c',
        text: 'Verificar a sua glicemia antes e após o exercício',
        explanation:
          'Correto, especialmente para quem usa insulina, a monitorização é essencial para entender como o corpo reage ao esforço e evitar quedas bruscas de açúcar.',
      },
      {
        id: 'd',
        text: 'Tomar uma dose extra de medicamento antes de começar',
        explanation:
          'Incorreto, pois o exercício já baixa a glicose naturalmente; uma dose extra pode causar hipoglicemia grave.',
      },
    ],
    correctId: 'c',
  },
  {
    id: 'q9',
    question: 'Como as informações colhidas pelo Glicemilton ajudam a equipe médica no tratamento?',
    options: [
      {
        id: 'a',
        text: 'Servem apenas para registro estético no prontuário',
        explanation:
          'Incorreto, pois esses dados são ferramentas clínicas vitais para o tratamento.',
      },
      {
        id: 'b',
        text: 'Auxiliam no ajuste de doses e tipos de medicações pela equipe de saúde',
        explanation:
          'Correto, os dados da monitorização permitem que o médico verifique se os medicamentos estão sendo efetivos e faça os ajustes necessários com segurança.',
      },
      {
        id: 'c',
        text: 'Servem para o glicemilton decidir sozinho se deveria parar de tomar a medicação',
        explanation:
          'Incorreto, a adesão ao tratamento prescrito é essencial; mudanças devem ser feitas com o médico.',
      },
      {
        id: 'd',
        text: 'Não possuem impacto no risco de hipoglicemias',
        explanation:
          'Incorreto, a monitorização justamente reduz o risco de hipo e hiperglicemias.',
      },
    ],
    correctId: 'b',
  },
  {
    id: 'q10',
    question: 'O que o Glicemilton deve fazer especificamente se utilizar insulina NPH?',
    options: [
      {
        id: 'a',
        text: 'Aplicar sempre no mesmo ponto exato da pele',
        explanation:
          'Incorreto, é necessário fazer o rodízio do local de aplicação para evitar lesões na pele.',
      },
      {
        id: 'b',
        text: 'Reutilizar a agulha por pelo menos uma semana',
        explanation: 'Incorreto, a recomendação explícita é não reutilizar agulhas ou seringas.',
      },
      {
        id: 'c',
        text: 'Fazer a homogeneização ou mistura antes da aplicação',
        explanation:
          'Correto, a insulina NPH precisa ser suavemente misturada para garantir que a dose aplicada seja correta e tenha o efeito esperado.',
      },
      {
        id: 'd',
        text: 'Guardar a insulina em local com sol direto',
        explanation:
          'Incorreto, o calor excessivo e a luz solar danificam a insulina, que deve ser conservada corretamente.',
      },
    ],
    correctId: 'c',
  },
  {
    id: 'q11',
    question:
      'O comportamento de "Resolver Problemas" lista situações que podem causar hipoglicemia. Qual das alternativas abaixo é uma dessas causas?',
    options: [
      {
        id: 'a',
        text: 'Beber água em excesso',
        explanation:
          'Beber água em excesso: A água não interfere diretamente na queda da glicose a ponto de causar hipoglicemia.',
      },
      {
        id: 'b',
        text: 'Erro na contagem de carboidratos ou pular refeições',
        explanation:
          'Correto, o equilíbrio entre o que se come e a medicação é sensível; se houver menos comida do que o planejado para a dose de remédio, o açúcar cai demais.',
      },
      {
        id: 'c',
        text: 'Dormir as horas recomendadas por noite',
        explanation: 'Incorreto, isso é um hábito saudável e não causa hipoglicemia.',
      },
      {
        id: 'd',
        text: 'Manter a rotina de exercícios habitual',
        explanation:
          'Incorreto, o que causa o problema é a atividade física não programada e fora do padrão usual.',
      },
    ],
    correctId: 'b',
  },
  {
    id: 'q12',
    question:
      'Além dos exames laboratoriais, quais outros aspectos devem estar em dia na rotina do Glicemilton?',
    options: [
      {
        id: 'a',
        text: 'Apenas a contagem de calorias diárias',
        explanation:
          'Incorreto, o diabetes exige uma visão integral do corpo, e não apenas o controle de calorias, peso ou exames isolados de audição.',
      },
      {
        id: 'b',
        text: 'Somente o peso corporal e a altura',
        explanation:
          'Incorreto, o diabetes exige uma visão integral do corpo, e não apenas o controle de calorias, peso ou exames isolados de audição.',
      },
      {
        id: 'c',
        text: 'Avaliação clínica, fundo de olho e aspectos emocionais',
        explanation:
          'Correto, o autocuidado envolve prevenir complicações em vários sistemas do corpo e cuidar da mente, que impacta o controle da doença.',
      },
      {
        id: 'd',
        text: 'Exames de audição e força muscular, apenas',
        explanation:
          'Incorreto, o diabetes exige uma visão integral do corpo, e não apenas o controle de calorias, peso ou exames isolados de audição.',
      },
    ],
    correctId: 'c',
  },
  {
    id: 'q13',
    question: 'O que favorece o enfrentamento dos desafios do diabetes para o Glicemilton?',
    options: [
      {
        id: 'a',
        text: 'Isolar-se e não contar a ninguém sobre a condição',
        explanation:
          'Incorreto, o isolamento dificulta o tratamento; a rede de apoio é um diferencial positivo.',
      },
      {
        id: 'b',
        text: 'Ignorar as glicemias em situações de festas ou viagens',
        explanation:
          'Incorreto, situações especiais exigem mais informação e adaptação, não descuidado.',
      },
      {
        id: 'c',
        text: 'Focar apenas na saúde física, ignorando a saúde mental',
        explanation:
          'Incorreto, saúde física e mental são igualmente essenciais para uma adaptação saudável.',
      },
      {
        id: 'd',
        text: 'Buscar informações para lidar com situações especiais e contar com rede de apoio',
        explanation:
          'Correto, saber como agir em viagens ou festas e ter o apoio de família e amigos facilita a convivência e a eficácia do tratamento.',
      },
    ],
    correctId: 'd',
  },
  {
    id: 'q14',
    question:
      'Para o Glicemilton, que utiliza insulina em seu tratamento, qual recomendação sobre o uso de agulhas e seringas é essencial para a sua segurança e eficácia do controle?',
    options: [
      {
        id: 'a',
        text: 'Reutilizar a mesma agulha por até três dias para economizar',
        explanation:
          'Incorreto, esses materiais são descartáveis e perdem a esterilidade e o corte após o primeiro uso.',
      },
      {
        id: 'b',
        text: 'Lavar a seringa com álcool após o uso para poder usá-la novamente',
        explanation:
          'Incorreto, esses materiais são descartáveis e perdem a esterilidade e o corte após o primeiro uso.',
      },
      {
        id: 'c',
        text: 'Não reutilizar agulhas ou seringas e descartá-las em local apropriado após o uso',
        explanation:
          'Correto, isso previne infecções, garante que a aplicação não seja dolorosa e protege outras pessoas de acidentes com o material descartado.',
      },
      {
        id: 'd',
        text: 'Descartar o material usado diretamente no lixo doméstico comum',
        explanation:
          'Incorreto, materiais perfurocortantes devem ter descarte específico para segurança ambiental e pública.',
      },
    ],
    correctId: 'c',
  },
  {
    id: 'q15',
    question:
      'Quem é o responsável por definir quais devem ser as metas de açúcar no sangue e com que frequência o Glicemilton deve fazer a monitorização?',
    options: [
      {
        id: 'a',
        text: 'O próprio Glicemilton, baseando-se apenas em como ele se sente no dia',
        explanation:
          'Incorreto, perigoso, pois muitas vezes a glicemia está alta ou baixa sem que a pessoa sinta sintomas claros.',
      },
      {
        id: 'b',
        text: 'Outras pessoas que tenham diabetes e usem as mesmas medicações',
        explanation:
          'Incorreto, cada caso é único; o que serve para um pode ser perigoso para o Glicemilton. A orientação deve ser profissional.',
      },
      {
        id: 'c',
        text: 'A equipe de saúde que o acompanha, por meio de conversas e orientações',
        explanation:
          'Correto, as metas de açúcar no sangue são individualizadas; somente o profissional de saúde pode definir o que é seguro e necessário para cada paciente.',
      },
      {
        id: 'd',
        text: 'Consultas rápidas em sites de busca na internet',
        explanation:
          'Incorreto, cada caso é único; o que serve para um pode ser perigoso para o Glicemilton. A orientação deve ser profissional.',
      },
    ],
    correctId: 'c',
  },
  {
    id: 'q16',
    question:
      'Antes de aplicar a insulina, o que o Glicemilton deve fazer para reduzir o risco de erros na administração?',
    options: [
      {
        id: 'a',
        text: 'Aplicar a insulina sem conferir o rótulo do frasco ou da caneta.',
        explanation:
          'Incorreto, pois conferir o medicamento antes da aplicação é essencial para evitar trocas e erros de dose.',
      },
      {
        id: 'b',
        text: 'Conferir o tipo de insulina, a dose prescrita e a validade antes da aplicação.',
        explanation:
          'Correto, verificar o tipo de insulina, a dose prescrita e a validade do medicamento ajuda a garantir uma aplicação segura e eficaz, reduzindo o risco de complicações.',
      },
      {
        id: 'c',
        text: 'Pedir para outra pessoa escolher a dose por ele.',
        explanation:
          'Incorreto, a dose deve seguir a prescrição da equipe de saúde, e não ser escolhida por outra pessoa.',
      },
      {
        id: 'd',
        text: 'Aplicar uma dose maior quando a glicemia estiver alta, sem orientação profissional.',
        explanation:
          'Incorreto, aumentar a dose por conta própria pode provocar hipoglicemia grave; qualquer ajuste deve ser feito com orientação da equipe de saúde.',
      },
    ],
    correctId: 'b',
  },
];
