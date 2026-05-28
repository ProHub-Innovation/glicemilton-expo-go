# 🐜 Glicemilton

App educativo com minijogos para conscientizar sobre diabetes e glicemia de forma intuitiva.

> ⚕️ **Conteúdo educativo — não substitui orientação médica.**

---

## Sumário

- [Sobre o projeto](#sobre-o-projeto)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Rodando o projeto](#rodando-o-projeto)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Módulos do app](#módulos-do-app)
- [Qualidade de código](#qualidade-de-código)
- [Fluxo de trabalho Git](#fluxo-de-trabalho-git)
- [Stack e dependências](#stack-e-dependências)

---

## Sobre o projeto

O Glicemilton é um MVP de app mobile desenvolvido com **Expo (SDK 54)** e **React Native 0.81.5**. O app guia o usuário por 6 módulos interativos que ensinam, de forma lúdica, conceitos sobre alimentação, glicemia, medicamentos e hábitos saudáveis para quem convive com diabetes.

Referência de design: [Slides no Genially](https://view.genially.com/6920fc5ca992e50f481c76e9)

---

## Pré-requisitos

Antes de começar, garanta que você tem instalado:

- [Node.js](https://nodejs.org/) versão 18 ou superior
- [npm](https://www.npmjs.com/) versão 9 ou superior
- [Git](https://git-scm.com/)
- **Expo Go SDK 54** instalado no celular (ver seção abaixo)

### Instalando o Expo Go correto

O projeto usa **Expo SDK 54**. O Expo Go disponível na Play Store/App Store pode estar em uma versão diferente e causar erro de incompatibilidade ao escanear o QR code.

**Android:** baixe o APK diretamente pelo link abaixo no próprio celular:

```
https://expo.dev/go?sdkVersion=54&platform=android&device=true
```

**iOS:** a versão da App Store costuma ser compatível. Se der erro, verifique a versão do SDK nas configurações do Expo Go.

> ⚠️ Depois de instalar, **não atualize** o Expo Go pela loja. Remova-o das atualizações automáticas para evitar incompatibilidade futura.

---

## Instalação

Clone o repositório e instale as dependências:

```bash
git clone <url-do-repositorio>
cd StickerSmash
npm install
```

---

## Rodando o projeto

### No celular (Expo Go)

```bash
npx expo start
```

Escaneie o QR code com o Expo Go SDK 54.

### No navegador (web)

```bash
npx expo start --web
```

### Com tunnel (útil se estiver em redes diferentes)

```bash
npx expo install @expo/ngrok@^4.1.0
npx expo start --tunnel
```

---

## Estrutura de pastas

```
StickerSmash/
app/
├── index.tsx                  # Splash/boas-vindas
├── (tabs)/
│   ├── _layout.tsx
│   └── index.tsx              # Home
└── modulos/                   # Cada módulo isolado
    ├── quiz/
    │   └── index.tsx
    ├── prato/
    │   └── index.tsx
    ├── glicemia/
    │   └── index.tsx
    ├── labirinto/
    │   └── index.tsx
    ├── exercicios/
    │   └── index.tsx
    └── medicamentos/
        └── index.tsx
components/
├── ui/                        # Botões, cards, badges — genéricos
│   ├── Button.tsx
│   └── Card.tsx
└── modulos/                   # Componentes exclusivos de cada módulo
    ├── quiz/
    │   ├── QuizCard.tsx
    │   └── ResultBadge.tsx
    └── prato/
        ├── FoodItem.tsx
        └── PlateDropZone.tsx
constants/
├── foods.ts                   # Dados dos alimentos (prato)
└── quiz.ts                    # Perguntas e respostas
assets/
├── images/
│   ├── shared/                # Glicemilton, logos
│   └── modulos/
│       ├── prato/
│       └── glicemia/
└── sounds/                    # Sons por módulo
├── .husky/
│   └── pre-commit             # Hook: roda lint-staged antes de cada commit
├── .prettierrc                # Configuração do Prettier
├── eslint.config.js           # Configuração do ESLint
├── package.json
└── tsconfig.json
```

---

## Módulos do app

| #   | Tela                   | Descrição                                                                 |
| --- | ---------------------- | ------------------------------------------------------------------------- |
| 1   | 🥗 Monte seu Prato     | Arraste alimentos e calcule carboidratos, calorias e unidades de insulina |
| 2   | 🏃 Praticar Exercícios | Conteúdo educativo e quiz sobre atividade física                          |
| 3   | 💉 Vigiar as Taxas     | Simule uma aferição de glicemia e interprete o resultado                  |
| 4   | 🧩 Adaptação Saudável  | Jogo de labirinto — ajude o Glicemilton a encontrar a saída               |
| 5   | 💊 Tomar Medicamentos  | Quiz sobre armazenamento e aplicação de insulina                          |
| 6   | ⚠️ Reduzir Riscos      | Quiz de múltipla escolha sobre controle glicêmico                         |

---

## Qualidade de código

O projeto usa **ESLint**, **Prettier** e **Husky** para manter o código consistente entre os membros da equipe.

### Verificar manualmente

```bash
# Checar erros de lint
npx eslint .

# Formatar todos os arquivos
npx prettier --write .
```

### Como o hook funciona

O **Husky** executa automaticamente o **lint-staged** antes de cada `git commit`. Ele roda ESLint e Prettier apenas nos arquivos `.ts` e `.tsx` que estão em stage. Se houver erro de lint, o commit é bloqueado até que seja corrigido.

Você não precisa fazer nada manualmente — só commitar normalmente.

### Configuração do Prettier (`.prettierrc`)

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

---

## Fluxo de trabalho Git

Seguimos um fluxo simples baseado em branches por funcionalidade:

```
main          → código estável, revisado
develop       → branch de integração
feat/nome     → novas funcionalidades
fix/nome      → correções de bug
chore/nome    → configuração, dependências, docs
```

### Exemplos de commits

```bash
git checkout -b feat/modulo-prato
# ... desenvolve ...
git add .
git commit -m "feat: implementa módulo Monte seu Prato"
git push origin feat/modulo-prato
# Abre Pull Request para develop
```

### Padrão de mensagens de commit

```
feat: nova funcionalidade
fix: correção de bug
chore: tarefa de manutenção
docs: atualização de documentação
style: ajuste visual sem lógica
refactor: refatoração sem mudança de comportamento
```

---

## Stack e dependências

| Tecnologia   | Versão   | Uso                           |
| ------------ | -------- | ----------------------------- |
| Expo         | ~54.0.33 | Framework base                |
| React Native | 0.81.5   | UI nativa                     |
| React        | 19.1.0   | Biblioteca de componentes     |
| Expo Router  | ~6.0.23  | Navegação baseada em arquivos |
| TypeScript   | ~5.9.2   | Tipagem estática              |
| Husky        | ^9.x     | Git hooks                     |
| lint-staged  | ^17.x    | Lint incremental              |
| Prettier     | ^3.x     | Formatação de código          |
| ESLint       | —        | Análise estática              |

> Este projeto **não usa NativeWind/Tailwind**. Toda estilização é feita com `StyleSheet` do React Native para manter simplicidade e compatibilidade com o prazo do MVP.

---

Dúvidas? Fala com o time no canal do projeto. 🚀
