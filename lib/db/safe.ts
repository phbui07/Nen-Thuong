// Store pages keep rendering (with empty states) if the database is missing or down.
export async function readSafely<T>(label: string, load: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await load();
  } catch (error) {
    console.error(`Could not load ${label}:`, error);
    return fallback;
  }
}
