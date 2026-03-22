import { OnApplicationShutdown } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import * as schema from './schemas';

export class DatabaseService implements OnApplicationShutdown {
  private readonly pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30000,
  });

  public readonly db = drizzle({
    client: this.pool,
    schema,
    casing: 'snake_case',
  });

  async onApplicationShutdown() {
    await this.pool.end();
  }
}
