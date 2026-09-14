/**
 * Image Compression & Multi-format Export Utility
 * Supports JPG, JPEG, PNG, WEBP, and PDF with dynamic quality & size calculation.
 */

import { jsPDF } from 'jspdf';

export type ExportFormat = 'jpeg' | 'png' | 'webp' | 'pdf';

export interface CompressionResult {
  blob: Blob;
  sizeBytes: number;
  sizeFormatted: string;
  dataUrl: string;
}

export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Calculates real-time compressed size from canvas.
 */
export async function getCompressedPreview(
  canvas: HTMLCanvasElement,
  format: ExportFormat,
  quality: number = 0.85
): Promise<CompressionResult> {
  const mimeType = format === 'pdf' ? 'image/jpeg' : `image/${format}`;

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          resolve({
            blob: new Blob(),
            sizeBytes: 0,
            sizeFormatted: '0 KB',
            dataUrl: '',
          });
          return;
        }

        const sizeBytes = blob.size;
        const sizeFormatted = formatBytes(sizeBytes);
        const dataUrl = canvas.toDataURL(mimeType, quality);

        resolve({
          blob,
          sizeBytes,
          sizeFormatted,
          dataUrl,
        });
      },
      mimeType,
      quality
    );
  });
}

/**
 * Exports canvas to file download (JPG, PNG, WEBP, or PDF).
 */
export async function downloadImageOrPdf(
  canvas: HTMLCanvasElement,
  format: ExportFormat,
  quality: number = 0.85,
  filename: string = 'lumina-art'
): Promise<void> {
  if (format === 'pdf') {
    // Generate PDF using jsPDF
    const width = canvas.width;
    const height = canvas.height;
    const orientation = width > height ? 'landscape' : 'portrait';

    const doc = new jsPDF({
      orientation,
      unit: 'px',
      format: [width, height],
    });

    const imgData = canvas.toDataURL('image/jpeg', quality);
    doc.addImage(imgData, 'JPEG', 0, 0, width, height);
    doc.save(`${filename}.pdf`);
    return;
  }

  // Regular image formats
  const mimeType = `image/${format}`;
  canvas.toBlob(
    (blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.${format === 'jpeg' ? 'jpg' : format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    mimeType,
    quality
  );
}
