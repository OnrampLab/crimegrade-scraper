export function env(key: string, defaultValue: string = null) {
  const value = process.env[key] ?? defaultValue;

  if (typeof value !== 'undefined') {
    return value;
  }

  throw new Error(`env: "${key}" is undefined.`);
}
