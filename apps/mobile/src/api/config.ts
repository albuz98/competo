import Constants from 'expo-constants';

export const isMocking: boolean = Constants.expoConfig?.extra?.mocking ?? true;
export const apiUrl: string =
  Constants.expoConfig?.extra?.apiUrl ?? 'https://api.competo.example.com';

const REQUEST_TIMEOUT_MS = 15_000;

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string,
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string> | undefined),
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(`${apiUrl}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal,
    });
  } catch (e) {
    if (e instanceof Error && e.name === 'AbortError') {
      throw new Error('Richiesta scaduta. Controlla la connessione e riprova.');
    }
    throw e;
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    // Expose only the user-facing message from the server; never raw internals
    const safeMessage =
      typeof errorBody?.message === 'string' && errorBody.message.length < 200
        ? errorBody.message
        : `Errore ${response.status}. Riprova più tardi.`;
    throw new Error(safeMessage);
  }

  return response.json() as Promise<T>;
}
