import * as esbuild from 'esbuild';
import { rm } from 'fs/promises';

async function build() {
  // Clean dist
  await rm('dist', { recursive: true, force: true });

  const sharedConfig = {
    entryPoints: [
      'src/index.ts', 
      'src/editor/index.tsx', 
      'src/renderer/index.tsx'
    ],
    bundle: true,
    minify: true,
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
    outdir: 'dist',
    logLevel: 'info',
  };

  try {
    // Build ESM
    console.log('Building ESM...');
    await esbuild.build({
      ...sharedConfig,
      format: 'esm',
      splitting: true,
      outExtension: { '.js': '.mjs' },
    });

    // Build CJS
    console.log('Building CJS...');
    await esbuild.build({
      ...sharedConfig,
      format: 'cjs',
      outExtension: { '.js': '.js' },
    });
    
    console.log('Build complete.');
  } catch (e) {
    console.error('Build failed:', e);
    process.exit(1);
  }
}

build();
