import type { TemplateDefinition } from "@/lib/templates/types";
import { TuscanyThemeWrapper, TUSCANY_DEFAULT_COLORS } from "./theme";
import { TuscanyCover } from "./cover";
import { TuscanyTimer } from "./timer";
import { TuscanyStory } from "./story";
import { TuscanySchedule } from "./schedule";
import { TuscanyVenue } from "./venue";
import { TuscanyDressCode } from "./dresscode";
import { TuscanyGallery } from "./gallery";
import { TuscanyWishes } from "./wishes";
import { TuscanyChat } from "./chat";
import { TuscanyRsvp } from "./rsvp";

export const tuscanyTemplate: TemplateDefinition = {
  id: "tuscany",
  label: "Тоскана",
  ThemeWrapper: TuscanyThemeWrapper,
  defaultColorTokens: TUSCANY_DEFAULT_COLORS,
  Cover: TuscanyCover,
  blocks: {
    timer: TuscanyTimer,
    story: TuscanyStory,
    schedule: TuscanySchedule,
    venue: TuscanyVenue,
    dresscode: TuscanyDressCode,
    gallery: TuscanyGallery,
    wishes: TuscanyWishes,
    chat: TuscanyChat,
    rsvp: TuscanyRsvp,
  },
  // See plan feedback: "то блок зелёный, то бежевый" — Timer/Schedule/RSVP
  // keep their own fixed hero treatments, these six alternate cream/olive
  // by position among whichever of them are actually enabled.
  alternatingBlocks: ["story", "venue", "dresscode", "gallery", "wishes", "chat"],
};
