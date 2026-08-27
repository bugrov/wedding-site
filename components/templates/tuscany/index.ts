import type { TemplateDefinition } from "@/lib/templates/types";
import { TuscanyThemeWrapper } from "./theme";
import { TuscanyCover } from "./cover";
import { TuscanyTimer } from "./timer";
import { TuscanyStory } from "./story";
import { TuscanySchedule } from "./schedule";
import { TuscanyVenue } from "./venue";
import { TuscanyDressCode } from "./dresscode";
import { TuscanyGallery } from "./gallery";
import { TuscanyWishes } from "./wishes";
import { TuscanyRsvp } from "./rsvp";

export const tuscanyTemplate: TemplateDefinition = {
  id: "tuscany",
  label: "Тоскана",
  ThemeWrapper: TuscanyThemeWrapper,
  Cover: TuscanyCover,
  blocks: {
    timer: TuscanyTimer,
    story: TuscanyStory,
    schedule: TuscanySchedule,
    venue: TuscanyVenue,
    dresscode: TuscanyDressCode,
    gallery: TuscanyGallery,
    wishes: TuscanyWishes,
    rsvp: TuscanyRsvp,
  },
};
