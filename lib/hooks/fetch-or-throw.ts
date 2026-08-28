// Shared by every mutation hook in this directory — a fetch() network
// failure (offline, DNS, CORS) throws a generic browser TypeError with an
// unlocalized message ("Failed to fetch"); this normalizes it to the same
// Russian copy everywhere instead of duplicating the string per hook.
export async function fetchOrThrow(input: RequestInfo, init?: RequestInit): Promise<Response> {
  try {
    return await fetch(input, init);
  } catch {
    throw new Error("Не удалось связаться с сервером. Проверьте соединение и попробуйте ещё раз.");
  }
}
