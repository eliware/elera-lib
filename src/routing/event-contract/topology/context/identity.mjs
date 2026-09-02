export function validateTopologyIdentity(identity) {
  if (!identity || typeof identity !== 'object' || Array.isArray(identity) || !Object.hasOwn(identity, 'name') || typeof identity.name !== 'string' || identity.name.trim() === '') throw new TypeError('routing topology nodeIdentity is required');
  if (Object.keys(identity).some((key) => key !== 'name')) throw new TypeError('routing topology nodeIdentity field is unknown');
}
