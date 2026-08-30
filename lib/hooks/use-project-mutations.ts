import { useMutation } from "@tanstack/react-query";
import type { BlocksConfig } from "@/lib/blocks";
import type { ProjectStatus } from "@/app/generated/prisma/client";
import { fetchOrThrow } from "./fetch-or-throw";

export type ProjectSavePayload = {
  slug: string;
  groomName: string;
  brideName: string;
  weddingDate: string;
  templateId: string;
  status: ProjectStatus;
  blocksConfig: BlocksConfig;
};

export function useSaveProjectMutation(projectId: string) {
  return useMutation({
    mutationFn: async (payload: ProjectSavePayload) => {
      const res = await fetchOrThrow(`/api/admin/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        // Surface the server's actual reason (e.g. a duplicate slug) instead
        // of a generic message — the operator needs to know which.
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Не удалось сохранить изменения");
      }
    },
  });
}

export function usePublishProjectMutation(projectId: string) {
  return useMutation({
    mutationFn: async (): Promise<{ publishedAt: string | null }> => {
      const res = await fetchOrThrow(`/api/admin/projects/${projectId}/publish`, {
        method: "POST",
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error("Не удалось изменить публикацию");
      return data;
    },
  });
}
