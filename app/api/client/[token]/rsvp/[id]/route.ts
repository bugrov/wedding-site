import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// The only mutation a client can make in their own dashboard (see plan:
// "клиент может сам удалить дубль" — cleaning up a duplicate RSVP, not
// editing site content). No session/cookie here — the token in the URL
// *is* the credential, so every request re-derives the project from it and
// only deletes a response that actually belongs to that project, never
// trusting the id alone (a client's token must not delete another
// project's response just because they guessed/were given its id).
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ token: string; id: string }> },
) {
  const { token, id } = await params;

  const project = await prisma.project.findUnique({
    where: { clientAccessToken: token },
    select: { id: true },
  });
  if (!project) return NextResponse.json({ error: "Не найдено" }, { status: 404 });

  const response = await prisma.rsvpResponse.findUnique({
    where: { id },
    select: { projectId: true },
  });
  if (!response || response.projectId !== project.id) {
    return NextResponse.json({ error: "Не найдено" }, { status: 404 });
  }

  await prisma.rsvpResponse.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
