import { webcrypto } from 'node:crypto';

// MongoDB 7.x needs Web Crypto (`crypto.subtle`) for SCRAM auth.
if (!globalThis.crypto?.subtle) {
  try {
    globalThis.crypto = webcrypto;
  } catch {
    // Node 20+ defines read-only globalThis.crypto — already present
  }
}

if (!globalThis.crypto?.subtle) {
  throw new Error('Web Crypto unavailable — deploy with Node.js 20 (see nixpacks.toml)');
}
