import { createDbFromBundle } from './from-bundle.mjs';
import { fetchRoutingBundle } from '../routing/bundle-fetcher.mjs';
import { createRoutingStream } from '../routing/stream-client.mjs';

export async function createManagedDb({ endpoint, token, fetchImpl = globalThis.fetch, fetchPath, WebSocketImpl = globalThis.WebSocket, ...options } = {}) {
  const fetchBundle = () => fetchRoutingBundle({ endpoint, token, fetchImpl, path: fetchPath });
  const bundle = await fetchBundle();
  const stream = createRoutingStream({ endpoint, token, fetchBundle, WebSocketImpl, ...options });
  const tokenContext = { application: bundle.application, database: bundle.database, credentialName: bundle.credentialName, identity: bundle.identity, scopes: bundle.scopes };
  const client = await createDbFromBundle({ bundle, tokenContext, ...options });
  const detach = await client.attachRoutingStream(stream);
  const close = client.close.bind(client);
  client.close = async () => { await detach?.(); await close(); };
  return client;
}

export function managedOptionsFromEnvironment(env = process.env) {
  const endpoint = env.ELERA_API_ENDPOINT;
  const token = env.ELERA_API_TOKEN;
  if (!endpoint) throw new TypeError('ELERA_API_ENDPOINT is required');
  if (!token) throw new TypeError('ELERA_API_TOKEN is required');
  return { endpoint, token };
}

export async function createManagedDbFromEnvironment({ env = process.env, ...options } = {}) {
  return createManagedDb({ ...managedOptionsFromEnvironment(env), ...options });
}
