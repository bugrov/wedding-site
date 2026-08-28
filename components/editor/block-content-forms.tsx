"use client";

import { useState } from "react";
import { Plus, Trash2, ImageOff, ExternalLink } from "lucide-react";
import type { CoverContent, BlockContent, BlockFeatures } from "@/lib/blocks";
import { cn } from "@/lib/utils";

// Shared by every per-block form below, and (once step 6 builds it) the
// admin editor — same content schemas, same form fields, whichever surface
// is filling them in.
export const fieldClassName =
  "mt-1 min-h-11 w-full rounded-sm border border-black/35 bg-white px-3 py-2 text-sm text-black";

const removeButtonClassName =
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-black/20 text-black/60 hover:bg-black/5";

const addButtonClassName =
  "flex min-h-11 items-center justify-center gap-2 rounded-sm border border-dashed border-black/30 px-4 py-2 text-sm text-black/70 hover:bg-black/5";

// A checkbox + label row, shared by every "toggle this option" list in these
// forms (RSVP question toggles, features). items-start + a nudge on the
// checkbox (not items-center) — a long label wraps to 2 lines on narrow
// screens, and items-center then floats the checkbox between the two lines
// instead of next to the first one (see feedback: mobile/tablet elements
// "не ровно по горизонтали расположены").
export function CheckboxField({
  checked,
  onChange,
  className,
  children,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={cn("flex min-h-11 items-start gap-3 py-1 text-sm", className)}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 accent-(--color-primary)"
      />
      {children}
    </label>
  );
}

