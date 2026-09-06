import { mkdir, readFile, writeFile } from "node:fs/promises";
import { formatProgress, formatSummary } from "../dist/_internal/formatting.js";
import { normalizeSettings } from "../dist/_internal/options.js";
import { format, resolveConfig } from "prettier";

const options = normalizeSettings({ detailedSuccess: true });
const lines = [
    "$ stylelint 'src/**/*.css'",
    "",
    ...[
        "src/base.css",
        "src/components/card.css",
        "src/theme.css",
    ].map((name) => formatProgress(name, options, false)),
    "",
    formatSummary(
        { durationMs: 1250, exitCode: 0, filesObserved: 3 },
        options,
        false
    ),
]
    .join("\n")
    .split("\n");
const escape = (text) =>
    text
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="850" height="370" viewBox="0 0 850 370" role="img" aria-label="Stylelint file progress demonstration"><rect width="850" height="370" rx="14" fill="#111a25"/><circle cx="28" cy="25" r="6" fill="#ff6b6b"/><circle cx="48" cy="25" r="6" fill="#ffd166"/><circle cx="68" cy="25" r="6" fill="#64ded0"/><g fill="#dce6ef" font-family="Consolas,monospace" font-size="17">${lines.map((line, index) => `<text x="26" y="${65 + index * 24}">${escape(line)}</text>`).join("")}</g></svg>\n`;
const file = "docs/docusaurus/static/img/terminal.svg";
const formattedSvg = await format(svg, {
    ...(await resolveConfig(file)),
    filepath: file,
    parser: "html",
});
if (process.argv.includes("--check")) {
    if ((await readFile(file, "utf8")) !== formattedSvg)
        throw new Error("Terminal demo is stale; run npm run docs:demos:write");
} else {
    await mkdir("docs/docusaurus/static/img", { recursive: true });
    await writeFile(file, formattedSvg);
}
