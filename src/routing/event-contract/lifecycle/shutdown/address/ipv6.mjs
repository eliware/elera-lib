export function isPrivateIpv6Address(hostname) {
  return (
    hostname === "[::1]" ||
    /^\[(fc|fd|fe8|fe9|fea|feb)/.test(hostname) ||
    /^\[::ffff:(10|127|169\.254|192\.168|172\.(1[6-9]|2\d|3[0-1]))(?:\.|\])/.test(hostname)
  );
}
