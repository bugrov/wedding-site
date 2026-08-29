import { tuscanyTemplate } from "@/components/templates/tuscany";
import { oldMoneyTemplate } from "@/components/templates/old-money";
import { editorialBwTemplate } from "@/components/templates/editorial-bw";
import { pinkSketchTemplate } from "@/components/templates/pink-sketch";
import type { TemplateDefinition } from "./types";

export const TEMPLATES: Record<string, TemplateDefinition> = {
  tuscany: tuscanyTemplate,
  "old-money": oldMoneyTemplate,
  "editorial-bw": editorialBwTemplate,
  "pink-sketch": pinkSketchTemplate,
};

export const TEMPLATE_IDS = Object.keys(TEMPLATES);
