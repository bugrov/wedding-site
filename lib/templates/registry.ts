import { tuscanyTemplate } from "@/components/templates/tuscany";
import { oldMoneyTemplate } from "@/components/templates/old-money";
import { editorialBwTemplate } from "@/components/templates/editorial-bw";
import type { TemplateDefinition } from "./types";

export const TEMPLATES: Record<string, TemplateDefinition> = {
  tuscany: tuscanyTemplate,
  "old-money": oldMoneyTemplate,
  "editorial-bw": editorialBwTemplate,
};

export const TEMPLATE_IDS = Object.keys(TEMPLATES);
