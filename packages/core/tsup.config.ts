import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/editor/index.ts', 'src/renderer/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: true, // Crucial para code-splitting
  treeshake: true, // Remove código não utilizado
  clean: true,
  external: ['react', 'react-dom', 'next'],
  minify: true,
});