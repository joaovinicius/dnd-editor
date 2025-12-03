import * as esbuild from 'esbuild';
import { rm } from 'fs/promises';

const args = process.argv.slice(2);
const isWatch = args.includes('--watch');

async function build() {
  // Clean dist only if not in watch mode to avoid race conditions with consumers
  if (!isWatch) {
    await rm('dist', { recursive: true, force: true });
  }

  const commonConfig = {
    bundle: true,
    minify: !isWatch,
    sourcemap: isWatch,
    treeShaking: true,
    external: [
      'react', 
      'react-dom', 
      'next', 
      '@dnd-kit/core', 
      '@dnd-kit/sortable', 
      '@dnd-kit/utilities', 
      'lucide-react', 
      'nanoid'
    ],
    loader: { 
      '.module.css': 'local-css',
      '.tsx': 'tsx',
      '.ts': 'ts'
    },
    logLevel: 'info',
    outdir: 'dist',
  };

  const entryPoints = {
    'index': 'src/index.ts',
    'editor/index': 'src/editor/index.tsx',
    'renderer/index': 'src/renderer/index.tsx'
  };

  const esmConfig = {
    ...commonConfig,
    entryPoints,
    format: 'esm',
    splitting: true,
    outExtension: { '.js': '.mjs' },
  };

  const cjsConfig = {
    ...commonConfig,
    entryPoints,
    format: 'cjs',
    splitting: false, // CJS does not support splitting
    outExtension: { '.js': '.js' },
  };

  try {
    if (isWatch) {
      console.log('Starting watch mode...');
      const ctxEsm = await esbuild.context(esmConfig);
      const ctxCjs = await esbuild.context(cjsConfig);
      
      await Promise.all([ctxEsm.watch(), ctxCjs.watch()]);
      console.log('Watching for changes...');
    } else {
      console.log('Building ESM...');
      await esbuild.build(esmConfig);

      console.log('Building CJS...');
      await esbuild.build(cjsConfig);
      
      console.log('Build complete.');
    }

  } catch (e) {
    console.error('Build failed:', e);
    process.exit(1);
  }
}

build();
