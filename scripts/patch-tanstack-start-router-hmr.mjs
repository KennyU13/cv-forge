import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const files = [
  join(
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
    "node_modules",
    "@tanstack",
    "start-plugin-core",
    "src",
    "vite",
    "start-router-plugin",
    "plugin.ts",
  ),
];

const replacements = [
  ["addHmr: true", "addHmr: false"],
  ["addHmr: true,", "addHmr: false,"],
];

for (const file of files) {
  let content;
  try {
    content = readFileSync(file, "utf8");
  } catch {
    continue;
  }

  let next = content;
  for (const [from, to] of replacements) {
    next = next.replace(from, to);
  }

  if (next !== content) {
    writeFileSync(file, next);
    console.log(`Patched TanStack Start router HMR in ${file}`);
  }
}
