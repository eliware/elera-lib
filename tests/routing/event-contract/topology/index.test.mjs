import { expect, test } from '@jest/globals';
import { validateTopologyEvent } from '../../../../src/routing/event-contract/topology/index.mjs';
test('exports topology validation', () => expect(validateTopologyEvent).toBeDefined());
