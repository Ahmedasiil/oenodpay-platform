import pg from 'pg';
import { loadConfig } from './config';
import { buildApp } from './app';
import { migrate } from './db/migrate';
import { MemoryRepository } from './repo/memory';
import { PostgresRepository } from './repo/postgres';
import type { Repository } from './repo/types';

const config = loadConfig();

let repo: Repository;
if (config.DATABASE_URL) {
  const pool = new pg.Pool({ connectionString: config.DATABASE_URL, max: 20 });
  await migrate(pool);
  repo = await PostgresRepository.connect(pool);
} else {
  console.warn('DATABASE_URL is not set: data is kept in memory and lost on restart (development only).');
  repo = new MemoryRepository();
}

const app = await buildApp(config, repo);
const shutdown = async () => {
  await app.close();
  await repo.close();
  process.exit(0);
};
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
await app.listen({ port: config.PORT, host: '0.0.0.0' });
