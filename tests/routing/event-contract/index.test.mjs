import { expect, test } from '@jest/globals';
import { validateRoutingEvent } from '../../../src/routing/event-contract/index.mjs';
test('dispatches routing event validation', () => expect(() => validateRoutingEvent()).toThrow('unsupported'));
