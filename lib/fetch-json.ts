// Fetches JSON from the store API, returning `fallback` instead of throwing
// when the API is unreachable or responds with an error.
export async function fetchJson<T>(url: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`GET ${url} failed with status ${res.status}`);
      return fallback;
    }
    return await res.json();
  } catch (error) {
    console.error(`GET ${url} failed:`, error);
    return fallback;
  }
}
