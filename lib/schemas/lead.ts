import { z } from "zod";
import { TEMPLATE_IDS } from "@/lib/templates/registry";
import { blocksConfigSchema } from "@/lib/blocks";

// Shared by the public configurator (client-side form) and POST /api/leads
// (server-side re-validation) — never trust the client's copy alone.
export const leadSchema = z.object({
  contactName: z.string().min(1, "Введите ваше имя").max(200, "Слишком длинное имя"),
  groomName: z.string().min(1, "Введите имя жениха").max(200, "Слишком длинное имя"),
  brideName: z.string().min(1, "Введите имя невесты").max(200, "Слишком длинное имя"),
  weddingDate: z.coerce.date("Укажите корректную дату"),
  phone: z.string().min(1, "Введите телефон").max(30, "Слишком длинный номер"),
  telegram: z.string().max(100, "Слишком длинное имя пользователя").optional(),
  comment: z.string().max(2000, "Слишком длинный текст").optional(),
  templateId: z.string().refine((id) => TEMPLATE_IDS.includes(id), "Неизвестный шаблон"),
  themeId: z.string().optional(),
  blocksConfig: blocksConfigSchema,
  // 152-ФЗ: без явного согласия заявка не отправляется. Not persisted as
  // data — it's a submit-time gate, the Lead model has no such column.
  consent: z.literal(true, "Нужно согласие на обработку персональных данных"),
});

export type LeadInput = z.infer<typeof leadSchema>;
