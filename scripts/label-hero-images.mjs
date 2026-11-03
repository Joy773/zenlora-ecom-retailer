import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const hero = path.join(root, "public", "hero");

function labelSvg({
  width,
  height,
  lines,
  background,
  backgroundOpacity = 1,
  shadowOpacity = 0.16,
  color,
  fontFamily,
  sizes,
}) {
  const lineHeight = 1.3;
  const total = sizes.reduce((sum, size) => sum + size * lineHeight, 0);
  let y = (height - total) / 2;
  const text = lines
    .map((line, index) => {
      const size = sizes[index];
      y += size * 0.9;
      const node = `<text x="50%" y="${y}" text-anchor="middle" font-family="${fontFamily}" font-size="${size}" font-weight="${index === 0 ? "700" : "500"}" letter-spacing="0.3" fill="${color}">${line}</text>`;
      y += size * (lineHeight - 0.9);
      return node;
    })
    .join("");

  const radius = Math.round(width * 0.08);
  const panel =
    background === "transparent"
      ? ""
      : `<rect x="2" y="3" width="${width - 4}" height="${height - 4}" rx="${radius}" fill="#000000" opacity="${shadowOpacity}"/>
         <rect x="0" y="0" width="${width - 4}" height="${height - 4}" rx="${radius}" fill="${background}" fill-opacity="${backgroundOpacity}" stroke="#00000022" stroke-width="0.75"/>`;

  return Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  ${panel}
  ${text}
</svg>`);
}

async function sticker({ rotate = 0, ...options }) {
  const png = await sharp(labelSvg(options)).png().toBuffer();
  if (!rotate) return png;
  return sharp(png)
    .rotate(rotate, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
}

async function apply(inputName, outputName, overlays) {
  const composites = [];
  for (const overlay of overlays) {
    const input = await sticker(overlay);
    composites.push({ input, left: overlay.left, top: overlay.top });
  }

  await sharp(path.join(hero, inputName))
    .composite(composites)
    .jpeg({ quality: 92 })
    .toFile(path.join(hero, outputName));
}

const joseon = {
  background: "#efe4cf",
  color: "#2c1d12",
  lines: ["Beauty of", "Joseon", "Relief Sun"],
  sizes: [13, 13, 11],
  fontFamily: "Georgia, Times New Roman, serif",
};

// The Ordinary bottles already have blank white labels, so print text directly.
const ordinary = {
  background: "transparent",
  color: "#111111",
  lines: ["The Ordinary", "Niacinamide", "10% + Zinc 1%"],
  sizes: [10, 8, 8],
  fontFamily: "Helvetica, Arial, sans-serif",
};

// Centered on each tube body.
await apply("beauty-of-joseon.jpg", "beauty-of-joseon-labeled.jpg", [
  { ...joseon, left: 468, top: 206, width: 98, height: 120 },
  { ...joseon, left: 648, top: 286, width: 90, height: 114, rotate: 17 },
  { ...joseon, left: 936, top: 188, width: 98, height: 120 },
]);

// Printed onto the existing blank white labels.
await apply("the-ordinary.jpg", "the-ordinary-labeled.jpg", [
  {
    ...ordinary,
    left: 235,
    top: 398,
    width: 92,
    height: 42,
    rotate: -28,
    lines: ["The Ordinary", "Niacinamide 10%"],
    sizes: [8, 7],
  },
  { ...ordinary, left: 384, top: 394, width: 108, height: 52, sizes: [11, 8, 8] },
  { ...ordinary, left: 546, top: 419, width: 108, height: 52, sizes: [11, 8, 8] },
  {
    ...ordinary,
    left: 739,
    top: 414,
    width: 66,
    height: 42,
    lines: ["The Ordinary", "Niacinamide"],
    sizes: [8, 6],
  },
  { ...ordinary, left: 973, top: 375, width: 92, height: 46, sizes: [9, 7, 7] },
]);

console.log("Labeled hero images written.");
