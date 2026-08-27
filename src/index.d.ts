import type { PoolOptions } from 'mysql2/promise';

export interface ConnectionProfile {
  host: string;
  port?: number | string;
  user?: string;
  password?: string;
  database: string;
  options?: Partial<PoolOptions> & { socket?: string };
}

export interface RoutingNode { host: string; port: number | string; weight?: number; }
export interface RoutingBundle {
  apiVersion?: string;
  database?: string;
  identity?: string;
  credentials?: { username?: string; password?: string };
  bundleVersion?: number | string;
  expiresAt: string;
  refreshAfter?: string;
  routes: { primary?: RoutingNode[]; balanced?: RoutingNode[] };
}
export interface CredentialProviderResult { user: string; password: string; }
export type CredentialProvider = (context: { database: string; identity: string | null; route: string }) => Promise<CredentialProviderResult> | CredentialProviderResult;
export type QueryFunction = (sql: string, values?: unknown) => Promise<any>;
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
  attachRoutingStream(stream: RoutingStream): Promise<() => void>;
  setNodeAvailability(route: 'primary' | 'balanced', host: string, available: boolean): void;
  config: { primary: ConnectionProfile; balanced?: ConnectionProfile };
}

export interface RoutingStream {
  connect(): Promise<void>;
  setOnUpdate(handler: (event: unknown) => void | Promise<void>): void;
  close(): void;
  state(): { connected: boolean; mode: 'websocket' | 'rest' | 'disconnected'; expectedVersion: number };
}

export function createDb(options: { primary: ConnectionProfile; balanced?: Partial<ConnectionProfile>; bundle?: RoutingBundle; credentialProvider?: CredentialProvider; identity?: string; mysqlLib?: unknown; log?: unknown; routing?: 'auto' | 'primary' | 'balanced'; quarantineMs?: number; now?: () => number }): Promise<DbClient>;
export function createDbFromEnvironment(options?: { env?: Record<string, string | undefined>; mysqlLib?: unknown; log?: unknown; routing?: 'auto' | 'primary' | 'balanced'; bundle?: RoutingBundle; credentialProvider?: CredentialProvider; identity?: string }): Promise<DbClient>;
export function classifyQuery(sql: unknown): 'primary' | 'balanced';
export function routeFor(sql: unknown, requested?: 'auto' | 'primary' | 'balanced'): 'primary' | 'balanced';
export function validateProfile(profile: ConnectionProfile, name?: string): ConnectionProfile;
export function redactedProfile(profile: ConnectionProfile): ConnectionProfile;
export class SqlClientError extends Error { code?: string; retryable?: boolean; cause?: unknown; }
export function classifyError(error: unknown): { retryable: boolean; code?: string };
export function asSqlError(error: unknown): SqlClientError;
export function validateBundle(bundle: RoutingBundle): RoutingBundle;
export function bundleExpired(bundle: RoutingBundle, now?: number): boolean;
export function bundleNeedsRefresh(bundle: RoutingBundle, now?: number): boolean;
export function createAdminSql(options: { query: QueryFunction }): { transaction<T>(work: (context: { query: QueryFunction }) => Promise<T>): Promise<T>; migration(statements?: string[]): Promise<unknown> };
export function createMigrationRunner(options: { query: QueryFunction; migrations?: Array<{ version: number; name: string; statements: string[] }> }): { status(): Promise<{ applied: unknown[] }>; migrate(): Promise<unknown> };
export function selectRouteNodes(options: { bundle: RoutingBundle; route?: 'primary' | 'balanced'; now?: number }): RoutingNode[];
export function createRoutingStream(options: { endpoint: string; token?: string; application?: string; fetchBundle: (application: string) => Promise<RoutingBundle>; onUpdate?: (event: unknown) => void; onError?: (error: unknown) => void; reconnectMs?: number; maxReconnectMs?: number }): RoutingStream;
export function createQuiesceController(options?: { close?: () => Promise<void>; onChange?: (state: string) => void }): { state(): { state: string; active: number }; enter(): () => void; begin(): Promise<void>; end(): Promise<void>; close(): Promise<void> };
export function createSqlVerifier(options: { query: QueryFunction }): { connectivity(): Promise<{ verified: boolean }>; schema(database: string): Promise<{ database: string; verified: boolean }>; account(user: string, host?: string): Promise<{ user: string; host: string; verified: boolean; grants: string[] }>; all(options?: { database?: string; user?: string; host?: string }): Promise<unknown> };
export function createMaterializer(options?: Record<string, unknown>): unknown;
