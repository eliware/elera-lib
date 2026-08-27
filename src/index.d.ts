import type { PoolOptions } from 'mysql2/promise';

export interface ConnectionProfile {
  host: string;
  port?: number | string;
  user?: string;
  password?: string;
  database: string;
  options?: Partial<PoolOptions>;
}

export interface RoutingNode { host: string; port: number | string; weight?: number; }
export interface RoutingBundle { bundleVersion?: number | string; expiresAt: string; refreshAfter?: string; routes: { primary?: RoutingNode[]; balanced?: RoutingNode[] }; }
export interface CredentialProviderResult { user: string; password: string; }
export type CredentialProvider = (context: { database: string; identity: string | null; route: string }) => Promise<CredentialProviderResult> | CredentialProviderResult;
export interface DbOptions { route?: 'auto' | 'primary' | 'balanced'; connection?: unknown; }

export interface DbClient {
  query(sql: string, values?: unknown, options?: DbOptions): Promise<unknown>;
  execute(sql: string, values?: unknown, options?: DbOptions): Promise<unknown>;
  transaction<T>(callback: (transaction: Pick<DbClient, 'query' | 'execute'>) => Promise<T>): Promise<T>;
  health(route?: 'primary' | 'balanced'): Promise<{ ok: boolean; route: string; latencyMs: number }>;
  close(): Promise<void>;
  refresh(bundle: RoutingBundle): Promise<{ bundleVersion: number | string | null; refreshRequired: boolean }>;
  bundle(): RoutingBundle | undefined;
  classify(sql: string): 'primary' | 'balanced';
}

export function createDb(options: { primary: ConnectionProfile; balanced?: Partial<ConnectionProfile>; bundle?: RoutingBundle; credentialProvider?: CredentialProvider; identity?: string; mysqlLib?: unknown; log?: unknown; routing?: 'auto' | 'primary' | 'balanced'; quarantineMs?: number; now?: () => number }): Promise<DbClient>;
export function createDbFromEnvironment(options?: { env?: Record<string, string | undefined>; mysqlLib?: unknown; log?: unknown; routing?: 'auto' | 'primary' | 'balanced'; bundle?: RoutingBundle; credentialProvider?: CredentialProvider; identity?: string }): Promise<DbClient>;
export function classifyQuery(sql: unknown): 'primary' | 'balanced';
export function routeFor(sql: unknown, requested?: 'auto' | 'primary' | 'balanced'): 'primary' | 'balanced';
