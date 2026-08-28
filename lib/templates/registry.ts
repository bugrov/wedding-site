import { tuscanyTemplate } from "@/components/templates/tuscany";
import { oldMoneyTemplate } from "@/components/templates/old-money";
import type { TemplateDefinition } from "./types";

export const TEMPLATES: Record<string, TemplateDefinition> = {
  tuscany: tuscanyTemplate,
  "old-money": oldMoneyTemplate,
};

export const TEMPLATE_IDS = Object.keys(TEMPLATES);
