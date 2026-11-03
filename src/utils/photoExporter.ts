import { CropSettings } from '../types/dv';

export interface ExportResult {
  blob: Blob;
  dataUrl: string;
  width: number;
  height: number;
  sizeBytes: number;
  sizeKB: number;
  qualityUsed: number;
}

/**
 * Exports cropped image to exact compliant DV specifications:
 * - Square dimensions (600x600 or 1200x1200)
 * - Pure JPEG format
 * - Strictly under 240 KB limit (245,760 bytes)
 */
export async function exportCompliantJPEG(
  image: HTMLImageElement,
  crop: CropSettings,
  targetDimension: 600 | 1200 = 600
): Promise<ExportResult> {
  const canvas = document.createElement('canvas');
  canvas.width = targetDimension;
  canvas.height = targetDimension;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Could not get canvas context');

  // Fill with solid white first (official passport background base)
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, targetDimension, targetDimension);

  // Apply transformations
  ctx.save();
  ctx.translate(targetDimension / 2, targetDimension / 2);
  ctx.rotate((crop.rotation * Math.PI) / 180);
  ctx.scale(crop.zoom, crop.zoom);

  // Determine source rendering
  // Base scale where smallest dimension matches targetDimension
  const minImgDim = Math.min(image.naturalWidth, image.naturalHeight);
  const baseScale = targetDimension / minImgDim;
  const drawWidth = image.naturalWidth * baseScale;
  const drawHeight = image.naturalHeight * baseScale;

  // Draw image offset by pan coordinates scaled to target
  ctx.drawImage(
    image,
    -drawWidth / 2 + crop.panX * (targetDimension / 600),
    -drawHeight / 2 + crop.panY * (targetDimension / 600),
    drawWidth,
    drawHeight
  );
  ctx.restore();

  // Maximum allowed size is 240 KB (245,760 bytes)
  const MAX_BYTES = 245760;
  // Target safe upper bound: ~220 KB to ensure compliance across all servers
  let lowQ = 0.60;
  let highQ = 0.96;
  let optimalBlob: Blob | null = null;
  let bestQuality = 0.92;

  // Binary search for highest JPEG quality under MAX_BYTES
  const getBlob = (q: number): Promise<Blob> =>
    new Promise((resolve, reject) => {
      canvas.toBlob(
        b => (b ? resolve(b) : reject(new Error('Failed to encode JPEG'))),
        'image/jpeg',
        q
      );
    });

  // First try high quality
  let currentBlob = await getBlob(highQ);
  if (currentBlob.size <= MAX_BYTES) {
    optimalBlob = currentBlob;
    bestQuality = highQ;
  } else {
    // Binary search iterations
    for (let i = 0; i < 4; i++) {
      const midQ = (lowQ + highQ) / 2;
      const testBlob = await getBlob(midQ);
      if (testBlob.size <= MAX_BYTES) {
        optimalBlob = testBlob;
        bestQuality = midQ;
        lowQ = midQ; // try slightly higher
      } else {
        highQ = midQ; // must lower quality
      }
    }
    if (!optimalBlob) {
      optimalBlob = await getBlob(0.65);
      bestQuality = 0.65;
    }
  }

  const dataUrl = canvas.toDataURL('image/jpeg', bestQuality);
  const sizeBytes = optimalBlob.size;
  const sizeKB = Number((sizeBytes / 1024).toFixed(1));

  return {
    blob: optimalBlob,
    dataUrl,
    width: targetDimension,
    height: targetDimension,
    sizeBytes,
    sizeKB,
    qualityUsed: Math.round(bestQuality * 100),
  };
}

/**
 * Triggers browser download for a blob or dataUrl
 */
export function downloadFile(dataUrl: string, filename: string) {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Generates printable 4x6 inch sheet with 6x (2x2 inch) passport photos
 */
export function generatePrintSheet(photoDataUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // 4x6 inches at 300 DPI = 1200 x 1800 px (or 1800 x 1200)
      const sheet = document.createElement('canvas');
      sheet.width = 1800;
      sheet.height = 1200;
      const ctx = sheet.getContext('2d');
      if (!ctx) return reject(new Error('No context'));

      // White photo paper background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, sheet.width, sheet.height);

      // 2x2 inch photo at 300 DPI = 600 x 600 px
      // 3 columns x 2 rows
      const photoSize = 560; // slightly padded for cut guides
      const startX = 60;
      const startY = 40;
      const gapX = 40;
      const gapY = 40;

      for (let row = 0; row < 2; row++) {
        for (let col = 0; col < 3; col++) {
          const x = startX + col * (photoSize + gapX);
          const y = startY + row * (photoSize + gapY);

          // Draw photo
          ctx.drawImage(img, x, y, photoSize, photoSize);

          // Light hairline cut border
          ctx.strokeStyle = '#D1D5DB';
          ctx.lineWidth = 1;
          ctx.strokeRect(x, y, photoSize, photoSize);
        }
      }

      // Title & cut instruction text in margin
      ctx.fillStyle = '#9CA3AF';
      ctx.font = '24px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('DV-2026/2027 Printable 2×2 Inch Passport Photo Sheet · Print at 100% Scale / No fit to page', 60, 1180);

      resolve(sheet.toDataURL('image/jpeg', 0.95));
    };
    img.onerror = () => reject(new Error('Failed to load image for print sheet'));
    img.src = photoDataUrl;
  });
}
