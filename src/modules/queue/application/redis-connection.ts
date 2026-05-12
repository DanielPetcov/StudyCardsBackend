import type { RedisOptions } from 'ioredis';

const DEFAULT_REDIS_PORT = 6379;
const DEFAULT_REDIS_TLS_PORT = 6380;

function parseOptionalNumber(value: string | undefined): number | undefined {
  if (!value) return undefined;

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function shouldUseTls(host?: string, port?: number): boolean {
  return (
    process.env.REDIS_TLS === 'true' ||
    port === DEFAULT_REDIS_TLS_PORT ||
    Boolean(host?.includes('upstash.io'))
  );
}

export function getRedisConnectionOptions(): RedisOptions {
  const commonOptions: RedisOptions = {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  };

  if (process.env.REDIS_URL) {
    const url = new URL(process.env.REDIS_URL);
    const db = parseOptionalNumber(url.pathname.replace(/^\//, ''));
    const port = parseOptionalNumber(url.port) ??
      (url.protocol === 'rediss:' ? DEFAULT_REDIS_TLS_PORT : DEFAULT_REDIS_PORT);

    return {
      ...commonOptions,
      host: url.hostname,
      port,
      username: url.username ? decodeURIComponent(url.username) : undefined,
      password: url.password ? decodeURIComponent(url.password) : undefined,
      db,
      tls: url.protocol === 'rediss:' ? {} : undefined,
    };
  }

  const host = process.env.REDIS_HOST ?? '127.0.0.1';
  const port = parseOptionalNumber(process.env.REDIS_PORT) ?? DEFAULT_REDIS_PORT;

  return {
    ...commonOptions,
    host,
    port,
    username: process.env.REDIS_USERNAME || undefined,
    password: process.env.REDIS_PASSWORD || undefined,
    tls: shouldUseTls(host, port) ? {} : undefined,
  };
}
