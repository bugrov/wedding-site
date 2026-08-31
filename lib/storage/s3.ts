import "server-only";
import { randomUUID } from "crypto";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

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

// Content-Type -> file extension. Only image types a wedding photo/gallery
// upload could legitimately be — anything else is rejected before it ever
// reaches S3.
const EXTENSION_BY_CONTENT_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export function isUploadConfigured(): boolean {
  return client !== null && !!bucket && !!publicUrl;
}

export function extensionForContentType(contentType: string): string | null {
  return EXTENSION_BY_CONTENT_TYPE[contentType] ?? null;
}

export async function uploadPhoto(buffer: Buffer, contentType: string): Promise<string> {
  if (!client || !bucket || !publicUrl) throw new Error("Object storage is not configured");

  const extension = extensionForContentType(contentType);
  if (!extension) throw new Error(`Unsupported content type: ${contentType}`);

  const key = `photos/${randomUUID()}.${extension}`;
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
