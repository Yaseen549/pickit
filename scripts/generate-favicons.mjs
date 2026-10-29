import fs from "fs";
import zlib from "zlib";
import path from "path";

// CRC32 implementation
function makeCrcTable() {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) c = 0xedb88320 ^ (c >>> 1);
      else c = c >>> 1;
    }
    table[n] = c;
  }
  return table;
}

const crcTable = makeCrcTable();

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function createPngChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(12 + len);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, "ascii");
  data.copy(chunk, 8);
  const typeAndData = chunk.subarray(4, 8 + len);
  const crcVal = crc32(typeAndData);
  chunk.writeUInt32BE(crcVal, 8 + len);
  return chunk;
}

function encodePng(width, height, rgbaBuffer) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // 8 bits per channel
  ihdrData[9] = 6; // RGBA
  ihdrData[10] = 0; // Deflate
  ihdrData[11] = 0; // Filter
  ihdrData[12] = 0; // Interlace
  const ihdrChunk = createPngChunk("IHDR", ihdrData);

  // Scanlines with filter byte 0
  const scanlineLength = width * 4 + 1;
  const rawScanlines = Buffer.alloc(scanlineLength * height);

  for (let y = 0; y < height; y++) {
    const rawOffset = y * scanlineLength;
    rawScanlines[rawOffset] = 0; // No filter
    rgbaBuffer.copy(
      rawScanlines,
      rawOffset + 1,
      y * width * 4,
      (y + 1) * width * 4
    );
  }

  const compressed = zlib.deflateSync(rawScanlines, { level: 9 });
  const idatChunk = createPngChunk("IDAT", compressed);
  const iendChunk = createPngChunk("IEND", Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function renderPickItLogo(size) {
  const buffer = Buffer.alloc(size * size * 4);
  const cx = (size - 1) / 2;
  const cy = (size - 1) / 2;
  const rCorner = size * 0.25;
  const rWheel = size * 0.35;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;

      // Rounded squircle mask
      const qx = Math.max(0, Math.abs(x - cx) - (size / 2 - rCorner));
      const qy = Math.max(0, Math.abs(y - cy) - (size / 2 - rCorner));
      const distCorner = Math.hypot(qx, qy);

      if (distCorner > rCorner) {
        // Transparent outside squircle
        buffer[idx] = 0;
        buffer[idx + 1] = 0;
        buffer[idx + 2] = 0;
        buffer[idx + 3] = 0;
        continue;
      }

      // Base squircle background: #20201F
      let r = 32;
      let g = 32;
      let b = 31;
      let a = 255;

      const distCenter = Math.hypot(x - cx, y - cy);
      const angle = Math.atan2(y - cy, x - cx);

      // Outer wheel ring
      const ringDist = Math.abs(distCenter - rWheel);
      if (ringDist <= Math.max(0.9, size * 0.04)) {
        const ringAlpha = Math.max(0, 1 - ringDist / (size * 0.04 + 0.5));
        r = Math.round(r * (1 - ringAlpha) + 255 * ringAlpha);
        g = Math.round(g * (1 - ringAlpha) + 255 * ringAlpha);
        b = Math.round(b * (1 - ringAlpha) + 255 * ringAlpha);
      }

      // Spokes (8 spokes)
      if (distCenter < rWheel - 0.5 && distCenter > size * 0.1) {
        const spokeAngles = [0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4, Math.PI, -Math.PI / 4, -Math.PI / 2, -(3 * Math.PI) / 4];
        let minSpokeDist = 999;
        for (const sa of spokeAngles) {
          // Distance from point to line at angle sa through center
          const lineDist = Math.abs(Math.sin(angle - sa) * distCenter);
          if (lineDist < minSpokeDist) minSpokeDist = lineDist;
        }

        const spokeWidth = Math.max(0.65, size * 0.03);
        if (minSpokeDist <= spokeWidth) {
          const spokeAlpha = 0.75 * (1 - minSpokeDist / (spokeWidth + 0.4));
          r = Math.round(r * (1 - spokeAlpha) + 255 * spokeAlpha);
          g = Math.round(g * (1 - spokeAlpha) + 255 * spokeAlpha);
          b = Math.round(b * (1 - spokeAlpha) + 255 * spokeAlpha);
        }
      }

      // 12 o'clock needle pointer (#B7A7D9)
      const pointerBaseY = cy - rWheel - size * 0.08;
      const pointerTipY = cy - rWheel + size * 0.08;
      const pointerHalfW = size * 0.08;

      if (y >= pointerBaseY && y <= pointerTipY) {
        const progress = (y - pointerBaseY) / (pointerTipY - pointerBaseY);
        const wAtY = pointerHalfW * (1 - progress);
        if (Math.abs(x - cx) <= wAtY) {
          // Needle body: #B7A7D9
          r = 183;
          g = 167;
          b = 217;
        }
      }

      // Center Hub
      const hubRadius = size * 0.11;
      if (distCenter <= hubRadius) {
        if (distCenter > hubRadius * 0.55) {
          // Chrome outer ring
          r = 250;
          g = 250;
          b = 248;
        } else if (distCenter > hubRadius * 0.22) {
          // Dark core jewel
          r = 32;
          g = 32;
          b = 31;
        } else {
          // Center white pin
          r = 255;
          g = 255;
          b = 255;
        }
      }

      buffer[idx] = r;
      buffer[idx + 1] = g;
      buffer[idx + 2] = b;
      buffer[idx + 3] = a;
    }
  }

  return buffer;
}

function createIco(images) {
  // images: array of { width, height, pngBuffer }
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // ICO type
  header.writeUInt16LE(images.length, 4); // count

  let offset = 6 + images.length * 16;
  const dirEntries = [];
  const imageBuffers = [];

  for (const img of images) {
    const entry = Buffer.alloc(16);
    entry[0] = img.width >= 256 ? 0 : img.width;
    entry[1] = img.height >= 256 ? 0 : img.height;
    entry[2] = 0; // color count
    entry[3] = 0; // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(img.pngBuffer.length, 8); // size
    entry.writeUInt32LE(offset, 12); // offset

    dirEntries.push(entry);
    imageBuffers.push(img.pngBuffer);
    offset += img.pngBuffer.length;
  }

  return Buffer.concat([header, ...dirEntries, ...imageBuffers]);
}

// Generate sizes
const png16 = encodePng(16, 16, renderPickItLogo(16));
const png32 = encodePng(32, 32, renderPickItLogo(32));
const png48 = encodePng(48, 48, renderPickItLogo(48));
const png180 = encodePng(180, 180, renderPickItLogo(180));

const icoBuffer = createIco([
  { width: 16, height: 16, pngBuffer: png16 },
  { width: 32, height: 32, pngBuffer: png32 },
  { width: 48, height: 48, pngBuffer: png48 },
]);

// Write output files
fs.writeFileSync("public/favicon.ico", icoBuffer);
fs.writeFileSync("src/app/favicon.ico", icoBuffer);
fs.writeFileSync("public/apple-touch-icon.png", png180);
fs.writeFileSync("src/app/apple-icon.png", png180);

console.log("Successfully generated multi-res favicon.ico and apple-touch-icon.png!");
