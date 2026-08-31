import { useMutation } from "@tanstack/react-query";
import { fetchOrThrow } from "./fetch-or-throw";

export function usePhotoUploadMutation() {
  return useMutation({
    mutationFn: async (file: File): Promise<string> => {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetchOrThrow("/api/upload", { method: "POST", body: formData });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Не удалось загрузить фото.");
      }

      const data = (await res.json()) as { url: string };
      return data.url;
    },
  });
}
