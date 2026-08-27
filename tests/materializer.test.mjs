import { expect, jest, test } from '@jest/globals';
import { createMaterializer } from '../src/lifecycle/materializer.mjs';
import { join } from 'node:path';

test('materializes content and always removes its temporary directory', async () => {
  const calls = []; const materializer = createMaterializer({ makeTemp: async () => '/tmp/material', write: async (...args) => calls.push(['write', args]), remove: async (...args) => calls.push(['remove', args]), id: () => 'secret' });
  await expect(materializer.withFile('ciphertext', async (path) => { expect(path).toBe(join('/tmp/material', 'secret')); return 'ok'; })).resolves.toBe('ok');
  expect(calls[0][0]).toBe('write'); expect(calls[1][0]).toBe('remove');
});
test('cleans up when the operation fails and validates operation', async () => {
  const remove = jest.fn(async () => {}); const materializer = createMaterializer({ makeTemp: async () => '/tmp/material', write: async () => {}, remove, id: () => 'secret' });
  await expect(materializer.withFile('x', async () => { throw new Error('failed'); })).rejects.toThrow('failed');
  expect(remove).toHaveBeenCalled(); await expect(materializer.withFile('x')).rejects.toThrow('operation');
});
