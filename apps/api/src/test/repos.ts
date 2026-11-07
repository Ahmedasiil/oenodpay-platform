import pg from 'pg';
import { migrate } from '../db/migrate';
import { MemoryRepository } from '../repo/memory';
import { PostgresRepository } from '../repo/postgres';
import type { Repository } from '../repo/types';

/**
 * Tests run against the in-memory repository always, and against PostgreSQL too when
 * TEST_DATABASE_URL is set (CI sets it). Each Postgres run starts from an empty schema.
 */
export const TEST_DATABASE_URL = process.env.TEST_DATABASE_URL;

export const repoKinds: Array<'memory' | 'postgres'> = TEST_DATABASE_URL ? ['memory', 'postgres'] : ['memory'];

let pool: pg.Pool | undefined;

export async function freshRepo(kind: 'memory' | 'postgres'): Promise<Repository> {
  if (kind === 'memory') return new MemoryRepository();
  pool ??= new pg.Pool({ connectionString: TEST_DATABASE_URL, max: 20 });
  await pool.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public;');
  await migrate(pool);
  const repo = await PostgresRepository.connect(pool);
  // Leave the shared pool open between tests; vitest ends the process afterwards.
  return Object.assign(repo, { close: async () => {} });
}

export function rawPool(): pg.Pool {
  if (!pool) throw new Error('No Postgres pool');
  return pool;
}
