const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '..', 'public', 'images');

const imagesToOptimize = [
  // Desktop images - resize to 1200px width
  {
    input: '2ndCard_ABI_Desktop.png',
    output: '2ndCard_ABI_Desktop.webp',
    width: 1200,
    quality: 85
  },
  {
    input: '3rdCard_CLE_Desktop&Tablet.png',
    output: '3rdCard_CLE_Desktop&Tablet.webp',
    width: 1200,
    quality: 85
  },
  // Tablet images - resize to 900px width
  {
    input: '2ndCard_ABI_Tablet.png',
    output: '2ndCard_ABI_Tablet.webp',
    width: 900,
    quality: 85
  },
  {
    input: '3rdCard_CLE_Desktop&Tablet-1.png',
    output: '3rdCard_CLE_Desktop&Tablet-1.webp',
    width: 900,
    quality: 85
  },
  // Mobile images - resize to 640px width
  {
    input: '2ndCard_ABI_Mobile.png',
    output: '2ndCard_ABI_Mobile.webp',
    width: 640,
    quality: 85
  },
  // Other large images
  {
    input: 'workShopDesign.png',
    output: 'workShopDesign.webp',
    width: 800,
    quality: 80
  }
];

async function optimizeImages() {
  console.log('🚀 Starting image optimization...\n');

  for (const img of imagesToOptimize) {
    const inputPath = path.join(imagesDir, img.input);
    const outputPath = path.join(imagesDir, img.output);

    if (!fs.existsSync(inputPath)) {
      console.log(`⚠️  Skipping ${img.input} - file not found`);
      continue;
    }

    try {
      const inputStats = fs.statSync(inputPath);
      const inputSizeMB = (inputStats.size / 1024 / 1024).toFixed(2);

      await sharp(inputPath)
        .resize(img.width, null, {
          withoutEnlargement: true,
          fit: 'inside'
        })
        .webp({ quality: img.quality, effort: 6 })
        .toFile(outputPath);

      const outputStats = fs.statSync(outputPath);
      const outputSizeKB = (outputStats.size / 1024).toFixed(0);
      const reduction = ((1 - outputStats.size / inputStats.size) * 100).toFixed(1);

      console.log(`✅ ${img.input}`);
      console.log(`   ${inputSizeMB} MB → ${outputSizeKB} KB (${reduction}% reduction)`);
      console.log(`   Output: ${img.output}\n`);

    } catch (error) {
      console.error(`❌ Error processing ${img.input}:`, error.message);
    }
  }

  console.log('✅ Image optimization complete!');
  console.log('\n📝 Next step: Update component imports from .png to .webp');
}

optimizeImages().catch(console.error);
