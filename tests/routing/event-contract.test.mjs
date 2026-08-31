import { expect, test } from '@jest/globals';
import { validateRoutingEvent } from '../../src/routing/event-contract.mjs';
test('compatibility event entrypoint exports validation', () => expect(validateRoutingEvent).toBeDefined());
