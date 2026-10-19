import { expect, test } from "@jest/globals";
import { validateShutdownEndpoint } from "../../../../../src/routing/event-contract/lifecycle/shutdown/endpoint.mjs";

test("accepts public HTTP and HTTPS endpoints", () => {
  expect(validateShutdownEndpoint("http://example.com")).toBe("http://example.com");
  expect(validateShutdownEndpoint("https://example.com:443/path")).toBe(
    "https://example.com:443/path",
  );
});

test("rejects invalid URLs and endpoint options", () => {
  for (const value of [
    null,
    "not-url",
    "ftp://example.com",
    "http://user:pass@example.com",
    "http://example.com/?query=1",
    "http://example.com/#fragment",
  ])
    expect(() => validateShutdownEndpoint(value)).toThrow("HTTP");
});

test("rejects ports outside the valid range", () => {
  const OriginalURL = globalThis.URL;
  globalThis.URL = class {
    protocol = "http:";
    hostname = "example.com";
    username = "";
    password = "";
    search = "";
    hash = "";
    port = "65536";
  };
  try {
    expect(() => validateShutdownEndpoint("http://example.com")).toThrow("plain HTTP");
  } finally {
    globalThis.URL = OriginalURL;
  }
});

test("accepts a public IP endpoint and rejects an alternate IP literal", () => {
  expect(validateShutdownEndpoint("http://8.8.8.8")).toBe("http://8.8.8.8");
  expect(() => validateShutdownEndpoint("http://0x7f000001")).toThrow("plain HTTP");
  expect(() => validateShutdownEndpoint("http://[::ffff:ac10:1]")).toThrow("plain HTTP");
  expect(() => validateShutdownEndpoint("http://[0:0:0:0:0:ffff:172.16.0.1]")).toThrow(
    "plain HTTP",
  );
});
