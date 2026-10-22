export interface RoutingNode {
  host: string;
  port: number;
  weight?: number;
  nodeId?: string;
}
export interface RoutingBundle {
  apiVersion: "v1";
  applicationId?: string;
  databaseId?: string;
  identityId?: string;
  application: string;
  database: string;
  physicalDatabase: string;
  identity: string;
  credentialName?: string;
  scopes?: string[];
  credentials: { username: string; password: string };
  bundleVersion: number;
  expiresAt: string;
  refreshAfter?: string;
  routes: { primary: RoutingNode[]; balanced: RoutingNode[] };
  writer: RoutingNode;
  failover: RoutingNode[];
  readers: RoutingNode[];
  nodeIdentity: string;
  ports: Record<string, number>;
}
export interface ValidationLogger {
  error(message: unknown, metadata?: unknown): unknown;
  warn(message: unknown, metadata?: unknown): unknown;
  info(message: unknown, metadata?: unknown): unknown;
  http(message: unknown, metadata?: unknown): unknown;
  verbose(message: unknown, metadata?: unknown): unknown;
  debug(message: unknown, metadata?: unknown): unknown;
  silly(message: unknown, metadata?: unknown): unknown;
}
export interface ValidationOptions {
  logger?: ValidationLogger;
}
export function validateBundle(bundle: unknown, options?: ValidationOptions): RoutingBundle;
export function validateRoutingEvent(event: unknown, options?: ValidationOptions): unknown;
export interface RoutingTopologyEvent {
  type: "routing.topology";
  version: number;
  generatedAt: string;
  node: string;
  context: {
    nodeIdentity: Record<string, unknown>;
    ports: Record<string, number>;
    clusterCondition: string;
    refreshAfter?: string;
  };
  topology: {
    nodes: Array<{
      nodeId: string;
      address: string;
      sqlPort: number;
      state: string;
      draining: boolean;
    }>;
  };
}
