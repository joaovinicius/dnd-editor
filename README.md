# DND Editor - Layouts Dinâmicos de Alta Performance para Next.js

[![NPM Version](https://img.shields.io/npm/v/dnd-editor.svg?style=flat)](https://www.npmjs.com/package/dnd-editor)
[![License](https://img.shields.io/npm/l/dnd-editor.svg?style=flat)](https://github.com/your-username/dnd-editor/blob/main/LICENSE)
[![Build Status](https://img.shields.io/github/actions/workflow/status/your-username/dnd-editor/main.yml?branch=main)](https://github.com/your-username/dnd-editor/actions)

Um pacote para React/Next.js focado em performance, projetado para criar layouts dinâmicos e editáveis com suporte a Server-Side Rendering (SSR), Code Splitting e Tree Shaking, garantindo as melhores métricas de Core Web Vitals.

## Filosofia

Inspirado em soluções como o Puck Editor, o **DND Editor** foi criado com um objetivo principal: **performance extrema**. Enquanto a maioria dos editores visuais foca na experiência de edição, nós focamos no resultado final: um site que carrega instantaneamente, com o mínimo de JavaScript no cliente.

Para isso, aproveitamos ao máximo a arquitetura do Next.js:

1.  **Performance-First**: O renderizador é otimizado para SSR, gerando HTML estático no servidor. No cliente, apenas os componentes interativos são hidratados.
2.  **Tree Shaking Agressivo**: Apenas os componentes que são de fato utilizados em uma página são incluídos no bundle. Se você tem 100 componentes registrados mas a página só usa 3, apenas esses 3 serão enviados ao cliente.
3.  **Developer Experience**: API simples e `Type-Safe` para registrar seus próprios componentes React, garantindo que o editor e o renderizador saibam exatamente quais props esperar.
4.  **Monorepo com pnpm**: Estrutura organizada que separa o pacote principal (`@dnd-editor/core`) da aplicação de demonstração (`apps/web`), facilitando testes, desenvolvimento e publicação.

---

## Estrutura do Projeto

Este repositório é um monorepo gerenciado com `pnpm workspaces`.

```
/
├── apps/
│   └── web/            # Aplicação Next.js para demonstração e testes
├── packages/
│   └── core/           # O pacote NPM principal (@dnd-editor/core)
├── package.json
└── pnpm-workspace.yaml
```

### `packages/core`

O coração da biblioteca. Este é o pacote que será publicado no NPM. Ele não contém nenhuma lógica de negócio ou componente de UI específico da aplicação de demo.

-   `src/editor`: Contém o componente `<Editor />`, responsável pela interface de arrastar e soltar, e o painel de propriedades.
-   `src/renderer`: Contém o componente `<Renderer />`, que recebe a estrutura de dados JSON e renderiza a página de forma performática.
-   `src/types.ts`: Definições de tipos TypeScript que garantem a segurança entre o que é configurado e o que é renderizado.
-   **Estilização**: Para garantir que o pacote seja o mais leve e desacoplado possível, todos os componentes dentro de `packages/core/src` utilizam exclusivamente **CSS Modules**. Nenhuma dependência de frameworks como Tailwind CSS é usada neste pacote.

### `apps/web`

Uma aplicação Next.js completa que serve como vitrine e ambiente de desenvolvimento para o `@dnd-editor/core`.

-   `app/admin/editor/page.tsx.bkp`: Página que implementa o `<Editor />`, permitindo a criação e edição de layouts.
-   `app/page.tsx.bkp`: Página que provavelmente usa o `<Renderer />` para exibir o conteúdo criado pelo editor.
-   `config/dnd-editor.config.tsx`: **Arquivo de configuração central**. É aqui que os componentes React customizados (como `<Hero />`, `<Card />`, etc.) são registrados para serem usados no editor.
-   `components/`: Componentes React (ex: Hero, Card, Grid) que são os "blocos de montar" do nosso editor.

---

## Como Funciona

O fluxo de trabalho é dividido em três etapas principais: **Configuração**, **Edição** e **Renderização**.

### 1. Configuração

Tudo começa em um arquivo de configuração. Nele, você importa seus componentes React e define como o editor deve tratá-los.

**Exemplo (`dnd-editor.config.tsx`):**

```tsx
import type { DnDEditorConfig } from '@dnd-editor/core';
import { Hero } from '../components/Hero';

// Definição de tipos para as props do componente Hero
type HeroProps = {
  title: string;
  description: string;
};

// Registro do componente no editor
export const config: DnDEditorConfig<HeroProps> = {
  components: {
    hero: {
      label: 'Hero Section',
      // Mapeamento do componente React real
      render: Hero,
      // Definição dos campos que aparecerão no painel de propriedades
      fields: {
        title: { type: 'text', label: 'Título' },
        description: { type: 'textarea', label: 'Descrição' },
      },
    },
    // ... outros componentes
  },
};
```

### 2. Edição (`<Editor />`)

O componente `<Editor />` lê o `config` e gera uma interface de três colunas:

1.  **Coluna Esquerda**: Uma lista com todos os componentes registrados (ex: "Hero Section").
2.  **Coluna Central**: A área de "drop", onde você arrasta e monta o layout visualmente.
3.  **Coluna Direita**: Um formulário gerado dinamicamente com os `fields` do componente selecionado para preencher suas props.

Ao final, o editor produz uma estrutura de dados JSON que descreve o layout e as props de cada componente.

**Exemplo da estrutura de dados:**

```json
{
  "root": [
    {
      "id": "block-1",
      "type": "hero",
      "props": {
        "title": "Bem-vindo ao DND Editor",
        "description": "Performance em primeiro lugar."
      }
    }
  ]
}
```

### 3. Renderização (`<Renderer />`)

Este é o componente mais importante para a performance. Ele recebe o `config` e a `data` (JSON) e renderiza a página.

**No lado do Servidor (SSR):**

O `<Renderer />` itera sobre a `data`, identifica os `type` de cada bloco (ex: "hero"), busca o componente correspondente no `config` e o renderiza com as `props` fornecidas. O resultado é um HTML puro, servido rapidamente ao usuário.

**No lado do Cliente (Hidratação e Code Splitting):**

O renderizador é inteligente. Ele **não** importa todos os componentes do `config`. Em vez disso, ele analisa a `data` e carrega dinamicamente (usando `React.lazy` ou `next/dynamic`) **apenas** os componentes necessários para aquela página específica. Isso garante que o bundle de JavaScript seja o menor possível.

**Exemplo de uso:**

```tsx
import { Renderer } from '@dnd-editor/core';
import { config } from '../config/dnd-editor.config';

// data viria de uma API ou de um arquivo
const data = await getPageData(); 

export default function PageTsx() {
  return <Renderer config={config} data={data} />;
}
```

---

## Primeiros Passos

### Requisitos

-   Node.js (versão 20.x ou superior)
-   pnpm

### Instalação

1.  Clone o repositório:
    ```bash
    git clone https://github.com/your-username/dnd-editor.git
    cd dnd-editor
    ```

2.  Instale as dependências:
    ```bash
    pnpm install
    ```

### Rodando a Aplicação de Demo

Para iniciar o ambiente de desenvolvimento com a aplicação `web`:

```bash
pnpm dev
```

-   Acesse `http://localhost:3000/admin/editor` para usar o editor.
-   Acesse `http://localhost:3000` para ver o resultado renderizado.

### Publicando o Pacote

O projeto está pré-configurado para facilitar a publicação do pacote `@dnd-editor/core` no NPM.

_Instruções de build e publicação a serem adicionadas._

---

## Roadmap

-   [ ] Implementar sistema de testes unitários e de integração.
-   [ ] Criar um script de build e publicação otimizado para o pacote `core`.
-   [ ] Expandir os tipos de `fields` disponíveis no editor (ex: `select`, `color`, `image`).
-   [ ] Documentação detalhada da API do pacote.
-   [ ] Suporte para layouts aninhados (colunas, abas, etc.).

---

## Diretrizes de Contribuição

Para manter a consistência e a qualidade do código, por favor siga estas diretrizes:

-   **Idioma**: Todos os comentários no código, mensagens de commit e discussões em issues/pull requests devem ser em **Inglês**.
-   **Estilo de Código**: Siga as convenções de estilo e formatação já presentes no código.
-   **Testes**: Ao adicionar novas funcionalidades ou corrigir bugs, por favor, adicione ou atualize os testes correspondentes.

## Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para abrir uma issue ou enviar um pull request.

## Licença

[MIT](./LICENSE)
