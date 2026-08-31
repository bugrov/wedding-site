import { useMutation } from "@tanstack/react-query";
import { fetchOrThrow } from "./fetch-or-throw";

export function useFileUploadMutation() {
  return useMutation({
    mutationFn: async (file: File): Promise<string> => {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetchOrThrow("/api/upload", { method: "POST", body: formData });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Не удалось загрузить файл.");
      }

      const data = (await res.json()) as { url: string };
      return data.url;
    },
  });
}

// Fire-and-forget: tells the server a previously-uploaded file (about to be
// replaced by a new one in the same field) can go, if nothing else is using
// it. Never awaited by callers and never surfaces an error — a missed
// cleanup just means a harmless orphan lingers a little longer, not
// something worth interrupting the user's flow over.
export function cleanupUploadedFile(url: string): void {
  fetch("/api/upload/cleanup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  }).catch(() => {});
}
