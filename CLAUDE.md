@AGENTS.md

# CLAUDE.md — Glicemilton

Arquivo de contexto para assistentes de IA e novos devs.
Leia antes de sugerir código, criar arquivos ou refatorar qualquer coisa.

---

## O que é esse projeto

**Glicemilton** é um app mobile educativo com minijogos para conscientizar sobre diabetes e glicemia de forma lúdica e acessível. É um MVP desenvolvido por uma equipe de 3 devs com metodologia Scrum.

> Conteúdo educativo — não substitui orientação médica.

Referência de design: https://view.genially.com/6920fc5ca992e50f481c76e9

---

## Stack

- **Expo SDK 54** com Expo Router v6 (file-based navigation)
- **React Native 0.81.5** + **React 19**
- **TypeScript** ~5.9.2
- **StyleSheet nativo** do React Native — sem NativeWind, sem Tailwind
- Sem backend, sem autenticação — MVP 100% local
- Sem AsyncStorage por enquanto — estado vive na sessão

---

## Estrutura de pastas

```
app/
├── index.tsx                  # Splash/boas-vindas (redireciona para home após 2.5s)
├── (tabs)/
│   ├── _layout.tsx            # Layout das abas
│   └── index.tsx              # Home — grid com os 6 módulos
└── modulos/
    ├── quiz/index.tsx
    ├── prato/index.tsx
    ├── glicemia/index.tsx
    ├── labirinto/index.tsx
    ├── exercicios/index.tsx
    └── medicamentos/index.tsx

components/
├── ui/                        # Componentes genéricos reutilizáveis
└── modulos/                   # Componentes exclusivos por módulo
    ├── quiz/
    └── prato/

constants/
├── foods.ts                   # Dados dos alimentos com CHO e calorias
└── quiz.ts                    # Perguntas, respostas e gabaritos

assets/
├── images/
│   ├── shared/                # Glicemilton, logos, ícones globais
│   └── modulos/               # Assets específicos por módulo
└── sounds/
```

---

## Módulos do app

| Módulo                 | Mecânica                                           | Status        |
| ---------------------- | -------------------------------------------------- | ------------- |
| 🥗 Monte seu Prato     | Drag and drop de alimentos, calcula CHO + calorias | A implementar |
| 🏃 Praticar Exercícios | Quiz de múltipla escolha                           | A implementar |
| 💉 Vigiar as Taxas     | Simulação de aferição de glicemia + interpretação  | A implementar |
| 🧩 Adaptação Saudável  | Tap-path (toque sequencial nos nós do caminho)     | A implementar |
| 💊 Tomar Medicamentos  | Quiz de múltipla escolha                           | A implementar |
| ⚠️ Reduzir Riscos      | Quiz de múltipla escolha                           | A implementar |

---

## Regras de código

### Componentes

- Componente que só faz sentido dentro de um módulo → `components/modulos/nome/`
- Componente reutilizável em mais de um lugar → `components/ui/`
- Nunca defina dados (perguntas, alimentos, valores) inline dentro do componente — use `constants/`

### Estilização

- Sempre usar `StyleSheet.create()` do React Native
- Nunca usar `style={{ ... }}` inline, exceto para valores dinâmicos
- Cores principais: `#FF4B4B` (vermelho Glicemilton), `#1A1A1A` (texto), `#FAFAFA` (fundo)
- Nunca instalar NativeWind ou qualquer lib de utility classes CSS

### Navegação

- Usar sempre `expo-router` — sem `react-navigation` direto
- Rotas dos módulos ficam em `app/modulos/`
- Usar `router.push()` para navegar e `router.replace()` apenas na splash

### Estado

- Preferir `useState` para estado local de jogo
- Usar `useReducer` quando o módulo tiver mais de 3 estados interdependentes
- Sem Redux, sem Zustand — desnecessário para o escopo do MVP

### TypeScript

- Sempre tipar props de componentes com `interface`
- Nunca usar `any` — se não souber o tipo, usar `unknown` e tratar
- Arquivos de constantes sempre exportam tipos junto com os dados

---

## Qualidade de código

O projeto usa **Husky + lint-staged** — o hook de `pre-commit` roda automaticamente ESLint e Prettier nos arquivos em stage antes de cada commit. Se houver erro de lint, o commit é bloqueado.

```bash
# Rodar manualmente se necessário
npx eslint .
npx prettier --write .
```

Configuração do Prettier (`.prettierrc`):

- `singleQuote: true`
- `semi: true`
- `tabWidth: 2`
- `printWidth: 100`
- `trailingComma: "es5"`

---

## Fluxo Git

```
main       → estável, só recebe merge de develop via PR
develop    → integração contínua
feat/nome  → nova funcionalidade
fix/nome   → correção
chore/nome → config, deps, docs
```

Padrão de commits:

```
feat: implementa quiz do módulo exercícios
fix: corrige cálculo de CHO no módulo prato
chore: atualiza dependências do expo
docs: atualiza README com instrução de setup
```

Cada dev é responsável por módulos específicos — PRs que toquem em `components/ui/` ou `constants/` precisam de revisão de outro membro da equipe.

---

## O que NÃO fazer

- ❌ Não instalar Tailwind / NativeWind
- ❌ Não criar backend ou API — MVP é 100% local
- ❌ Não adicionar autenticação/login — removido do escopo do MVP
- ❌ Não usar `AsyncStorage` ainda — sem persistência no MVP
- ❌ Não colocar lógica de jogo diretamente no arquivo de rota — extrair para componente
- ❌ Não misturar assets de módulos diferentes na mesma pasta
- ❌ Não commitar sem passar pelo hook do Husky
- ❌ Não atualizar o Expo Go no celular — manter na versão SDK 54

---

## Expo Go — atenção

O projeto exige **Expo Go SDK 54** no celular. A versão da loja pode ser incompatível.

Android — instalar via APK:

```
https://expo.dev/go?sdkVersion=54&platform=android&device=true
```

Não atualizar o Expo Go pela Play Store/App Store após instalar.
