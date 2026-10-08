import sharp from "sharp";
import { mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const portraitSources = [
  [
    "Architectural Studio Portrait.png",
    "hero-portrait",
    "Crystal Kizor standing in an architectural studio",
    "Hero portrait",
  ],
  [
    "Poised in a Warm Design Studio.png",
    "about-portrait",
    "Crystal Kizor seated at a design studio desk",
    "About portrait",
  ],
  [
    "Earthy Editorial Portrait by African Architecture.png",
    "editorial-portrait",
    "Crystal Kizor seated beside architectural books and natural materials",
    "Personal brand preview",
  ],
  [
    "Cozy Architecture Podcast Workspace.png",
    "speaking-portrait",
    "Crystal Kizor in an architecture podcast workspace",
    "Speaking section",
  ],
  [
    "Architectural Designer in Her Studio.png",
    "research-portrait",
    "Supplied portrait of Crystal Kizor in her studio",
    "Perspectives editorial image",
  ],
  [
    "Confident Designer in Studio Workspace.png",
    "practice-portrait",
    "Supplied portrait of Crystal Kizor at her design workspace",
    "About practice portrait",
  ],
];
const entries = [];
for (const [filename, id, alt, use] of portraitSources)
  entries.push({
    source: path.join("Crystal_s_pictures", filename),
    id,
    alt,
    use,
    folder: "portraits",
  });
for (const [folder, slug] of [
  ["Nature Home", "nature-home"],
  ["Community Centre Project", "community-centre"],
  ["Nature Home 2", "nature-home-2"],
]) {
  const files = (await readdir(path.join("Other_assets", folder)))
    .filter((f) => /\.(png|jpe?g)$/i.test(f))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const clean = file
      .replace(/\.[^.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    entries.push({
      source: path.join("Other_assets", folder, file),
      id: `${slug}-${clean}`,
      alt: `${folder}: supplied project view ${String(i + 1).padStart(2, "0")}`,
      use: `${folder} project gallery`,
      folder: "projects",
      group: slug,
    });
  }
}
const manifest = {};
const inventory = [];
for (const entry of entries) {
  const directory = path.join("public/assets", entry.folder);
  await mkdir(directory, { recursive: true });
  const meta = await sharp(entry.source).metadata();
  const widths = [640, 960, 1440, 2000].filter((w) => w < (meta.width || 640));
  widths.push(Math.min(meta.width || 640, 2000));
  const candidates = [];
  for (const width of [...new Set(widths)]) {
    const filename = `${entry.id}-${width}.webp`;
    await sharp(entry.source)
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: entry.folder === "portraits" ? 84 : 80, effort: 4 })
      .toFile(path.join(directory, filename));
    candidates.push({ src: `/assets/${entry.folder}/${filename}`, width });
  }
  const largest = candidates[candidates.length - 1];
  const defaultImage = candidates.find((c) => c.width >= 960) || largest;
  manifest[entry.id] = {
    src: defaultImage.src,
    srcset: candidates.map((c) => `${c.src} ${c.width}w`).join(", "),
    width: meta.width,
    height: meta.height,
    alt: entry.alt,
    status: "verified",
  };
  inventory.push({
    ...entry,
    ...manifest[entry.id],
    source: entry.source.replaceAll("\\", "/"),
  });
  console.log("Optimized", entry.id);
}
const board = "Other_assets/Crystal Kizor Logo Collection.png";
await mkdir("public/assets/brands", { recursive: true });
const crops = {
  primary: { left: 80, top: 160, width: 835, height: 375 },
  monogram: { left: 1085, top: 80, width: 245, height: 185 },
  horizontal: { left: 1535, top: 140, width: 595, height: 75 },
  signature: { left: 995, top: 430, width: 425, height: 165 },
  social: { left: 1690, top: 385, width: 275, height: 265 },
};
for (const [name, crop] of Object.entries(crops)) {
  const { data, info } = await sharp(board)
    .extract(crop)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  for (const [variant, color] of [
    ["light", [240, 237, 229]],
    ["dark", [21, 23, 20]],
  ]) {
    const pixels = Buffer.alloc(info.width * info.height * 4);
    for (let i = 0; i < info.width * info.height; i++) {
      const lum =
        (data[i * info.channels] +
          data[i * info.channels + 1] +
          data[i * info.channels + 2]) /
        3;
      pixels[i * 4] = color[0];
      pixels[i * 4 + 1] = color[1];
      pixels[i * 4 + 2] = color[2];
      pixels[i * 4 + 3] = Math.max(0, Math.min(255, (200 - lum) * 2.55));
    }
    const filename = `crystal-${name}-${variant}.png`;
    await sharp(pixels, {
      raw: { width: info.width, height: info.height, channels: 4 },
    })
      .png()
      .toFile(`public/assets/brands/${filename}`);
    manifest[`logo-${name}-${variant}`] = {
      src: `/assets/brands/${filename}`,
      srcset: `/assets/brands/${filename} ${info.width}w`,
      width: info.width,
      height: info.height,
      alt: `Crystal Kizor ${name} logo, extracted from the supplied logo collection`,
      status: "verified",
    };
  }
}
await sharp(board)
  .resize({ width: 1440 })
  .webp({ quality: 88 })
  .toFile("public/assets/brands/crystal-logo-collection.webp");
manifest.logoCollection = {
  src: "/assets/brands/crystal-logo-collection.webp",
  srcset: "/assets/brands/crystal-logo-collection.webp 1440w",
  width: 2172,
  height: 724,
  alt: "Supplied Crystal Kizor logo collection showing primary, monogram, horizontal, signature and social marks",
  status: "verified",
};
inventory.push({
  source: board,
  id: "logoCollection",
  use: "Supplied brand identity, header, introduction, signature and footer",
  ...manifest.logoCollection,
});
await sharp("public/assets/brands/crystal-social-light.png")
  .resize(64, 64, { fit: "contain" })
  .flatten({ background: "#151714" })
  .png()
  .toFile("public/favicon.png");
const socialText = Buffer.from(
  '<svg width="1200" height="630"><rect width="650" height="630" fill="#151714"/><path d="M65 150h520M65 505h520" stroke="#a9af96" stroke-opacity=".4"/></svg>',
);
const socialLogo = await sharp("public/assets/brands/crystal-primary-light.png")
  .resize({ width: 530 })
  .toBuffer();
const socialPortrait = await sharp(
  "Crystal_s_pictures/Architectural Studio Portrait.png",
)
  .resize(550, 630, { fit: "cover", position: "attention" })
  .toBuffer();
await sharp({
  create: { width: 1200, height: 630, channels: 3, background: "#151714" },
})
  .composite([
    { input: socialPortrait, left: 650, top: 0 },
    { input: socialText, left: 0, top: 0 },
    { input: socialLogo, left: 60, top: 200 },
  ])
  .jpeg({ quality: 88 })
  .toFile("public/assets/brands/crystal-social.jpg");
await writeFile(
  "src/data/suppliedAssets.json",
  JSON.stringify(manifest, null, 2),
);
await writeFile(
  "src/data/assetInventory.json",
  JSON.stringify(inventory, null, 2),
);
console.log(
  `Complete: ${inventory.length} source images; responsive WebP variants and supplied-logo derivatives.`,
);
