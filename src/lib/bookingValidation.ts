const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const NAME_RE = /^[\p{L}\p{M}][\p{L}\p{M}'’\-. ]{1,99}$/u;

export function isValidEmail(email: unknown): email is string {
  return typeof email === "string" && email.length <= 254 && EMAIL_RE.test(email.trim());
}

export function isValidName(name: unknown): name is string {
  return typeof name === "string" && NAME_RE.test(name.trim());
}
