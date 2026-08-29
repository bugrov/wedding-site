import { z } from "zod";

// Shared by the RSVP block's client-side form and POST /api/rsvp's
// server-side re-validation — same reasoning as leadSchema: never trust the
// client's copy alone.
export const rsvpSchema = z.object({
  projectId: z.string().min(1, "Некорректный проект").max(50, "Некорректный проект"),
  name: z.string().min(1, "Введите имя").max(200, "Слишком длинное имя"),
  attending: z.boolean(),
  headcount: z.coerce.number().int().min(1).max(20).optional(),
  foodPref: z.string().max(500, "Слишком длинный текст").optional(),
  drinkPref: z.string().max(500, "Слишком длинный текст").optional(),
  plusOneName: z.string().max(200, "Слишком длинное имя").optional(),
  comment: z.string().max(1000, "Слишком длинный текст").optional(),
});

export type RsvpInput = z.infer<typeof rsvpSchema>;
