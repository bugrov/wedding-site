import { tuscanyTemplate } from "@/components/templates/tuscany";
import { oldMoneyTemplate } from "@/components/templates/old-money";
import { editorialBwTemplate } from "@/components/templates/editorial-bw";
import { pinkSketchTemplate } from "@/components/templates/pink-sketch";
import { moodyPaperTemplate } from "@/components/templates/moody-paper";
import type { TemplateDefinition } from "./types";

export const TEMPLATES: Record<string, TemplateDefinition> = {
  tuscany: tuscanyTemplate,
  "old-money": oldMoneyTemplate,
  "editorial-bw": editorialBwTemplate,
  "pink-sketch": pinkSketchTemplate,
  "moody-paper": moodyPaperTemplate,
};

export const TEMPLATE_IDS = Object.keys(TEMPLATES);
