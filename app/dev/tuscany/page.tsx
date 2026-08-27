import { PageRenderer } from "@/components/page-renderer";
import { createDefaultBlocksConfig } from "@/lib/blocks";

// Internal end-to-end check for step 3: a full site rendered through
// PageRenderer + the real Tuscany template + default sample content — not
// linked from anywhere public. Confirms the template/blocks/primitives
// architecture works together before templates 2-5 get built on top of it.
export default function TuscanyPreviewPage() {
  const blocksConfig = createDefaultBlocksConfig();

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
