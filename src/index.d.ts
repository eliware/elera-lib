export interface RoutingNode { host: string; port: number | string; weight?: number; nodeId?: string; }
export interface RoutingBundle { apiVersion?: string; applicationId?: string; databaseId?: string; identityId?: string; application?: string; database?: string; identity?: string; credentialName?: string; scopes?: string[]; credentials?: { username?: string; password?: string }; bundleVersion?: number | string; expiresAt: string; refreshAfter?: string; routes: { primary?: RoutingNode[]; balanced?: RoutingNode[] }; writer?: RoutingNode; failover?: RoutingNode[]; readers?: RoutingNode[]; nodeIdentity?: Record<string, unknown>; ports?: Record<string, number | string>; }
export interface TelemetrySnapshot { type: 'client.telemetry'; application: string; credentialName?: string; database?: string; scopes?: string[]; queries: number; failures: number; retries: number; reconnects: number; failoverCount: number; reconnectDelayMs: number; inflight: number; totalLatencyMs: number; maxLatencyMs: number; avgLatencyMs: number; sentAt: string; }
export interface Telemetry { snapshot(): TelemetrySnapshot; begin(): number; record(event?: unknown): void; recordReconnect(event?: unknown): void; }
export function validateBundle(bundle: RoutingBundle): RoutingBundle;
export function bundleExpired(bundle: RoutingBundle, now?: number): boolean;
export function bundleNeedsRefresh(bundle: RoutingBundle, now?: number): boolean;
export function validateRoutingEvent(event: unknown): unknown;
export function compareBundleVersions(left: number | string | undefined, right: number | string | undefined): number;
export function writerAssignment(bundle: RoutingBundle): RoutingNode;
export function failoverNodes(bundle: RoutingBundle): RoutingNode[];
export function validateRoutingNode(node: RoutingNode, name?: string): RoutingNode;
export function validateRoutingNodes(nodes: RoutingNode[], name?: string): RoutingNode[];
export const CLIENT_DRAIN_TIMEOUT_MS: 45000;
export function clientDrainTimeout(timeoutMs?: number): number;
export function createTelemetry(options?: Record<string, unknown>): Telemetry;
export class SqlClientError extends Error { code?: string; retryable?: boolean; cause?: unknown; }
export class ClusterUnavailableError extends SqlClientError {}
export class ServerUnavailableError extends SqlClientError {}
export function classifyError(error: unknown): { retryable: boolean; code?: string };
export function asSqlError(error: unknown): SqlClientError;
