import type { TemplateDefinition } from "@/lib/templates/types";
import { MoodyPaperThemeWrapper, MOODY_PAPER_DEFAULT_COLORS } from "./theme";
import { MoodyPaperCover } from "./cover";
import { MoodyPaperTimer } from "./timer";
import { MoodyPaperStory } from "./story";
import { MoodyPaperSchedule } from "./schedule";
import { MoodyPaperVenue } from "./venue";
import { MoodyPaperDressCode } from "./dresscode";
import { MoodyPaperGallery } from "./gallery";
import { MoodyPaperWishes } from "./wishes";
import { MoodyPaperChat } from "./chat";
import { MoodyPaperRsvp } from "./rsvp";

export const moodyPaperTemplate: TemplateDefinition = {
  id: "moody-paper",
  label: "Moody Paper",
  ThemeWrapper: MoodyPaperThemeWrapper,
  defaultColorTokens: MOODY_PAPER_DEFAULT_COLORS,
  Cover: MoodyPaperCover,
  blocks: {
    timer: MoodyPaperTimer,
    story: MoodyPaperStory,
    schedule: MoodyPaperSchedule,
    venue: MoodyPaperVenue,
    dresscode: MoodyPaperDressCode,
    gallery: MoodyPaperGallery,
    wishes: MoodyPaperWishes,
    chat: MoodyPaperChat,
    rsvp: MoodyPaperRsvp,
  },
};
