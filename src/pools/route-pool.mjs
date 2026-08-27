export function createRoutePool(nodes) {
  let cursor = 0;
  const candidates = () => nodes.filter((node) => node.available);
  const choose = () => { const available = candidates(); if (!available.length) throw new Error('no eligible SQL nodes available'); const total = available.reduce((sum, node) => sum + Math.max(0, node.weight), 0); if (!total) return available[cursor++ % available.length]; let target = cursor++ % total; for (const node of available) { target -= Math.max(0, node.weight); if (target < 0) return node; } return available[available.length - 1]; };
  return { nodes, choose, async query(sql, values) { return choose().query(sql, values); }, async execute(sql, values) { return choose().execute(sql, values); }, async health() { const results = []; for (const node of nodes) { try { results.push(await node.health()); } catch (error) { results.push({ ok: false, host: node.host, port: node.port, error: error.message }); } } return results; }, async close() { await Promise.all(nodes.map((node) => node.close())); } };
}
