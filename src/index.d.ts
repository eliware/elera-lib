import type { Pool, PoolOptions } from 'mysql2/promise';

export interface ConnectionProfile {
  host: string;
  port?: number | string;
  user: string;
  password: string;
  database: string;
  options?: Partial<PoolOptions>;
}

export interface DbClient {
  query(sql: string, values?: unknown, options?: { route?: 'auto' | 'primary' | 'balanced' }): Promise<unknown>;
  execute(sql: string, values?: unknown, options?: { route?: 'auto' | 'primary' | 'balanced' }): Promise<unknown>;
  transaction<T>(callback: (transaction: Pick<DbClient, 'query' | 'execute'>) => Promise<T>): Promise<T>;
  health(route?: 'primary' | 'balanced'): Promise<{ ok: boolean; route: string; latencyMs: number }>;
  close(): Promise<void>;
  classify(sql: string): 'primary' | 'balanced';
  pools: { primary: Pool; balanced: Pool | null };
}

export function createDb(options: { primary: ConnectionProfile; balanced?: Partial<ConnectionProfile>; mysqlLib?: unknown; log?: unknown; routing?: 'auto' | 'primary' | 'balanced' }): Promise<DbClient>;
export function createDbFromEnvironment(options?: { env?: Record<string, string | undefined>; mysqlLib?: unknown; log?: unknown; routing?: 'auto' | 'primary' | 'balanced' }): Promise<DbClient>;
export function classifyQuery(sql: unknown): 'primary' | 'balanced';
export function routeFor(sql: unknown, requested?: 'auto' | 'primary' | 'balanced'): 'primary' | 'balanced';
