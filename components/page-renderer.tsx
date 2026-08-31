import { TEMPLATES } from "@/lib/templates/registry";
import type { ProjectSummary } from "@/lib/templates/types";
import type { BlocksConfig } from "@/lib/blocks";
import type { ColorTokens } from "@/lib/theme/tokens";
import { MusicToggle } from "@/components/music-toggle";
import { InvitationGateEnvelope as InvitationGate } from "@/components/invitation-gate-envelope";
import { DEFAULT_BACKGROUND_MUSIC_SRC } from "@/lib/audio/default-track";

/**
 * Renders a guest-facing wedding site from a template + blocksConfig + theme.
 * This is the single place that turns "which blocks are enabled, in what
 * order, with what content" into an actual page — the admin editor, the
 * public configurator preview, and the real published site all go through
 * this same renderer (see plan: "Механизм смены дизайна").
 */
export function PageRenderer({
  templateId,
  project,
  blocksConfig,
  colorTokens,
  previewMode,
}: {
  templateId: string;
  project: ProjectSummary;
  blocksConfig: BlocksConfig;
  colorTokens?: ColorTokens;
  previewMode?: boolean;
}) {
  const template = TEMPLATES[templateId];
  if (!template) {
    return null;
  }

  const { Cover, ThemeWrapper, blocks, alternatingBlocks } = template;
  const enabledOrder = blocksConfig.order.filter((type) =>
    blocksConfig.enabledBlocks.includes(type),
  );

  // Parity by position among just the *enabled* alternating blocks, not a
  // fixed per-type color — so disabling one never leaves two same-treatment
  // blocks stranded next to each other (see TemplateDefinition.alternatingBlocks).
  const alternateDarkByType = new Map<string, boolean>();
  if (alternatingBlocks) {
    let position = 0;
    for (const type of enabledOrder) {
      if (alternatingBlocks.includes(type)) {
        alternateDarkByType.set(type, position % 2 === 1);
        position++;
      }
    }
  }

  return (
    <ThemeWrapper colorTokens={colorTokens}>
      {blocksConfig.features.music && (
        <>
          {/* Never in previewMode (admin editor / public configurator) — a
              full-screen tap-to-enter gate makes sense for a real guest's
              first visit, not for someone actively editing the site who'd
              have to tap through it on every reload (see feedback: "на
              конфигураторе нам не нужен конверт, он блочит весь ui"). */}
          {!previewMode && <InvitationGate />}
          <MusicToggle src={blocksConfig.features.musicUrl || DEFAULT_BACKGROUND_MUSIC_SRC} />
        </>
      )}
      <Cover project={project} content={blocksConfig.cover} />
      {enabledOrder.map((type) => {
        const Block = blocks[type];
        const content = blocksConfig.content[type];
        if (!content) return null;
        // Each key of `content` is only ever read by the matching block
        // renderer for that same key, so this is sound despite the cast.
        return (
          <Block
            key={type}
            project={project}
            content={content as never}
            previewMode={previewMode}
            coverPhotoUrl={blocksConfig.cover.photoUrl}
            alternateDark={alternateDarkByType.get(type)}
          />
        );
      })}
    </ThemeWrapper>
  );
}
