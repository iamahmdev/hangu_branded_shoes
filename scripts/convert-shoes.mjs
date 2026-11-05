import fs from "fs";
import path from "path";
import convert from "heic-convert";
import sharp from "sharp";

const SOURCE_DIR = "C:/Users/Ahmad/Documents/All shoes";
const TARGET_DIR = path.resolve(process.cwd(), "public/images/shoes");

async function main() {
  if (!fs.existsSync(TARGET_DIR)) {
    fs.mkdirSync(TARGET_DIR, { recursive: true });
  }

  const files = fs
    .readdirSync(SOURCE_DIR)
    .filter((f) => f.toLowerCase().endsWith(".heic"))
    .sort();

  console.log(`🚀 Found ${files.length} HEIC files to convert...`);
  const startTime = Date.now();

  for (let i = 0; i < files.length; i++) {
    const filename = files[i];
    const baseName = path.parse(filename).name;
    const outFilename = `${baseName}.jpg`;
    const outPath = path.join(TARGET_DIR, outFilename);

    try {
      const srcPath = path.join(SOURCE_DIR, filename);
      const inputBuffer = fs.readFileSync(srcPath);

      // Convert HEIC to JPEG buffer
      const rawJpg = await convert({
        buffer: inputBuffer,
        format: "JPEG",
        quality: 0.9,
      });

      // Optimize and auto-rotate with Sharp
      await sharp(rawJpg)
        .rotate()
        .resize(1200, 1200, { fit: "inside", withoutEnlargement: true })
        .jpeg({ quality: 82, progressive: true })
        .toFile(outPath);

      const stats = fs.statSync(outPath);
      const sizeKb = Math.round(stats.size / 1024);
      console.log(`[${i + 1}/${files.length}] Converted ${filename} -> ${outFilename} (${sizeKb} KB)`);
    } catch (err) {
      console.error(`❌ Error converting ${filename}:`, err);
    }
  }

  const totalSecs = Math.round((Date.now() - startTime) / 1000);
  console.log(`\n🎉 All ${files.length} images converted successfully in ${totalSecs}s!`);
}

main().catch(console.error);
