export function validateWithLogging(logger, operation, validate, context) {
  write(logger, "debug", "Validation started", { operation });
  try {
    const result = validate();
    write(logger, "info", "Validation completed", {
      operation,
      ...context(result),
    });
    return result;
  } catch (error) {
    write(logger, "error", "Validation failed", { operation });
    throw error;
  }
}

function write(logger, level, message, metadata) {
  try {
    if (typeof logger?.[level] === "function") logger[level](message, metadata);
  } catch {
    // Logging must not change validation results.
  }
}
