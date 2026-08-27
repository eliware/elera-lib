import { expect, test } from '@jest/globals';
import { createQuiesceController } from '../src/lifecycle/quiesce.mjs';
test('blocks new work and waits for active work to finish', async () => { const q = createQuiesceController(); const leave = q.enter(); const pending = q.begin(); leave(); await pending; expect(q.state().state).toBe('quiesced'); expect(() => q.enter()).toThrow('quiesced'); await q.end(); expect(q.state().state).toBe('open'); });
test('closes the underlying client after quiescing', async () => { let closed = false; const q = createQuiesceController({ close: async () => { closed = true; } }); await q.begin(); await q.close(); expect(closed).toBe(true); expect(q.state().state).toBe('closed'); });
