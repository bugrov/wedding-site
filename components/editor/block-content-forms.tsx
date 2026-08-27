"use client";

import { Plus, Trash2 } from "lucide-react";
import type { CoverContent, BlockContent, BlockFeatures } from "@/lib/blocks";

// Shared by every per-block form below, and (once step 6 builds it) the
// admin editor — same content schemas, same form fields, whichever surface
// is filling them in.
export const fieldClassName =
  "mt-1 min-h-11 w-full rounded-sm border border-black/35 bg-white px-3 py-2 text-sm text-black";

const removeButtonClassName =
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-black/20 text-black/60 hover:bg-black/5";

const addButtonClassName =
  "flex min-h-11 items-center justify-center gap-2 rounded-sm border border-dashed border-black/30 px-4 py-2 text-sm text-black/70 hover:bg-black/5";

export function CoverForm({
  value,
  onChange,
}: {
  value: CoverContent;
  onChange: (next: CoverContent) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Короткая подпись под именами</label>
        <input
          value={value.tagline ?? ""}
          onChange={(e) => onChange({ ...value, tagline: e.target.value })}
          className={fieldClassName}
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Фото на обложке (ссылка)</label>
        <input
          value={value.photoUrl ?? ""}
          onChange={(e) => onChange({ ...value, photoUrl: e.target.value })}
          placeholder="https://..."
          className={fieldClassName}
        />
      </div>
    </div>
  );
}

export function StoryForm({
  value,
  onChange,
}: {
  value: BlockContent<"story">;
  onChange: (next: BlockContent<"story">) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Текст истории</label>
        <textarea
          rows={5}
          value={value.text}
          onChange={(e) => onChange({ ...value, text: e.target.value })}
          className={fieldClassName}
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Фото (ссылка)</label>
        <input
          value={value.photoUrl ?? ""}
          onChange={(e) => onChange({ ...value, photoUrl: e.target.value })}
          placeholder="https://..."
          className={fieldClassName}
        />
      </div>
    </div>
  );
}

export function ScheduleForm({
  value,
  onChange,
}: {
  value: BlockContent<"schedule">;
  onChange: (next: BlockContent<"schedule">) => void;
}) {
  const items = value.items;

  const updateItem = (index: number, patch: Partial<(typeof items)[number]>) => {
    onChange({ items: items.map((item, i) => (i === index ? { ...item, ...patch } : item)) });
  };

  const removeItem = (index: number) => {
    onChange({ items: items.filter((_, i) => i !== index) });
  };

  const addItem = () => {
    onChange({ items: [...items, { time: "", title: "" }] });
  };

  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div key={i} className="space-y-2 rounded-sm border border-black/10 p-3">
          <div className="flex items-start gap-2">
            <div className="w-24 shrink-0">
              <label className="block text-xs font-medium">Время</label>
              <input
                value={item.time}
                onChange={(e) => updateItem(i, { time: e.target.value })}
                className={fieldClassName}
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium">Название</label>
              <input
                value={item.title}
                onChange={(e) => updateItem(i, { title: e.target.value })}
                className={fieldClassName}
              />
            </div>
            <button
              type="button"
              onClick={() => removeItem(i)}
              aria-label="Удалить пункт"
              className={`${removeButtonClassName} mt-5`}
            >
              <Trash2 className="h-4 w-4" aria-hidden />
            </button>
          </div>
          <div>
            <label className="block text-xs font-medium">Описание (необязательно)</label>
            <input
              value={item.description ?? ""}
              onChange={(e) => updateItem(i, { description: e.target.value })}
              className={fieldClassName}
            />
          </div>
        </div>
      ))}
      <button type="button" onClick={addItem} className={`${addButtonClassName} w-full`}>
        <Plus className="h-4 w-4" aria-hidden />
        Добавить пункт
      </button>
    </div>
  );
}

export function VenueForm({
  value,
  onChange,
}: {
  value: BlockContent<"venue">;
  onChange: (next: BlockContent<"venue">) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Адрес</label>
        <input
          value={value.address}
          onChange={(e) => onChange({ ...value, address: e.target.value })}
          className={fieldClassName}
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Ссылка на карту (необязательно)</label>
        <input
          value={value.mapUrl ?? ""}
          onChange={(e) => onChange({ ...value, mapUrl: e.target.value })}
          placeholder="https://..."
          className={fieldClassName}
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Описание площадки (необязательно)</label>
        <textarea
          rows={3}
          value={value.description ?? ""}
          onChange={(e) => onChange({ ...value, description: e.target.value })}
          className={fieldClassName}
        />
      </div>
    </div>
  );
}

