/**
 * Hashes a password with SHA-256 using the browser's built-in Web Crypto API.
 * The plaintext password is never stored — only this hex digest is persisted.
 *
 * Note: this is a client-side gate suitable for keeping casual/unauthorized
 * users out of a shared device, not a substitute for real server-side auth.
 * Anyone with access to browser devtools on the device can inspect app state.
 */
export async function hashPassword(password) {
  const encoded = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest('SHA-256', encoded);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}
