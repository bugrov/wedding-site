import type { TemplateDefinition } from "@/lib/templates/types";
import { StorybookThemeWrapper, STORYBOOK_DEFAULT_COLORS } from "./theme";
import { StorybookCover } from "./cover";
import { StorybookTimer } from "./timer";
import { StorybookStory } from "./story";
import { StorybookSchedule } from "./schedule";
import { StorybookVenue } from "./venue";
import { StorybookDressCode } from "./dresscode";
import { StorybookGallery } from "./gallery";
import { StorybookWishes } from "./wishes";
import { StorybookChat } from "./chat";
import { StorybookRsvp } from "./rsvp";

export const illustratedStorybookTemplate: TemplateDefinition = {
  id: "illustrated-storybook",
  label: "Illustrated Storybook",
  ThemeWrapper: StorybookThemeWrapper,
  defaultColorTokens: STORYBOOK_DEFAULT_COLORS,
  Cover: StorybookCover,
  blocks: {
    timer: StorybookTimer,
    story: StorybookStory,
    schedule: StorybookSchedule,
    venue: StorybookVenue,
    dresscode: StorybookDressCode,
    gallery: StorybookGallery,
    wishes: StorybookWishes,
    chat: StorybookChat,
    rsvp: StorybookRsvp,
  },
};
