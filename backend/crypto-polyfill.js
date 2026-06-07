import { webcrypto } from 'node:crypto';

// MongoDB driver 7.x uses the Web Crypto API (bare `crypto`) for SCRAM auth
if (!globalThis.crypto) {
  globalThis.crypto = webcrypto;
}
