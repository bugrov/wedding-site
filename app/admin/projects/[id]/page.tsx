import { redirect, notFound } from "next/navigation";
import { getAdminSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { blocksConfigSchema, createDefaultBlocksConfig } from "@/lib/blocks";
import { AdminHeader } from "@/components/admin/admin-header";
import { ProjectEditor } from "@/components/admin/project-editor";
import { getSiteUrl, getClientUrl } from "@/lib/site-url";

export default async function AdminProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const adminUser = await getAdminSession();
  if (!adminUser) redirect("/admin/login");

  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) notFound();

  // safeParse, not parse — same reasoning as app/sites/[slug]/page.tsx: a
  // record that no longer matches the current schema shouldn't crash the
  // editor, just fall back to a blank config the operator can refill.
  const blocksConfigResult = blocksConfigSchema.safeParse(project.blocksConfig);
  const blocksConfig = blocksConfigResult.success
    ? blocksConfigResult.data
    : createDefaultBlocksConfig();

  // Computed unconditionally (not gated on publishedAt) — the editor toggles
  // publish client-side without a page reload, so it needs this URL ready to
  // show the moment that happens, not just at the page's initial load.
  const siteUrl = getSiteUrl(project.slug);
  const clientUrl = getClientUrl(project.clientAccessToken);

  return (
    <main className="min-h-screen bg-neutral-50">
      <AdminHeader email={adminUser.email} />
      <ProjectEditor
        project={{
          id: project.id,
          slug: project.slug,
          groomName: project.groomName,
          brideName: project.brideName,
          weddingDate: project.weddingDate.toISOString().slice(0, 10),
          templateId: project.templateId,
          status: project.status,
          publishedAt: project.publishedAt?.toISOString() ?? null,
        }}
        initialBlocksConfig={blocksConfig}
        siteUrl={siteUrl}
        clientUrl={clientUrl}
      />
    </main>
  );
}
