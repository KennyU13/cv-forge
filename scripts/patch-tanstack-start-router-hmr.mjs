import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const targets = [
  join(
    process.cwd(),
    "node_modules",
    "@tanstack",
    "start-plugin-core",
    "dist",
    "esm",
    "vite",
    "start-router-plugin",
    "plugin.js",
  ),
  join(
    process.cwd(),
    "node_modules",
    "@tanstack",
    "start-plugin-core",
    "src",
    "vite",
    "start-router-plugin",
    "plugin.ts",
  ),
];

let patched = 0;

for (const file of targets) {
  if (!existsSync(file)) continue;

  const source = readFileSync(file, "utf8");
  const next = source.replaceAll("addHmr: true", "addHmr: false");

  if (next !== source) {
    writeFileSync(file, next);
    patched += 1;
    console.log(`Patched TanStack router HMR: ${file}`);
  }
}

if (patched === 0) {
  console.log("TanStack router HMR patch already applied or target files not found.");
}
