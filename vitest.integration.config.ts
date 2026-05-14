import { defineConfig, mergeConfig } from 'vitest/config';
import baseConfig from './vitest.base.config';

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      include: ['src/test/integration/**/*.test.ts'],
      setupFiles: ['src/test/integration/setup.ts'],
      globalSetup: ['src/test/integration/globalSetup.ts'],
      pool: 'threads',
      maxWorkers: 1,
      minWorkers: 1,
    },
  })
);
