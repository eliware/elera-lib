export function createRoutePool(nodes) {
  let cursor = 0;
  const candidates = () => nodes.filter((node) => node.available);
  const choose = () => {
    const available = candidates();
    if (!available.length) throw new Error('no eligible SQL nodes available');
    const total = available.reduce((sum, node) => sum + Math.max(0, node.weight), 0);
    if (!total) return available[cursor++ % available.length];
    let target = cursor++ % total;
    let selected = available[available.length - 1];
    for (const node of available) {
      const weight = Math.max(0, node.weight);
      if (target < weight) {
        selected = node;
        break;
      }
      target -= weight;
    }
    return selected;
  };
  const setAvailability = (host, available) => {
    for (const node of nodes) if (node.host === host) node.available = available;
  };
  const query = (sql, values) => choose().query(sql, values);
  const execute = (sql, values) => choose().execute(sql, values);
  const health = async () => {
    const results = [];
    for (const node of nodes) {
      try {
        results.push(await node.health());
      } catch (error) {
        results.push({ ok: false, host: node.host, port: node.port, error: error.message });
      }
    }
    return results;
  };
  const close = async () => Promise.all(nodes.map((node) => node.close()));
  return { nodes, choose, setAvailability, query, execute, health, close };
}
