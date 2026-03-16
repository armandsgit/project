import sharp from 'sharp';

export async function optimizeOutputImage(imageBuffer: Buffer) {
  return sharp(imageBuffer)
    .resize({ width: 2000, withoutEnlargement: true })
    .png({ compressionLevel: 9, quality: 90 })
    .toBuffer();
}
