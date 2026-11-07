import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Postgres-backed tests share one database, so test files run one after another.
    fileParallelism: false,
    testTimeout: 20_000,
  },
});
