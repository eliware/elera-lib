export function validateBundleScopes(scopes) {
  if (scopes !== undefined && (!Array.isArray(scopes) || scopes.some((scope) => typeof scope !== 'string' || scope.length === 0))) throw new TypeError('routing bundle scopes must be an array of non-empty strings');
}
