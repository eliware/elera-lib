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
export interface WriterAssignment { host: string; port: number | string; }
export interface RoutingBundle {
  apiVersion?: string;
  database?: string;
  identity?: string;
  credentials?: { username?: string; password?: string };
  bundleVersion?: number | string;
  expiresAt: string;
  refreshAfter?: string;
  routes: { primary?: RoutingNode[]; balanced?: RoutingNode[] };
  writer?: WriterAssignment;
  failover?: WriterAssignment[];
  readers?: WriterAssignment[];
}
export interface CredentialProviderResult { user: string; password: string; }
export type CredentialProvider = (context: { database: string; identity: string | null; route: string }) => Promise<CredentialProviderResult> | CredentialProviderResult;
export type QueryFunction = (sql: string, values?: unknown) => Promise<any>;
export interface DbOptions { route?: 'auto' | 'primary' | 'balanced'; connection?: unknown; }
export interface TelemetrySnapshot { type: 'client.telemetry'; application: string; queries: number; failures: number; retries: number; reconnects: number; failoverCount: number; reconnectDelayMs: number; inflight: number; totalLatencyMs: number; maxLatencyMs: number; avgLatencyMs: number; sentAt: string; }
export interface Telemetry { begin(): number; record(event?: { latencyMs?: number; failed?: boolean; retry?: boolean; reconnect?: boolean; failover?: boolean }): void; recordReconnect(event?: { delayMs?: number; failover?: boolean }): void; snapshot(): TelemetrySnapshot; start(stream: Pick<RoutingStream, 'sendTelemetry'>): void; stop(): void; }

export interface DbClient {
  query(sql: string, values?: unknown, options?: DbOptions): Promise<unknown>;
  execute(sql: string, values?: unknown, options?: DbOptions): Promise<unknown>;
  transaction<T>(callback: (transaction: Pick<DbClient, 'query' | 'execute'>) => Promise<T>): Promise<T>;
  health(route?: 'primary' | 'balanced'): Promise<{ ok: boolean; route: string; latencyMs: number; telemetry?: TelemetrySnapshot }>;
  close(): Promise<void>;
  refresh(bundle: RoutingBundle): Promise<{ bundleVersion: number | string | null; refreshRequired: boolean }>;
  bundle(): RoutingBundle | undefined;
  classify(sql: string): 'primary' | 'balanced';
  attachRoutingStream(stream: RoutingStream): Promise<() => void>;
  setNodeAvailability(route: 'primary' | 'balanced', host: string, available: boolean): void;
  availability(): { state: 'available' | 'cluster-unavailable'; routes: { primary: boolean; balanced: boolean } };
  drain(host: string, timeoutMs?: number): { host: string; timeoutMs: number; wait(): Promise<unknown[]>; forceClose(): Promise<unknown[]> };
  nodeStates(): Array<{ host: string; port: number; route: 'primary' | 'balanced'; state: 'ready' | 'draining' | 'unavailable' | 'recovering'; active: number; available: boolean }>;
  config: { primary: ConnectionProfile; balanced?: ConnectionProfile };
  telemetry?: Telemetry;
}

export interface RoutingStream {
  connect(): Promise<void>;
  setOnUpdate(handler: (event: unknown) => void | Promise<void>): void;
  close(): void;
  sendTelemetry(payload: unknown): void;
  setTelemetry?(telemetry?: Pick<Telemetry, 'recordReconnect'>): void;
  state(): { connected: boolean; mode: 'websocket' | 'rest' | 'disconnected'; expectedVersion: number | string; endpoint: string; reconnectDeadlineAt?: number };
}

export type RoutingEvent = { type: 'routing.update' | 'routing.resync' | 'routing.drain' | 'routing.recovery'; node?: string; version?: number | string; [key: string]: unknown } | { type: 'routing.shutdown'; node?: string; reason?: string; reconnect?: boolean; reconnectDeadlineMs?: number; loadBalancerEndpoint?: string };
export function validateRoutingEvent(event: unknown): RoutingEvent;

