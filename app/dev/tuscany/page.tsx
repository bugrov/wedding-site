import { PageRenderer } from "@/components/page-renderer";
import { createDefaultBlocksConfig } from "@/lib/blocks";

// Internal end-to-end check for step 3: a full site rendered through
// PageRenderer + the real Tuscany template + default sample content — not
// linked from anywhere public. Confirms the template/blocks/primitives
// architecture works together before templates 2-5 get built on top of it.
export default function TuscanyPreviewPage() {
  const blocksConfig = createDefaultBlocksConfig();
  // Dress-code palette is optional and not part of the shared cross-template
  // default (it's a per-project suggestion, not tied to any one template) —
  // set here just to demo the multi-color swatch feature end-to-end.
  blocksConfig.content.dresscode = {
    ...blocksConfig.content.dresscode,
    text: blocksConfig.content.dresscode?.text ?? "",
    palette: ["#4B5320", "#F6F2EA", "#9C6B30", "#2B2620"],
  };

  return (
    <PageRenderer
      templateId="tuscany"
      project={{
        groomName: "Иван",
        brideName: "Мария",
        weddingDate: new Date("2026-09-12T15:00:00"),
      }}
      blocksConfig={blocksConfig}
    />
  );
}
