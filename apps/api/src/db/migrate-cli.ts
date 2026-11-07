import pg from 'pg';
import { migrate } from './migrate';

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('Set DATABASE_URL first, for example postgres://oenodpay:oenodpay@localhost:5432/oenodpay');
  process.exit(1);
}
const pool = new pg.Pool({ connectionString: url });
const applied = await migrate(pool);
console.log(applied.length ? `Applied: ${applied.join(', ')}` : 'Database is up to date');
await pool.end();
