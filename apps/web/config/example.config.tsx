import dynamic from 'next/dynamic';
import { type ConfigMap } from '@dnd-editor/core';

// IMPORTANT! Component lazy loading
const Card = dynamic(() => import(/* webpackChunkName: "component-card" */ '../components/examples/Card'));
const Grid = dynamic(() => import(/* webpackChunkName: "component-grid" */ '../components/examples/Grid'));
const Hero = dynamic(() => import(/* webpackChunkName: "component-hero" */ '../components/examples/Hero'));
const HeroFull = dynamic(() => import(/* webpackChunkName: "component-hero-full" */ '../components/examples/HeroFull'));
const Features = dynamic(() => import(/* webpackChunkName: "component-features" */ '../components/examples/Features'));
const CallToAction = dynamic(() => import(/* webpackChunkName: "component-cta" */ '../components/examples/CallToAction'));

const Navbar = dynamic(
  () => import(/* webpackChunkName: "component-navbar-wrapper" */ '../components/examples/navbar/NavbarWrapper'),
);
const JlgNavbar = dynamic(
  () => import(/* webpackChunkName: "component-jlg-navbar-wrapper" */ '../components/examples/jlg-navbar/JlgNavbarWrapper')
);

export const config: ConfigMap = {
  grid: {
    component: Grid,
    label: 'Grid Layout',
    fields: {
      columns: {
        label: 'Número de Colunas',
        type: 'number' as const,
        defaultValue: 2
      },
      gap: {
        label: 'Espaçamento (Gap)',
        type: 'number' as const,
        defaultValue: 8
      },
      children: {
        label: 'Conteúdo do Grid',
        type: 'slot' as const
      }
    }
  },
  navbar: {
    component: Navbar,
    label: 'Navbar',
    fields: {
      phone: { label: 'Telefone', type: 'text' as const, defaultValue: '1-833-662-8550' }
    }
  },
  jlgNavbar: {
    component: JlgNavbar,
    label: 'Navbar',
    fields: {
      phone: { label: 'Telefone', type: 'text' as const, defaultValue: '1-888-888-8888' }
    }
  },
  card: {
    component: Card,
    label: 'Card Container',
    fields: {
      title: {
        label: 'Título do Card',
        type: 'text' as const,
        defaultValue: 'Meu Título'
      },
      children: {
        label: 'Conteúdo Interno',
        type: 'slot' as const
      }
    }
  },
  hero: {
    component: Hero,
    label: 'Hero Section',
    fields: {
      title: { label: 'Título', type: 'text' as const, defaultValue: 'Hello World' },
      padding: { label: 'Padding (px)', type: 'number' as const, defaultValue: 40 }
    }
  },
  heroFull: {
    component: HeroFull,
    label: 'Hero Completo',
    fields: {
      title: {
        label: 'Título Principal',
        type: 'textarea' as const,
        defaultValue: 'Crie layouts incríveis\ncom alta performance.'
      },
      description: {
        label: 'Subtítulo',
        type: 'text' as const,
        defaultValue: 'Este é um exemplo de componente complexo.'
      },
      align: {
        label: 'Alinhamento',
        type: 'radio' as const,
        defaultValue: 'center',
        options: [
          { label: 'Esquerda', value: 'left' },
          { label: 'Centro', value: 'center' },
          { label: 'Direita', value: 'right' }
        ]
      },
      padding: {
        label: 'Espaçamento Vertical',
        type: 'number' as const,
        defaultValue: 80
      },
      cta: {
        label: 'Botão de Ação',
        type: 'object' as const,
        defaultValue: { label: 'Começar Agora', style: 'solid' },
        objectFields: {
          label: {
            label: 'Texto do Botão',
            type: 'text' as const,
            defaultValue: 'Saiba Mais'
          },
          href: {
            label: 'Link (URL)',
            type: 'text' as const,
            defaultValue: '#'
          },
          style: {
            label: 'Estilo Visual',
            type: 'radio' as const,
            defaultValue: 'solid',
            options: [
              { label: 'Sólido (Azul)', value: 'solid' },
              { label: 'Borda (Outline)', value: 'outline' }
            ]
          }
        }
      }
    }
  },
  features: {
    component: Features,
    label: 'Lista de Features',
    fields: {
      title: { label: 'Título da Seção', type: 'text' as const, defaultValue: 'Por que nós?' },
      activeColor: { label: 'Cor dos Ícones', type: 'color' as const, defaultValue: '#2563eb' }
    }
  },
  cta: {
    component: CallToAction,
    label: 'Chamada para Ação',
    fields: {
      text: { label: 'Texto do Botão', type: 'text' as const, defaultValue: 'Clique aqui' },
      url: { 
        label: 'URL', 
        type: 'select' as const, 
        defaultValue: '#', 
        options: [{ label: 'Home', value: '/' }, { label: 'Sobre', value: '/sobre' }] 
      }
    }
  }
};
