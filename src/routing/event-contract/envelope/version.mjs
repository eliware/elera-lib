export function validateEventVersion(version, name = "routing event", minimum = 0) {
  if (!Number.isInteger(version) || version < minimum)
    throw new TypeError(
      minimum === 0
        ? `${name} version must be a non-negative integer`
        : `${name} version must be positive`,
    );
}
