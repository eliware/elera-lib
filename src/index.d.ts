export interface RoutingNode { host: string; port: number | string; weight?: number; nodeId?: string; }
export interface RoutingBundle { apiVersion?: string; applicationId?: string; databaseId?: string; identityId?: string; application?: string; database?: string; identity?: string; credentialName?: string; scopes?: string[]; credentials?: { username?: string; password?: string }; bundleVersion?: number | string; expiresAt: string; refreshAfter?: string; routes: { primary?: RoutingNode[]; balanced?: RoutingNode[] }; writer?: RoutingNode; failover?: RoutingNode[]; readers?: RoutingNode[]; nodeIdentity?: string; ports?: Record<string, number | string>; }
export function validateBundle(bundle: RoutingBundle): RoutingBundle;
export function validateRoutingEvent(event: unknown): unknown;
