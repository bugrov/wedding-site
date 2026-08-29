import type { TemplateDefinition } from "@/lib/templates/types";
import { PinkSketchThemeWrapper, PINK_SKETCH_DEFAULT_COLORS } from "./theme";
import { PinkSketchCover } from "./cover";
import { PinkSketchTimer } from "./timer";
import { PinkSketchStory } from "./story";
import { PinkSketchSchedule } from "./schedule";
import { PinkSketchVenue } from "./venue";
import { PinkSketchDressCode } from "./dresscode";
import { PinkSketchGallery } from "./gallery";
import { PinkSketchWishes } from "./wishes";
import { PinkSketchChat } from "./chat";
import { PinkSketchRsvp } from "./rsvp";

export const pinkSketchTemplate: TemplateDefinition = {
  id: "pink-sketch",
  label: "Pink Sketch",
  ThemeWrapper: PinkSketchThemeWrapper,
  defaultColorTokens: PINK_SKETCH_DEFAULT_COLORS,
  Cover: PinkSketchCover,
  blocks: {
    timer: PinkSketchTimer,
    story: PinkSketchStory,
    schedule: PinkSketchSchedule,
    venue: PinkSketchVenue,
    dresscode: PinkSketchDressCode,
    gallery: PinkSketchGallery,
    wishes: PinkSketchWishes,
    chat: PinkSketchChat,
    rsvp: PinkSketchRsvp,
  },
};
