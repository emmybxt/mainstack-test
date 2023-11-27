export function throwIfUndefined<T>(x: T | undefined, name?: string): T {
  if (!x) {
    throw new Error(`${name} must not be undefined`);
  }
  return x;
}
