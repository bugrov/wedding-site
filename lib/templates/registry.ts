import { tuscanyTemplate } from "@/components/templates/tuscany";
import type { TemplateDefinition } from "./types";

export const TEMPLATES: Record<string, TemplateDefinition> = {
  tuscany: tuscanyTemplate,
};

export const TEMPLATE_IDS = Object.keys(TEMPLATES);
