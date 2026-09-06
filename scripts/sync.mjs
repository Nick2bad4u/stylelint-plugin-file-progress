import { readFile, writeFile, mkdir } from "node:fs/promises";
import { configs, configNames, meta } from "../dist/plugin.js";
import { defaultSettings } from "../dist/_internal/options.js";
import { format, resolveConfig } from "prettier";

const write = process.argv.includes("--write");
async function sync(file, expected) {
    expected = await format(expected, {
        ...(await resolveConfig(file)),
        filepath: file,
    });
    const actual = await readFile(file, "utf8").catch(() => "");
    if (actual === expected) return;
    if (!write)
        throw new Error(`${file} is stale; run npm run sync:rules:write`);
    await writeFile(file, expected);
}
const manifest = JSON.parse(await readFile("package.json", "utf8"));
if (meta.version !== manifest.version)
    throw new Error("Package version and public metadata differ");
if (
    (await readFile(".node-version", "utf8")) !==
    (await readFile(".nvmrc", "utf8"))
)
    throw new Error("Node version files differ");
for (const name of configNames) {
    if (!manifest.exports[`./configs/${name}`] || !configs[name])
        throw new Error(`Missing preset export: ${name}`);
}
let rule = await readFile("docs/rules/activate.md", "utf8");
const table = [
    "| Option | Default |",
    "| --- | --- |",
    ...Object.entries(defaultSettings).map(
        ([key, value]) => `| \`${key}\` | \`${JSON.stringify(value)}\` |`
    ),
].join("\n");
rule = rule.replace(
    /<!-- options:start -->[\s\S]*?<!-- options:end -->/u,
    `<!-- options:start -->\n\n${table}\n\n<!-- options:end -->`
);
await sync("docs/rules/activate.md", rule);
await sync("docs/docusaurus/site-docs/activate.md", rule);
await mkdir("docs/docusaurus/site-docs/presets", { recursive: true });
const descriptions = {
    recommended: "Show each file using the default display options.",
    "recommended-ci": "Hide all plugin output when CI is exactly true.",
    "recommended-ci-detailed":
        "Hide live output in CI while retaining the detailed process summary.",
    "recommended-compact":
        "Announce generic activity once, without showing filenames.",
    "recommended-detailed": "Show filenames and the detailed process summary.",
    "recommended-summary-only": "Show only the final process summary.",
    "recommended-tty":
        "Show output only when stderr is an interactive terminal.",
};
await sync(
    "docs/docusaurus/site-docs/presets.md",
    [
        "# Presets",
        "",
        "Every preset enables `file-progress/activate`. Add its subpath to your Stylelint `extends` array after your existing configs.",
        "",
        "| Preset | Behavior |",
        "| --- | --- |",
        ...configNames.map(
            (name) =>
                `| [${name}](./presets/${name}.md) | ${descriptions[name]} |`
        ),
        "",
    ].join("\n")
);
for (const name of configNames)
    await sync(
        `docs/docusaurus/site-docs/presets/${name}.md`,
        `# ${name}\n\n${descriptions[name]}\n\n\x60\x60\x60js\nexport default {\n    extends: ["stylelint-plugin-file-progress/configs/${name}"],\n};\n\x60\x60\x60\n\nSee [all options](../activate.md) and [compatibility](../compatibility.md) for summary and terminal behavior.\n`
    );
await mkdir("docs/docusaurus/site-docs/developer", { recursive: true });
await sync(
    "docs/docusaurus/site-docs/developer/contributing.md",
    await readFile("CONTRIBUTING.md", "utf8")
);
const readme = `# stylelint-plugin-file-progress\n\nLive filenames and configurable process summaries for Stylelint.\n\n[![CI](https://github.com/Nick2bad4u/stylelint-plugin-file-progress/actions/workflows/ci.yml/badge.svg)](https://github.com/Nick2bad4u/stylelint-plugin-file-progress/actions/workflows/ci.yml)\n\n[Documentation](https://nick2bad4u.github.io/stylelint-plugin-file-progress/) · [CI](https://github.com/Nick2bad4u/stylelint-plugin-file-progress/actions/workflows/ci.yml)\n\n![Terminal progress demo](docs/docusaurus/static/img/terminal.svg)\n\n## Quick start\n\nThe initial npm release is being prepared. Build and install a repository tarball with \x60npm pack\x60 until publication.\n\n\x60\x60\x60js\nexport default {\n    extends: ["stylelint-plugin-file-progress/configs/recommended"],\n};\n\x60\x60\x60\n\n## Rule\n\n| Rule | Purpose |\n| --- | --- |\n| [file-progress/activate](docs/rules/activate.md) | Observe files without changing CSS or lint findings. |\n\n## Presets\n\n${configNames.map((name) => `- \x60${name}\x60: ${descriptions[name]}`).join("\n")}\n\n## Compatibility\n\nNode.js 22+, Stylelint \x60^16.0.0 || ^17.14.0\x60, ESM and CommonJS. CommonJS with Stylelint 17 requires Node 22.12+ for synchronous ESM loading. Progress goes to stderr by default. Summaries measure observed file events over the process lifetime, not problem counts or exact per-file completion times.\n\nSee [contributing](CONTRIBUTING.md) for development and verification, and [NOTICE](NOTICE) for the ESLint progress project's attribution.\n`;
await sync("README.md", readme);