export function DressCodeForm({
  value,
  onChange,
}: {
  value: BlockContent<"dresscode">;
  onChange: (next: BlockContent<"dresscode">) => void;
}) {
  const palette = value.palette ?? [];

  const updateColor = (index: number, color: string) => {
    onChange({ ...value, palette: palette.map((c, i) => (i === index ? color : c)) });
  };

  const removeColor = (index: number) => {
    onChange({ ...value, palette: palette.filter((_, i) => i !== index) });
  };

  const addColor = () => {
    if (palette.length >= 8) return;
    onChange({ ...value, palette: [...palette, "#9C6B30"] });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Текст дресс-кода</label>
        <textarea
          rows={3}
          value={value.text}
          onChange={(e) => onChange({ ...value, text: e.target.value })}
          className={fieldClassName}
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Цветовая палитра (необязательно)</label>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {palette.map((color, i) => (
            <div key={i} className="flex items-center gap-1">
              <input
                type="color"
                value={color}
                onChange={(e) => updateColor(i, e.target.value)}
                className="h-9 w-9 cursor-pointer rounded-sm border border-black/20"
                aria-label={`Цвет ${i + 1}`}
              />
              <button
                type="button"
                onClick={() => removeColor(i)}
                aria-label="Удалить цвет"
                className="text-black/50 hover:text-black"
              >
                <Trash2 className="h-4 w-4" aria-hidden />
              </button>
            </div>
          ))}
          {palette.length < 8 && (
            <button
              type="button"
              onClick={addColor}
              aria-label="Добавить цвет"
              className="flex h-9 w-9 items-center justify-center rounded-sm border border-dashed border-black/30 hover:bg-black/5"
            >
              <Plus className="h-4 w-4" aria-hidden />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function GalleryForm({
  value,
  onChange,
}: {
  value: BlockContent<"gallery">;
  onChange: (next: BlockContent<"gallery">) => void;
}) {
  const photos = value.photos;

  const updatePhoto = (index: number, url: string) => {
    onChange({ photos: photos.map((p, i) => (i === index ? url : p)) });
  };

  const removePhoto = (index: number) => {
    onChange({ photos: photos.filter((_, i) => i !== index) });
  };

  const addPhoto = () => {
    if (photos.length >= 20) return;
    onChange({ photos: [...photos, ""] });
  };

  return (
    <div className="space-y-2">
      {photos.map((photo, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            value={photo}
            onChange={(e) => updatePhoto(i, e.target.value)}
            placeholder="https://..."
            className={fieldClassName}
          />
          <button
            type="button"
            onClick={() => removePhoto(i)}
            aria-label="Удалить фото"
            className={removeButtonClassName}
          >
            <Trash2 className="h-4 w-4" aria-hidden />
          </button>
        </div>
      ))}
      <button type="button" onClick={addPhoto} className={`${addButtonClassName} w-full`}>
        <Plus className="h-4 w-4" aria-hidden />
        Добавить фото
      </button>
    </div>
  );
}

export function WishesForm({
  value,
  onChange,
}: {
  value: BlockContent<"wishes">;
  onChange: (next: BlockContent<"wishes">) => void;
}) {
  const items = value.items ?? [];

  const updateItemText = (index: number, text: string) => {
    onChange({ ...value, items: items.map((it, i) => (i === index ? text : it)) });
  };

  const removeItem = (index: number) => {
    onChange({ ...value, items: items.filter((_, i) => i !== index) });
  };

  const addItem = () => {
    if (items.length >= 20) return;
    onChange({ ...value, items: [...items, ""] });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Текст</label>
        <textarea
          rows={3}
          value={value.text}
          onChange={(e) => onChange({ ...value, text: e.target.value })}
          className={fieldClassName}
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Пункты списка (необязательно)</label>
        <div className="mt-2 space-y-2">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                value={item}
                onChange={(e) => updateItemText(i, e.target.value)}
                className={fieldClassName}
              />
              <button
                type="button"
                onClick={() => removeItem(i)}
                aria-label="Удалить пункт"
                className={removeButtonClassName}
              >
                <Trash2 className="h-4 w-4" aria-hidden />
              </button>
            </div>
          ))}
          <button type="button" onClick={addItem} className={`${addButtonClassName} w-full`}>
            <Plus className="h-4 w-4" aria-hidden />
            Добавить пункт
          </button>
        </div>
      </div>
    </div>
  );
}

export function RsvpForm({
  value,
  onChange,
}: {
  value: BlockContent<"rsvp">;
  onChange: (next: BlockContent<"rsvp">) => void;
}) {
  const options: [keyof BlockContent<"rsvp">, string][] = [
    ["askFood", "Спрашивать пожелания по питанию"],
    ["askPlusOne", "Спрашивать про +1"],
    ["askComment", "Спрашивать комментарий"],
  ];

  return (
    <div className="space-y-2">
      {options.map(([key, label]) => (
        <label key={key} className="flex min-h-11 items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={value[key]}
            onChange={(e) => onChange({ ...value, [key]: e.target.checked })}
            className="h-4 w-4 accent-(--color-primary)"
          />
          {label}
        </label>
      ))}
    </div>
  );
}

export function FeaturesForm({
  value,
  onChange,
}: {
  value: BlockFeatures;
  onChange: (next: BlockFeatures) => void;
}) {
  return (
    <div className="space-y-3">
      <label className="flex min-h-11 items-center gap-3 text-sm">
        <input
          type="checkbox"
          checked={value.music}
          onChange={(e) => onChange({ ...value, music: e.target.checked })}
          className="h-4 w-4 accent-(--color-primary)"
        />
        Фоновая музыка
      </label>
      {value.music && (
        <input
          value={value.musicUrl ?? ""}
          onChange={(e) => onChange({ ...value, musicUrl: e.target.value })}
          placeholder="Ссылка на mp3 (необязательно — иначе трек по умолчанию)"
          className={fieldClassName}
        />
      )}
      <label className="flex min-h-11 items-center gap-3 text-sm">
        <input
          type="checkbox"
          checked={value.qrCode}
          onChange={(e) => onChange({ ...value, qrCode: e.target.checked })}
          className="h-4 w-4 accent-(--color-primary)"
        />
        QR-код для печатных приглашений
      </label>
      <label className="flex min-h-11 items-center gap-3 text-sm">
        <input
          type="checkbox"
          checked={value.personalizedLinks}
          onChange={(e) => onChange({ ...value, personalizedLinks: e.target.checked })}
          className="h-4 w-4 accent-(--color-primary)"
        />
        Именные ссылки для гостей
      </label>
    </div>
  );
}
