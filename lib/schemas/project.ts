import { z } from "zod";
import { TEMPLATE_IDS } from "@/lib/templates/registry";
import { blocksConfigSchema } from "@/lib/blocks";
import { ProjectStatus } from "@/app/generated/prisma/client";

// The admin project editor's save payload — client-side and re-validated
// server-side in PATCH /api/admin/projects/[id], same reasoning as leadSchema.
export const projectUpdateSchema = z.object({
  groomName: z.string().min(1, "Введите имя жениха"),
  brideName: z.string().min(1, "Введите имя невесты"),
  weddingDate: z.coerce.date("Укажите корректную дату"),
  templateId: z.string().refine((id) => TEMPLATE_IDS.includes(id), "Неизвестный шаблон"),
  status: z.enum(ProjectStatus),
  blocksConfig: blocksConfigSchema,
});

export type ProjectUpdateInput = z.infer<typeof projectUpdateSchema>;
