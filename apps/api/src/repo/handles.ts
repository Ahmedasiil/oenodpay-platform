/** Turns an email into a starting @handle: lowercase letters and digits, 3 to 20 characters. */
export function baseHandle(email: string): string {
  const local = email.toLowerCase().split('@')[0]!.replace(/[^a-z0-9]/g, '').slice(0, 20);
  return local.length >= 3 ? local : `${local}user`;
}

export function normaliseHandle(handle: string): string {
  return handle.replace(/^@/, '').toLowerCase();
}
