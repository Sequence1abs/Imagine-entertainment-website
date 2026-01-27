import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getCloudflareImageUrl } from './config';

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const IMAGES_API_TOKEN = process.env.CLOUDFLARE_IMAGES_API_TOKEN;
const ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const BUCKET_NAME = process.env.R2_BUCKET_NAME;
const PUBLIC_DEV_URL = process.env.NEXT_PUBLIC_R2_DEV_URL;

const R2 = new S3Client({
  region: 'auto',
  endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: ACCESS_KEY_ID || '',
    secretAccessKey: SECRET_ACCESS_KEY || '',
  },
});

export interface CloudflareUploadResult {
  url: string;
  key: string;
  imageId?: string; // Cloudflare Images ID
  width?: number;
  height?: number;
}

export interface CloudflareImagesUploadResult {
  success: boolean;
  result: {
    id: string;
    filename: string;
    uploaded: string;
    requireSignedURLs: boolean;
    variants: string[];
  };
}

/**
 * Upload image to Cloudflare Images (primary) with R2 fallback
 * @param file - The file to upload
 * @param prefix - Prefix for the image ID (e.g., 'event_', 'gallery_')
 * @param folder - Optional folder name for organization
 * @returns Upload result with Cloudflare Images URL or R2 fallback URL
 */
export async function uploadToCloudflareImages(
  file: File | Blob,
  prefix: string = '',
  folder?: string
): Promise<CloudflareUploadResult> {
  // Sanitize filename
  const sanitizedName = (file instanceof File ? file.name : 'image')
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .toLowerCase();
  
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 15);
  
  // Build custom ID: prefix + folder (if provided) + timestamp + random + sanitized name
  let customId = prefix;
  if (folder) {
    customId += `${folder.replace(/[^a-zA-Z0-9]/g, '_')}_`;
  }
  customId += `${timestamp}_${randomId}_${sanitizedName}`;
  
  // Remove extension from custom ID (Cloudflare Images handles it)
  customId = customId.replace(/\.[^.]+$/, '');

  // Try Cloudflare Images first
  if (ACCOUNT_ID && IMAGES_API_TOKEN) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('id', customId);

      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/images/v1`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${IMAGES_API_TOKEN}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        const data: { success: boolean; result: CloudflareImagesUploadResult['result']; errors?: any[] } = await response.json();
        
        if (data.success && data.result) {
          // Get image details to extract dimensions
          const imageId = data.result.id;
          const imageUrl = getCloudflareImageUrl(imageId);

          // Try to get image details for dimensions
          let width = 0;
          let height = 0;
          try {
            const detailsResponse = await fetch(
              `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/images/v1/${imageId}`,
              {
                headers: {
                  'Authorization': `Bearer ${IMAGES_API_TOKEN}`,
                },
              }
            );
            if (detailsResponse.ok) {
              const details = await detailsResponse.json();
              if (details.success && details.result) {
                width = details.result.dimensions?.width || 0;
                height = details.result.dimensions?.height || 0;
              }
            }
          } catch (error) {
            console.warn('Could not fetch image dimensions:', error);
          }

          return {
            url: imageUrl,
            key: imageId,
            imageId: imageId,
            width,
            height,
          };
        } else {
          console.warn('Cloudflare Images upload failed:', data.errors);
          throw new Error(data.errors?.[0]?.message || 'Cloudflare Images upload failed');
        }
      } else {
        const errorText = await response.text();
        console.warn('Cloudflare Images API error:', response.status, errorText);
        throw new Error(`Cloudflare Images API error: ${response.status}`);
      }
    } catch (error) {
      console.error('Cloudflare Images upload error, falling back to R2:', error);
      // Fall through to R2 fallback
    }
  }

  // Fallback to R2
  if (!BUCKET_NAME || !PUBLIC_DEV_URL) {
    throw new Error('Both Cloudflare Images and R2 configuration are missing');
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const contentType = file instanceof File ? file.type : 'image/jpeg';
  
  // Use the same custom ID structure for R2 key
  const r2Key = folder 
    ? `${folder}/${customId}.${sanitizedName.split('.').pop() || 'jpg'}`
    : `${customId}.${sanitizedName.split('.').pop() || 'jpg'}`;

  await R2.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: r2Key,
      Body: buffer,
      ContentType: contentType,
    })
  );

  return {
    url: `${PUBLIC_DEV_URL}/${r2Key}`,
    key: r2Key,
  };
}

/**
 * Upload to R2 only (for fallback or video files)
 */
export async function uploadToR2(
  file: File | Blob,
  key: string,
  contentType: string
): Promise<CloudflareUploadResult> {
  if (!BUCKET_NAME || !PUBLIC_DEV_URL) {
    throw new Error('R2 configuration missing');
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  await R2.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  );

  return {
    url: `${PUBLIC_DEV_URL}/${key}`,
    key,
  };
}

export async function getR2PresignedUrl(key: string, contentType: string) {
  if (!BUCKET_NAME) {
    throw new Error('R2 configuration missing');
  }

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  return await getSignedUrl(R2, command, { expiresIn: 3600 });
}
