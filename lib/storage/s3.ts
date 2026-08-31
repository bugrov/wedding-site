import "server-only";
import { randomUUID } from "crypto";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

// Selectel Object Storage (S3-compatible). The S3 API endpoint
// (S3_ENDPOINT) is for authenticated PUT/GET via the SDK only — anonymous
// reads of a "public" bucket are served from a separate per-bucket public
// domain (S3_PUBLIC_URL, e.g. https://<uuid>.selstorage.ru) that Selectel
// assigns; requesting a key straight from the API endpoint 403s even on a
// public bucket.
const endpoint = process.env.S3_ENDPOINT;
const region = process.env.S3_REGION;
const bucket = process.env.S3_BUCKET;
const accessKeyId = process.env.S3_ACCESS_KEY_ID;
const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
const publicUrl = process.env.S3_PUBLIC_URL;

const client =
  endpoint && region && accessKeyId && secretAccessKey
    ? new S3Client({ endpoint, region, credentials: { accessKeyId, secretAccessKey } })
    : null;

// Content-Type -> [file extension, storage folder]. Only types a wedding
// site could legitimately need (cover/gallery photos, background music) —
// anything else is rejected before it ever reaches S3.
const FILE_TYPES: Record<string, { extension: string; folder: string }> = {
  "image/jpeg": { extension: "jpg", folder: "photos" },
  "image/png": { extension: "png", folder: "photos" },
  "image/webp": { extension: "webp", folder: "photos" },
  "image/gif": { extension: "gif", folder: "photos" },
  "audio/mpeg": { extension: "mp3", folder: "music" },
  "audio/mp4": { extension: "m4a", folder: "music" },
  "audio/wav": { extension: "wav", folder: "music" },
  "audio/ogg": { extension: "ogg", folder: "music" },
};

export function isUploadConfigured(): boolean {
  return client !== null && !!bucket && !!publicUrl;
}

export function isSupportedContentType(contentType: string): boolean {
  return contentType in FILE_TYPES;
}

export async function uploadFile(buffer: Buffer, contentType: string): Promise<string> {
  if (!client || !bucket || !publicUrl) throw new Error("Object storage is not configured");

  const fileType = FILE_TYPES[contentType];
  if (!fileType) throw new Error(`Unsupported content type: ${contentType}`);

  const key = `${fileType.folder}/${randomUUID()}.${fileType.extension}`;
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      ACL: "public-read",
    }),
  );

  return `${publicUrl.replace(/\/$/, "")}/${key}`;
}

// Extracts the object key from one of our own public URLs — null for
// anything else (a pasted external link, or garbage), so callers can tell
// "not ours to manage" from "ours".
export function keyFromPublicUrl(url: string): string | null {
  if (!publicUrl) return null;
  const prefix = `${publicUrl.replace(/\/$/, "")}/`;
  return url.startsWith(prefix) ? url.slice(prefix.length) : null;
}

// Best-effort: a failed delete shouldn't surface to whoever's replacing a
// photo/track in the editor, it just means a harmless orphan lingers a
// little longer.
export async function deleteFile(url: string): Promise<void> {
  const key = keyFromPublicUrl(url);
  if (!client || !bucket || !key) return;

  try {
    await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
  } catch {
    // swallow — see comment above
  }
}
