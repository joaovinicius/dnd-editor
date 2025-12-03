import dynamic from 'next/dynamic';
import { type ConfigMap } from '@dnd-editor/core';

// IMPORTANTE: Lazy loading dos componentes
const Card = dynamic(() => import(/* webpackChunkName: "component-card" */ '../components/Card')); // Novo
const Grid = dynamic(() => import(/* webpackChunkName: "component-grid" */ '../components/Grid')); // Novo
const Hero = dynamic(() => import(/* webpackChunkName: "component-hero" */ '../components/Hero'));
const HeroFull = dynamic(() => import(/* webpackChunkName: "component-hero-full" */ '../components/HeroFull'));
const Features = dynamic(() => import(/* webpackChunkName: "component-features" */ '../components/Features'));
const CallToAction = dynamic(() => import(/* webpackChunkName: "component-cta" */ '../components/CallToAction'));

const Navbar = dynamic(() => import(/* webpackChunkName: "component-navbar" */ '../components/NavbarWrapper'));
const JlgNavbar = dynamic(() => import(/* webpackChunkName: "component-jlg-navbar" */ '../components/JlgNavbarWrapper'));

export const config: ConfigMap = {
  grid: {
    component: Grid,
    label: 'Grid Layout',
    fields: [
      {
        name: 'columns',
        label: 'Número de Colunas',
        type: 'number',
        defaultValue: 2
      },
      {
        name: 'gap',
        label: 'Espaçamento (Gap)',
        type: 'number',
        defaultValue: 8
      },
      // Define a área onde outros componentes serão jogados
      {
        name: 'children',
        label: 'Conteúdo do Grid',
        type: 'slot'
      }
    ]
  },
  navbar: {
    component: Navbar,
    label: 'Navbar',
    fields: [
      { name: 'phone', label: 'Telefone', type: 'text', defaultValue: '1-833-662-8550' }
    ]
  },
  jlgNavbar: {
    component: JlgNavbar,
    label: 'Navbar',
    fields: [
      { name: 'phone', label: 'Telefone', type: 'text', defaultValue: '1-888-888-8888' }
    ]
  },
  // 2. Configuração do Card
  card: {
    component: Card,
    label: 'Card Container',
    fields: [
      {
        name: 'title',
        label: 'Título do Card',
        type: 'text',
        defaultValue: 'Meu Título'
      },
      // Define a área interna do card
      {
        name: 'children',
        label: 'Conteúdo Interno',
        type: 'slot'
      }
    ]
  },
  hero: {
    component: Hero,
    label: 'Hero Section',
    fields: [
      { name: 'title', label: 'Título', type: 'text', defaultValue: 'Hello World' },
      { name: 'padding', label: 'Padding (px)', type: 'number', defaultValue: 40 }
    ]
  },
  heroFull: {
    component: HeroFull,
    label: 'Hero Completo',
    fields: [
      // 1. Testando TEXTAREA (multilinha)
      {
        name: 'title',
        label: 'Título Principal',
        type: 'textarea',
        defaultValue: 'Crie layouts incríveis\ncom alta performance.'
      },

      // 2. Campo simples
      {
        name: 'description',
        label: 'Subtítulo',
        type: 'text',
        defaultValue: 'Este é um exemplo de componente complexo.'
      },

      // 3. Testando RADIO (opções visuais)
      {
        name: 'align',
        label: 'Alinhamento',
        type: 'radio',
        defaultValue: 'center',
        options: [
          { label: 'Esquerda', value: 'left' },
          { label: 'Centro', value: 'center' },
          { label: 'Direita', value: 'right' }
        ]
      },

      {
        name: 'padding',
        label: 'Espaçamento Vertical',
        type: 'number',
        defaultValue: 80
      },

      // 4. Testando OBJECT (Campos Aninhados / Recursividade)
      {
        name: 'cta',
        label: 'Botão de Ação',
        type: 'object',
        // O defaultValue aqui ajuda, mas nossa função generateDefaultProps
        // no editor já cuida de criar a estrutura se estiver vazio
        defaultValue: { label: 'Começar Agora', style: 'solid' },
        fields: [
          {
            name: 'label',
            label: 'Texto do Botão',
            type: 'text',
            defaultValue: 'Saiba Mais'
          },
          {
            name: 'href',
            label: 'Link (URL)',
            type: 'text',
            defaultValue: '#'
          },
          {
            name: 'style',
            label: 'Estilo Visual',
            type: 'radio', // Radio dentro de Object!
            defaultValue: 'solid',
            options: [
              { label: 'Sólido (Azul)', value: 'solid' },
              { label: 'Borda (Outline)', value: 'outline' }
            ]
          }
        ]
      }
    ]
  },
  features: {
    component: Features,
    label: 'Lista de Features',
    fields: [
      { name: 'title', label: 'Título da Seção', type: 'text', defaultValue: 'Por que nós?' },
      { name: 'activeColor', label: 'Cor dos Ícones', type: 'color', defaultValue: '#2563eb' }
    ]
  },
  cta: {
    component: CallToAction,
    label: 'Chamada para Ação',
    fields: [
      { name: 'text', label: 'Texto do Botão', type: 'text', defaultValue: 'Clique aqui' },
      { name: 'url', label: 'URL', type: 'select', defaultValue: '#', options: [{ label: 'Home', value: '/' }, { label: 'Sobre', value: '/sobre' }] }
    ]
  }
};