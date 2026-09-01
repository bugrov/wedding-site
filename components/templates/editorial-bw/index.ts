import type { TemplateDefinition } from "@/lib/templates/types";
import { EditorialBwThemeWrapper, EDITORIAL_BW_DEFAULT_COLORS } from "./theme";
import { EditorialBwCover } from "./cover";
import { EditorialBwTimer } from "./timer";
import { EditorialBwStory } from "./story";
import { EditorialBwSchedule } from "./schedule";
import { EditorialBwVenue } from "./venue";
import { EditorialBwDressCode } from "./dresscode";
import { EditorialBwGallery } from "./gallery";
import { EditorialBwWishes } from "./wishes";
import { EditorialBwChat } from "./chat";
import { EditorialBwRsvp } from "./rsvp";

export const editorialBwTemplate: TemplateDefinition = {
  id: "editorial-bw",
  label: "Editorial Ч-Б",
  ThemeWrapper: EditorialBwThemeWrapper,
  defaultColorTokens: EDITORIAL_BW_DEFAULT_COLORS,
  Cover: EditorialBwCover,
  // Every block here renders its own `TrimDivider` (see decor.tsx) — listing
  // all of them means the scroll direction alternates by each divider's
  // actual on-page position among whichever blocks are currently enabled,
  // not by a hardcoded per-block-type guess (see feedback: "учти, что блок
  // может быть удалён — это должно быть динамически").
  alternatingDividers: [
    "timer",
    "story",
    "schedule",
    "venue",
    "dresscode",
    "gallery",
    "wishes",
    "chat",
    "rsvp",
  ],
  blocks: {
    timer: EditorialBwTimer,
    story: EditorialBwStory,
    schedule: EditorialBwSchedule,
    venue: EditorialBwVenue,
    dresscode: EditorialBwDressCode,
    gallery: EditorialBwGallery,
    wishes: EditorialBwWishes,
    chat: EditorialBwChat,
    rsvp: EditorialBwRsvp,
  },
};
