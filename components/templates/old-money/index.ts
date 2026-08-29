import type { TemplateDefinition } from "@/lib/templates/types";
import { OldMoneyThemeWrapper, OLD_MONEY_DEFAULT_COLORS } from "./theme";
import { OldMoneyCover } from "./cover";
import { OldMoneyTimer } from "./timer";
import { OldMoneyStory } from "./story";
import { OldMoneySchedule } from "./schedule";
import { OldMoneyVenue } from "./venue";
import { OldMoneyDressCode } from "./dresscode";
import { OldMoneyGallery } from "./gallery";
import { OldMoneyWishes } from "./wishes";
import { OldMoneyChat } from "./chat";
import { OldMoneyRsvp } from "./rsvp";

export const oldMoneyTemplate: TemplateDefinition = {
  id: "old-money",
  label: "Old Money",
  ThemeWrapper: OldMoneyThemeWrapper,
  defaultColorTokens: OLD_MONEY_DEFAULT_COLORS,
  Cover: OldMoneyCover,
  blocks: {
    timer: OldMoneyTimer,
    story: OldMoneyStory,
    schedule: OldMoneySchedule,
    venue: OldMoneyVenue,
    dresscode: OldMoneyDressCode,
    gallery: OldMoneyGallery,
    wishes: OldMoneyWishes,
    chat: OldMoneyChat,
    rsvp: OldMoneyRsvp,
  },
  // See feedback: "делаем чередование бордовых блоков" — Timer/Schedule/RSVP
  // keep their own fixed hero treatments, these six alternate cream/dark
  // burgundy by position among whichever of them are actually enabled.
  alternatingBlocks: ["story", "venue", "dresscode", "gallery", "wishes", "chat"],
};
