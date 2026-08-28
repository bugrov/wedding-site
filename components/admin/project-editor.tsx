"use client";

import { useMemo, useState, type CSSProperties } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  DEFAULT_BLOCK_ORDER,
  DEFAULT_BLOCK_CONTENT,
  type BlockType,
  type BlockContent,
  type CoverContent,
  type BlockFeatures,
  type BlocksConfig,
} from "@/lib/blocks";
import { PageRenderer } from "@/components/page-renderer";
import { BlockSettingsDrawer } from "@/components/landing/block-settings-drawer";
import type { ProjectStatus } from "@/app/generated/prisma/client";

const STATUS_OPTIONS: [ProjectStatus, string][] = [
  ["IN_PROGRESS", "В работе"],
  ["IN_REVIEW", "На согласовании"],
  ["PAID", "Оплачено"],
  ["PUBLISHED", "Опубликован"],
  ["CANCELLED", "Отменено"],
];

type ProjectEditorProps = {
  project: {
    id: string;
    slug: string;
    groomName: string;
    brideName: string;
    weddingDate: string;
    templateId: string;
    status: ProjectStatus;
    publishedAt: string | null;
  };
  initialBlocksConfig: BlocksConfig;
  siteUrl: string;
  clientUrl: string;
};

type MainFieldErrors = { groomName?: string; brideName?: string; weddingDate?: string };

