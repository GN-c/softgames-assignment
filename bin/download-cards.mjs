#!/usr/bin/env node
import { mkdir, rm } from "fs/promises";
import { join } from "path";
import { pipeline } from "stream/promises";
import { createWriteStream } from "fs";

/**
 * Use This script through npm run download-cards to download random cards for ace of shadows
 */

/**
 * Receive Count(number of images to download) and output directory as args
 */
const count = parseInt(process.argv[2], 10);
const outDir = process.argv[3];

if (!count || count < 1 || !outDir) {
  console.error("count or outDir isn't valid");
  process.exit(1);
}

/**
 * Download content from url and save to path
 */
async function download(url, path) {
  console.log(`⌛ Downloading ${url} to ${path}`);

  const res = await fetch(url);
  if (!res.ok || !res.body) throw new Error(`Fail ${url}`);
  await pipeline(res.body, createWriteStream(path));
}

await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });

const CONCURRENCY = 5;
for (let i = 0; i < count; i += CONCURRENCY)
  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, count - i) }, async (_, n) => {
      const id = i + n;
      await download(
        `https://api.dicebear.com/9.x/fun-emoji/png?seed=${id}`,
        join(outDir, `${id}.png`),
      );
    }),
  );
