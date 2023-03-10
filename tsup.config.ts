import { defineConfig, Format } from 'tsup';

export const baseTsupConfig = {
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'] as Format[],
  target: 'es2022' as any,
  splitting: false,
  sourcemap: true,
  skipNodeModulesBundle: true,
  clean: true,
  minify: false,
  keepNames: true,
  dts: true
};

export default defineConfig(baseTsupConfig);
