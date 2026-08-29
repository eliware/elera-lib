import { expect, test } from '@jest/globals';
import { compareBundleVersions } from '../../src/routing/bundle-version.mjs';

test('compares numeric bundle versions instead of lexical order', () => {
  expect(compareBundleVersions('v10', 'v9')).toBeGreaterThan(0);
  expect(compareBundleVersions(2, 10)).toBeLessThan(0);
  expect(compareBundleVersions('v1.2', 'v1.2.3')).toBeLessThan(0);
  expect(compareBundleVersions('v1.2.3', 'v1.2')).toBeGreaterThan(0);
  expect(compareBundleVersions('release-a', 'release-b')).toBeLessThan(0);
});

test('handles missing, equal, and non-numeric versions', () => {
  expect(compareBundleVersions()).toBe(0);
  expect(compareBundleVersions('v2', undefined)).toBe(0);
  expect(compareBundleVersions('release-a', 'release-a')).toBe(0);
  expect(compareBundleVersions('v1.2', 'v1.2')).toBe(0);
});
