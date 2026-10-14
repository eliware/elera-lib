export function validateUtcTimestamp(value, name) {
  const match =
    typeof value === "string" &&
    value.match(
      /^([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2}):([0-9]{2})(?:\.([0-9]{3}))?Z$/,
    );
  const date = match ? new Date(Date.parse(value)) : null;
  if (
    !match ||
    Number.isNaN(date.getTime()) ||
    date.getUTCFullYear() !== Number(match[1]) ||
    date.getUTCMonth() + 1 !== Number(match[2]) ||
    date.getUTCDate() !== Number(match[3]) ||
    date.getUTCHours() !== Number(match[4]) ||
    date.getUTCMinutes() !== Number(match[5]) ||
    date.getUTCSeconds() !== Number(match[6]) ||
    date.getUTCMilliseconds() !== (match[7] ? Number(match[7]) : 0)
  )
    throw new TypeError(`${name} must be UTC`);
}