// The same "настройщик блоков" the public configurator uses (see
// components/landing/block-settings-drawer.tsx) — same per-block forms, same
// live-preview-updates-immediately behavior, just wired to a real Project row
// instead of a draft lead. Reusing it keeps content editing identical between
// "lead fills in a rough draft" and "operator finishes the real site" instead
// of maintaining two separate editors for the same schema.
export function ProjectEditor({
  project,
  initialBlocksConfig,
  siteUrl,
  clientUrl,
}: ProjectEditorProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [groomName, setGroomName] = useState(project.groomName);
  const [brideName, setBrideName] = useState(project.brideName);
  const [weddingDate, setWeddingDate] = useState(project.weddingDate);
  const [templateId, setTemplateId] = useState(project.templateId);
  const [status, setStatus] = useState<ProjectStatus>(project.status);
  const [publishedAt, setPublishedAt] = useState(project.publishedAt);
  const [enabledBlocks, setEnabledBlocks] = useState<BlockType[]>(
    initialBlocksConfig.enabledBlocks,
  );
  const [coverContent, setCoverContent] = useState<CoverContent>(initialBlocksConfig.cover);
  const [content, setContent] = useState<{ [K in BlockType]: BlockContent<K> }>(
    () =>
      ({ ...DEFAULT_BLOCK_CONTENT, ...initialBlocksConfig.content }) as {
        [K in BlockType]: BlockContent<K>;
      },
  );
  const [features, setFeatures] = useState<BlockFeatures>(initialBlocksConfig.features);
  const [mainFieldErrors, setMainFieldErrors] = useState<MainFieldErrors>({});
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const blocksConfig: BlocksConfig = useMemo(() => {
    const order = DEFAULT_BLOCK_ORDER.filter((b) => enabledBlocks.includes(b));
    const filteredContent = Object.fromEntries(
      order.map((type) => [type, content[type]]),
    ) as BlocksConfig["content"];
    return { enabledBlocks, order, cover: coverContent, content: filteredContent, features };
  }, [enabledBlocks, coverContent, content, features]);

  const parsedWeddingDate = new Date(weddingDate);
  const previewProject = useMemo(
    () => ({
      groomName: groomName.trim() || project.groomName,
      brideName: brideName.trim() || project.brideName,
      weddingDate: Number.isNaN(parsedWeddingDate.getTime())
        ? new Date(project.weddingDate)
        : parsedWeddingDate,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [groomName, brideName, weddingDate],
  );

  const toggleBlock = (type: BlockType) => {
    setEnabledBlocks((current) =>
      current.includes(type) ? current.filter((b) => b !== type) : [...current, type],
    );
  };

  const updateContent = <K extends BlockType>(type: K, next: BlockContent<K>) => {
    setContent((current) => ({ ...current, [type]: next }));
  };

  const validateMainFields = (): MainFieldErrors => {
    const nextErrors: MainFieldErrors = {};
    if (!groomName.trim()) nextErrors.groomName = "Введите имя жениха";
    if (!brideName.trim()) nextErrors.brideName = "Введите имя невесты";
    if (!weddingDate || Number.isNaN(new Date(weddingDate).getTime())) {
      nextErrors.weddingDate = "Укажите дату свадьбы";
    }
    return nextErrors;
  };

  const save = async (): Promise<boolean> => {
    const nextMainErrors = validateMainFields();
    if (Object.keys(nextMainErrors).length > 0) {
      setMainFieldErrors(nextMainErrors);
      setDrawerOpen(true);
      toast.error("Заполните имена и дату свадьбы в настройках сайта");
      return false;
    }
    setMainFieldErrors({});

    const res = await fetch(`/api/admin/projects/${project.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ groomName, brideName, weddingDate, templateId, status, blocksConfig }),
    });

    if (!res.ok) {
      toast.error("Не удалось сохранить изменения");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (await save()) toast.success("Сохранено");
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublish = async () => {
    setPublishing(true);
    try {
      // Publish always saves the current draft first — otherwise "publish"
      // could silently go live with stale content from the last save.
      if (!(await save())) return;

      const res = await fetch(`/api/admin/projects/${project.id}/publish`, { method: "POST" });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        toast.error("Не удалось изменить публикацию");
        return;
      }
      setPublishedAt(data.publishedAt);
      toast.success(data.publishedAt ? "Сайт опубликован" : "Публикация снята");
    } finally {
      setPublishing(false);
    }
  };

  return (
    // BlockSettingsDrawer's own trigger button and controls read
    // --color-primary/--color-background as ambient CSS vars — normally set
    // by whichever ThemeWrapper surrounds it (LandingThemeWrapper on the
    // public configurator, a template's own ThemeWrapper inside
    // PageRenderer). Nothing wraps the admin editor's own chrome in either,
    // so those vars were undefined here — the trigger button rendered with
    // no background/text color at all (invisible on the light admin
    // background). Neutral admin-only values, independent of whichever
    // template's ThemeWrapper renders further down inside PageRenderer.
    <div style={{ "--color-primary": "#171717", "--color-background": "#ffffff" } as CSSProperties}>
      <div className="border-b border-neutral-200 bg-white px-8 py-4">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              href="/admin/projects"
              className="text-xs font-medium text-neutral-500 hover:text-neutral-800"
            >
              ← Все проекты
            </Link>
            <h1 className="text-lg font-semibold text-neutral-900">
              {project.groomName} и {project.brideName}
            </h1>
            <p className="text-sm text-neutral-500">
              /{project.slug}
              {publishedAt && (
                <>
                  {" · "}
                  <a
                    href={siteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="underline underline-offset-4"
                  >
                    Открыть сайт
                  </a>
                  {" · "}
                  {/* Sent to the couple once, per plan — the operator copies
                      it from here each time (no "forgot password" flow: the
                      link itself is the credential). */}
                  <a
                    href={clientUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="underline underline-offset-4"
                  >
                    Кабинет клиента
                  </a>
                </>
              )}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ProjectStatus)}
              className="min-h-11 cursor-pointer rounded-md border border-neutral-300 bg-white px-3 text-sm"
            >
              {STATUS_OPTIONS.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || publishing}
              className="cursor-pointer rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 disabled:opacity-50"
            >
              {saving ? "Сохраняем…" : "Сохранить"}
            </button>
            <button
              type="button"
              onClick={handleTogglePublish}
              disabled={saving || publishing}
              className="cursor-pointer rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
            >
              {publishing ? "…" : publishedAt ? "Снять с публикации" : "Опубликовать"}
            </button>
          </div>
        </div>
      </div>

      <BlockSettingsDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        enabledBlocks={enabledBlocks}
        onToggleBlock={toggleBlock}
        templateId={templateId}
        onTemplateChange={setTemplateId}
        coverContent={coverContent}
        onCoverChange={setCoverContent}
        content={content}
        onContentChange={updateContent}
        features={features}
        onFeaturesChange={setFeatures}
        groomName={groomName}
        onGroomNameChange={setGroomName}
        brideName={brideName}
        onBrideNameChange={setBrideName}
        weddingDate={weddingDate}
        onWeddingDateChange={setWeddingDate}
        mainFieldErrors={mainFieldErrors}
      />

      <div className="border-y border-black/10">
        <PageRenderer
          templateId={templateId}
          project={previewProject}
          blocksConfig={blocksConfig}
          previewMode
        />
      </div>
    </div>
  );
}
