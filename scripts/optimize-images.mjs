import sharp from 'sharp';
import { mkdir } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcDir = join(__dirname, '../src/assets/images');

async function optimizeProfileImage() {
  const inputPath = join(srcDir, 'Kiarash_Adl_Linkedin_Image.jpg');
  
  // Create responsive sizes for the profile image
  // Displayed sizes: 192x192 (mobile), 224x224 (desktop)
  // With 2x DPR: 384x384, 448x448
  const sizes = [
    { width: 192, suffix: '-192w' },
    { width: 224, suffix: '-224w' },
    { width: 384, suffix: '-384w' },  // 2x for 192
    { width: 448, suffix: '-448w' },  // 2x for 224
  ];

  console.log('Optimizing profile image...\n');

  for (const size of sizes) {
    // Generate WebP (best compression)
    const webpOutput = join(srcDir, `profile${size.suffix}.webp`);
    await sharp(inputPath)
      .resize(size.width, size.width, { fit: 'cover' })
      .webp({ quality: 85 })
      .toFile(webpOutput);
    
    const webpStats = await sharp(webpOutput).metadata();
    console.log(`Created: profile${size.suffix}.webp (${size.width}x${size.width})`);

    // Generate JPEG fallback
    const jpgOutput = join(srcDir, `profile${size.suffix}.jpg`);
    await sharp(inputPath)
      .resize(size.width, size.width, { fit: 'cover' })
      .jpeg({ quality: 85, progressive: true })
      .toFile(jpgOutput);
    
    console.log(`Created: profile${size.suffix}.jpg (${size.width}x${size.width})`);
  }

  // Also create an AVIF version for browsers that support it (even better compression)
  const avifOutput = join(srcDir, 'profile-384w.avif');
  await sharp(inputPath)
    .resize(384, 384, { fit: 'cover' })
    .avif({ quality: 80 })
    .toFile(avifOutput);
  console.log(`Created: profile-384w.avif (384x384)`);

  console.log('\n✅ Image optimization complete!');
  
  // Show file size comparison
  const { size: originalSize } = await sharp(inputPath).metadata().then(() => 
    import('fs').then(fs => fs.promises.stat(inputPath))
  );
  
  const fs = await import('fs');
  const webp384Size = (await fs.promises.stat(join(srcDir, 'profile-384w.webp'))).size;
  const jpg384Size = (await fs.promises.stat(join(srcDir, 'profile-384w.jpg'))).size;
  const avif384Size = (await fs.promises.stat(join(srcDir, 'profile-384w.avif'))).size;
  
  console.log('\nFile size comparison (384x384 - 2x retina):');
  console.log(`  Original (601x601): ${(originalSize / 1024).toFixed(1)} KB`);
  console.log(`  JPEG:               ${(jpg384Size / 1024).toFixed(1)} KB (${Math.round((1 - jpg384Size/originalSize) * 100)}% smaller)`);
  console.log(`  WebP:               ${(webp384Size / 1024).toFixed(1)} KB (${Math.round((1 - webp384Size/originalSize) * 100)}% smaller)`);
  console.log(`  AVIF:               ${(avif384Size / 1024).toFixed(1)} KB (${Math.round((1 - avif384Size/originalSize) * 100)}% smaller)`);
}

optimizeProfileImage().catch(console.error);
