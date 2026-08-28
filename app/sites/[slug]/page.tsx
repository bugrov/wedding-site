import { cache } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { blocksConfigSchema } from "@/lib/blocks";
import { colorTokensSchema, type ColorTokens } from "@/lib/theme/tokens";
import { PageRenderer } from "@/components/page-renderer";
import { SitePaymentWatermark } from "@/components/site-payment-watermark";
import { ProjectStatus } from "@/app/generated/prisma/client";

// cache(): generateMetadata and the page component both need this project —
// Next only dedupes plain fetch() calls automatically, not arbitrary Prisma
// queries, so without this the same row would be fetched twice per request.
const getPublishedProject = cache(async (slug: string) => {
  const project = await prisma.project.findUnique({
    where: { slug },
    include: { theme: true },
  });
  // `publishedAt` (not `status`) gates visibility — a project stays live to
  // guests even if the operator moves status back to "на согласовании" to
  // make edits after launch (see plan).
  if (!project || !project.publishedAt) return null;
  return project;
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublishedProject(slug);
  if (!project) return { title: "Приглашение не найдено" };

  return { title: `Приглашение на свадьбу — ${project.groomName} и ${project.brideName}` };
}

// Rewrite target for `<slug>.<APP_BASE_DOMAIN>` (see proxy.ts) — also
// reachable directly at /sites/<slug>, which is fine: it's the same public
// guest-facing content either way, just not the URL guests are given.
export default async function SitePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const project = await getPublishedProject(slug);
  if (!project) notFound();

  // safeParse, not parse: a stored record that no longer matches the current
  // schema (e.g. after a future schema change) should degrade gracefully for
  // guests, not crash the whole page with a raw error screen.
  const blocksConfigResult = blocksConfigSchema.safeParse(project.blocksConfig);
  if (!blocksConfigResult.success) {
    console.error(
      `Invalid blocksConfig for project ${project.id} (${slug}):`,
      blocksConfigResult.error,
    );
    notFound();
  }
  const blocksConfig = blocksConfigResult.data;

  let colorTokens: ColorTokens | undefined;
  if (project.theme) {
    const themeResult = colorTokensSchema.safeParse(project.theme.colorTokens);
    if (themeResult.success) {
      colorTokens = themeResult.data;
    } else {
      console.error(`Invalid colorTokens for theme ${project.theme.id}:`, themeResult.error);
      // Fall back to the template's default palette rather than failing the page.
    }
  }

  // publishedAt already gates whether guests can reach this page at all —
  // this gates whether what they see is the finished product or a watermarked
  // "pay to unlock" preview of it (see components/site-payment-watermark.tsx).
  const isPaid =
    project.status === ProjectStatus.PAID || project.status === ProjectStatus.PUBLISHED;

  return (
    <>
      {!isPaid && <SitePaymentWatermark />}
      <PageRenderer
        templateId={project.templateId}
        project={{
          id: project.id,
          groomName: project.groomName,
          brideName: project.brideName,
          weddingDate: project.weddingDate,
        }}
        blocksConfig={blocksConfig}
        colorTokens={colorTokens}
        // Same gate as the watermark: an unpaid "preview" site shouldn't
        // actually accept RSVPs, only look presentable enough to evaluate
        // (see feedback — this was the whole point of asking before wiring
        // up a real endpoint). Reuses the exact mechanism that already
        // disables RSVP submission in the lead/admin demo previews.
        previewMode={!isPaid}
      />
    </>
  );
}