// A page URL (e.g. unsplash.com/photos/...) looks like a valid link but
// isn't an image file — the browser can't render an HTML page as a photo.
// Rather than just explain that in text (easy to miss/ignore), show an
// actual thumbnail loaded from the pasted URL, so a bad link is visibly
// obvious immediately instead of only showing up later in the full preview.
// Plain <img>, not next/image: this is a lightweight live-feedback probe for
// an arbitrary, not-yet-validated external URL, not a production asset.
function PhotoThumbnail({
  src,
  onLoadStateChange,
  className,
}: {
  src: string;
  onLoadStateChange?: (failed: boolean) => void;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  const setState = (value: boolean) => {
    setFailed(value);
    onLoadStateChange?.(value);
  };

  return (
    <div
      className={cn(
        "flex h-11 w-16 shrink-0 items-center justify-center overflow-hidden rounded-sm border border-black/15 bg-neutral-50",
        className,
      )}
    >
      {failed ? (
        <ImageOff className="h-4 w-4 text-red-500" aria-label="Не удалось загрузить" />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt=""
          className="h-full w-full object-cover"
          onError={() => setState(true)}
          onLoad={() => setState(false)}
        />
      )}
    </div>
  );
}

const photoUrlFailHint =
  "Нужна прямая ссылка на файл — правой кнопкой на фото → «Копировать адрес изображения».";

function PhotoUrlField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div>
      <label className="block text-sm font-medium">{label}</label>
      <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-3">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://..."
          className={`${fieldClassName} mt-0`}
        />
        {value && (
          <PhotoThumbnail
            key={value}
            src={value}
            onLoadStateChange={setFailed}
            className="self-end sm:self-auto"
          />
        )}
      </div>
      {value && failed && <p className="mt-1 text-xs text-red-600">{photoUrlFailHint}</p>}
    </div>
  );
}

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
      <PhotoUrlField
        label="Фото на обложке (ссылка)"
        value={value.photoUrl ?? ""}
        onChange={(photoUrl) => onChange({ ...value, photoUrl })}
      />
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
  // Up to 2 — matches the collage-2 layout this block renders into (see
  // components/templates/tuscany/story.tsx). Both optional: a couple may not
  // want a photo here at all.
  const photos = value.photos ?? [];

  const updatePhoto = (index: number, url: string) => {
    onChange({ ...value, photos: photos.map((p, i) => (i === index ? url : p)) });
  };

  const removePhoto = (index: number) => {
    onChange({ ...value, photos: photos.filter((_, i) => i !== index) });
  };

  const addPhoto = () => {
    if (photos.length >= 2) return;
    onChange({ ...value, photos: [...photos, ""] });
  };

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
        <label className="block text-sm font-medium">Фото (до 2, необязательно)</label>
        <div className="mt-2 space-y-2">
          {photos.map((photo, i) => (
            <PhotoRow
              key={i}
              photo={photo}
              onChange={(url) => updatePhoto(i, url)}
              onRemove={() => removePhoto(i)}
            />
          ))}
          {photos.length < 2 && (
            <button type="button" onClick={addPhoto} className={`${addButtonClassName} w-full`}>
              <Plus className="h-4 w-4" aria-hidden />
              Добавить фото
            </button>
          )}
        </div>
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
          {/* Время/Название side by side left "Название" too narrow to show
              a real title (see feedback) — stacked on mobile, one row from
              sm: up where there's actually room for both. */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
            <div className="w-full sm:w-24 sm:shrink-0">
              <label className="block text-xs font-medium">Время</label>
              <input
                value={item.time}
                onChange={(e) => updateItem(i, { time: e.target.value })}
                className={fieldClassName}
              />
            </div>
            <div className="flex flex-1 items-end gap-2">
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
                className={removeButtonClassName}
              >
                <Trash2 className="h-4 w-4" aria-hidden />
              </button>
            </div>
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
        {/* Stacked on mobile — the link plus "Проверить" side by side left
            barely any room for the URL itself on narrow screens. */}
        <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            value={value.mapUrl ?? ""}
            onChange={(e) => onChange({ ...value, mapUrl: e.target.value })}
            placeholder="https://..."
            className={`${fieldClassName} mt-0`}
          />
          {value.mapUrl && (
            <a
              href={value.mapUrl}
              target="_blank"
              rel="noreferrer"
              className="flex min-h-11 shrink-0 items-center justify-center gap-1.5 rounded-sm border border-black/20 px-3 text-sm hover:bg-black/5"
            >
              <ExternalLink className="h-4 w-4" aria-hidden />
              Проверить
            </a>
          )}
        </div>
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
    if (palette.length >= 10) return;
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
        <div className="mt-2 space-y-2">
          {palette.map((color, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="color"
                value={color}
                onChange={(e) => updateColor(i, e.target.value)}
                className="h-11 w-11 shrink-0 cursor-pointer rounded-sm border border-black/20"
                aria-label={`Цвет ${i + 1}`}
              />
              <input
                value={color}
                onChange={(e) => updateColor(i, e.target.value)}
                className={`${fieldClassName} mt-0 font-mono uppercase`}
              />
              <button
                type="button"
                onClick={() => removeColor(i)}
                aria-label="Удалить цвет"
                className={removeButtonClassName}
              >
                <Trash2 className="h-4 w-4" aria-hidden />
              </button>
            </div>
          ))}
          {palette.length < 10 && (
            <button type="button" onClick={addColor} className={`${addButtonClassName} w-full`}>
              <Plus className="h-4 w-4" aria-hidden />
              Добавить цвет
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function PhotoRow({
  photo,
  onChange,
  onRemove,
}: {
  photo: string;
  onChange: (url: string) => void;
  onRemove: () => void;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div>
      {/* Stacked on mobile, one row from sm: up — input + thumbnail +
          delete side by side left too little room for the URL on narrow
          screens (see feedback: "некоторые инпуты на мобайл ... следовало
          разделять на 2 строки"). */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          value={photo}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://..."
          className={fieldClassName}
        />
        <div className="flex items-center gap-2 self-end sm:mt-1 sm:self-auto">
          {photo && <PhotoThumbnail key={photo} src={photo} onLoadStateChange={setFailed} />}
          <button
            type="button"
            onClick={onRemove}
            aria-label="Удалить фото"
            className={removeButtonClassName}
          >
            <Trash2 className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>
      {photo && failed && <p className="mt-1 text-xs text-red-600">{photoUrlFailHint}</p>}
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
    if (photos.length >= 8) return;
    onChange({ photos: [...photos, ""] });
  };

  return (
    <div className="space-y-2">
      {photos.map((photo, i) => (
        <PhotoRow
          key={i}
          photo={photo}
          onChange={(url) => updatePhoto(i, url)}
          onRemove={() => removePhoto(i)}
        />
      ))}
      {photos.length < 8 && (
        <button type="button" onClick={addPhoto} className={`${addButtonClassName} w-full`}>
          <Plus className="h-4 w-4" aria-hidden />
          Добавить фото
        </button>
      )}
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
  const options: ["askFood" | "askDrink" | "askPlusOne" | "askComment", string][] = [
    ["askFood", "Спрашивать пожелания по питанию"],
    ["askDrink", "Спрашивать пожелания по напиткам"],
    ["askPlusOne", "Спрашивать про пару"],
    ["askComment", "Спрашивать комментарий"],
  ];

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        {options.map(([key, label]) => (
          <CheckboxField
            key={key}
            checked={value[key]}
            onChange={(checked) => onChange({ ...value, [key]: checked })}
          >
            {label}
          </CheckboxField>
        ))}
      </div>
      <div>
        <label className="block text-sm font-medium">Ответить до какой даты (необязательно)</label>
        <input
          type="date"
          value={value.deadline ?? ""}
          onChange={(e) => onChange({ ...value, deadline: e.target.value })}
          className={fieldClassName}
        />
      </div>
    </div>
  );
}

export function ChatForm({
  value,
  onChange,
}: {
  value: BlockContent<"chat">;
  onChange: (next: BlockContent<"chat">) => void;
}) {
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
        <label className="block text-sm font-medium">
          Ссылка на чат (Telegram, WhatsApp и т.д.)
        </label>
        {/* Stacked on mobile — same reasoning as VenueForm's map link row. */}
        <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            value={value.link ?? ""}
            onChange={(e) => onChange({ ...value, link: e.target.value })}
            placeholder="https://..."
            className={`${fieldClassName} mt-0`}
          />
          {value.link && (
            <a
              href={value.link}
              target="_blank"
              rel="noreferrer"
              className="flex min-h-11 shrink-0 items-center justify-center gap-1.5 rounded-sm border border-black/20 px-3 text-sm hover:bg-black/5"
            >
              <ExternalLink className="h-4 w-4" aria-hidden />
              Проверить
            </a>
          )}
        </div>
      </div>
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
      <CheckboxField
        checked={value.music}
        onChange={(checked) => onChange({ ...value, music: checked })}
      >
        Фоновая музыка
      </CheckboxField>
      {value.music && (
        <div>
          <label className="block text-sm font-medium">Ссылка на mp3 или название трека</label>
          <input
            value={value.musicUrl ?? ""}
            onChange={(e) => onChange({ ...value, musicUrl: e.target.value })}
            placeholder="Например: Lana Del Rey — Chemtrails Over The Country Club"
            className={fieldClassName}
          />
        </div>
      )}
      <CheckboxField
        checked={value.qrCode}
        onChange={(checked) => onChange({ ...value, qrCode: checked })}
      >
        QR-код для печатных приглашений
      </CheckboxField>
    </div>
  );
}
