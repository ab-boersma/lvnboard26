import { existsSync, readFileSync } from "node:fs";
import { dirname, join, normalize } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const pages = ["public/index.html", "public/deck.html"];
const errors = [];

for (const relativePage of pages) {
  const pagePath = join(root, relativePage);
  if (!existsSync(pagePath)) {
    errors.push(`Missing ${relativePage}`);
    continue;
  }

  const html = readFileSync(pagePath, "utf8");
  if (!/^<!doctype html>/i.test(html)) errors.push(`${relativePage} is missing a doctype`);
  if (!/<meta name="viewport"/i.test(html)) errors.push(`${relativePage} is missing a viewport declaration`);
  if (/file:\/\//i.test(html)) errors.push(`${relativePage} contains a local file URL`);
  if (!/<script>[\s\S]*<\/script>/i.test(html)) errors.push(`${relativePage} is missing its interactive script`);

  const references = [...html.matchAll(/(?:src|href)="([^"#?]+)(?:[?#][^"]*)?"/g)]
    .map((match) => match[1])
    .filter((value) => !/^(?:https?:|mailto:|tel:|data:|javascript:)/i.test(value));

  for (const reference of references) {
    const resolved = normalize(join(dirname(pagePath), reference));
    if (!existsSync(resolved)) errors.push(`${relativePage} references missing file: ${reference}`);
  }
}

const site = readFileSync(join(root, "public/index.html"), "utf8");
for (const required of [
  "data-filter=\"governance\"",
  "data-lane=\"volunteer\"",
  "data-cadence=\"board\"",
  "data-phase=\"2027\"",
  "data-edit-key=\"decision-architecture-owner\"",
  "localStorage.setItem"
]) {
  if (!site.includes(required)) errors.push(`Interactive site is missing: ${required}`);
}

const deck = readFileSync(join(root, "public/deck.html"), "utf8");
if (!deck.includes('id="slide-24"')) errors.push("Presentation is missing the linked decision slide");

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log("Validated the interactive site, presentation, links, and local assets.");