export function createDb(options: { primary: ConnectionProfile; balanced?: Partial<ConnectionProfile>; bundle?: RoutingBundle; credentialProvider?: CredentialProvider; identity?: string; mysqlLib?: unknown; log?: unknown; routing?: 'auto' | 'primary' | 'balanced'; quarantineMs?: number; drainTimeoutMs?: number; now?: () => number; telemetry?: true | Telemetry }): Promise<DbClient>;
export function createDbFromEnvironment(options?: { env?: Record<string, string | undefined>; mysqlLib?: unknown; log?: unknown; routing?: 'auto' | 'primary' | 'balanced'; bundle?: RoutingBundle; credentialProvider?: CredentialProvider; identity?: string; telemetry?: true | Telemetry }): Promise<DbClient>;
export function classifyQuery(sql: unknown): 'primary' | 'balanced';
export function routeFor(sql: unknown, requested?: 'auto' | 'primary' | 'balanced'): 'primary' | 'balanced';
export function validateProfile(profile: ConnectionProfile, name?: string): ConnectionProfile;
export function redactedProfile(profile: ConnectionProfile): ConnectionProfile;
export class SqlClientError extends Error { code?: string; retryable?: boolean; cause?: unknown; }
export class ClusterUnavailableError extends SqlClientError {}
export function classifyError(error: unknown): { retryable: boolean; code?: string };
export function asSqlError(error: unknown): SqlClientError;
export function validateBundle(bundle: RoutingBundle): RoutingBundle;
export function bundleExpired(bundle: RoutingBundle, now?: number): boolean;
export function bundleNeedsRefresh(bundle: RoutingBundle, now?: number): boolean;
export function createAdminSql(options: { query: QueryFunction }): { transaction<T>(work: (context: { query: QueryFunction }) => Promise<T>): Promise<T>; migration(statements?: string[]): Promise<unknown> };
export function createMigrationRunner(options: { query: QueryFunction; migrations?: Array<{ version: number; name: string; statements: string[] }> }): { status(): Promise<{ applied: unknown[] }>; migrate(): Promise<unknown> };
export function selectRouteNodes(options: { bundle: RoutingBundle; route?: 'primary' | 'balanced'; now?: number }): RoutingNode[];
export function createRoutingStream(options: { endpoint: string; token?: string; application?: string; fetchBundle: (application: string) => Promise<RoutingBundle>; onUpdate?: (event: unknown) => void; onError?: (error: unknown) => void; reconnectMs?: number; maxReconnectMs?: number; heartbeatMs?: number; telemetry?: Pick<Telemetry, 'recordReconnect'> }): RoutingStream;
export function writerAssignment(bundle: RoutingBundle): WriterAssignment;
export function failoverNodes(bundle: RoutingBundle): WriterAssignment[];
export function compareBundleVersions(left: number | string | undefined, right: number | string | undefined): number;
export const CLIENT_DRAIN_TIMEOUT_MS: 45000;
export function clientDrainTimeout(timeoutMs?: number): number;
export function createQuiesceController(options?: { close?: () => Promise<void>; onChange?: (state: string) => void }): { state(): { state: string; active: number }; enter(): () => void; begin(): Promise<void>; end(): Promise<void>; close(): Promise<void> };
export function createSqlVerifier(options: { query: QueryFunction }): { connectivity(): Promise<{ verified: boolean }>; schema(database: string): Promise<{ database: string; verified: boolean }>; account(user: string, host?: string): Promise<{ user: string; host: string; verified: boolean; grants: string[] }>; all(options?: { database?: string; user?: string; host?: string }): Promise<unknown> };
export function createMaterializer(options?: Record<string, unknown>): unknown;
export function createTelemetry(options?: { application?: string; intervalMs?: number; now?: () => number; setIntervalImpl?: typeof setInterval; clearIntervalImpl?: typeof clearInterval }): Telemetry;
