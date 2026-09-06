import { readFile, writeFile, mkdir } from "node:fs/promises";
import { configs, configNames, meta } from "../dist/plugin.js";
import { defaultSettings } from "../dist/_internal/options.js";
import { format, resolveConfig } from "prettier";
import { optionDemos } from "./demo-cases.mjs";

const badges =
    "[![Project type: Stylelint%20plugin.](https://flat.badgen.net/static/type/Stylelint%20plugin/A21CAF)](https://github.com/Nick2bad4u/stylelint-plugin-file-progress) [![Latest npm version.](https://flat.badgen.net/npm/v/stylelint-plugin-file-progress?color=0E7490)](https://www.npmjs.com/package/stylelint-plugin-file-progress) [![Monthly npm downloads.](https://flat.badgen.net/npm/dm/stylelint-plugin-file-progress?color=BE185D)](https://www.npmjs.com/package/stylelint-plugin-file-progress) [![Supported Node.js versions.](https://flat.badgen.net/npm/node/stylelint-plugin-file-progress?color=4D7C0F)](https://www.npmjs.com/package/stylelint-plugin-file-progress) [![TypeScript declaration status.](https://flat.badgen.net/npm/types/stylelint-plugin-file-progress?color=6D28D9)](https://www.npmjs.com/package/stylelint-plugin-file-progress) [![Codecov coverage.](https://flat.badgen.net/codecov/github/Nick2bad4u/stylelint-plugin-file-progress/main)](https://codecov.io/gh/Nick2bad4u/stylelint-plugin-file-progress/branch/main) [![GitHub Actions checks on main.](https://flat.badgen.net/github/checks/Nick2bad4u/stylelint-plugin-file-progress/main)](https://github.com/Nick2bad4u/stylelint-plugin-file-progress/actions) [![NPM license.](https://flat.badgen.net/npm/license/stylelint-plugin-file-progress?color=4338CA)](https://github.com/Nick2bad4u/stylelint-plugin-file-progress/blob/main/LICENSE)";

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
if (!/<!-- options:start -->[\s\S]*?<!-- options:end -->/u.test(rule))
    throw new Error(
        "The rule documentation is missing its generated option markers"
    );
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
        `# ${name}\n\n${descriptions[name]}\n\n\x60\x60\x60js\nexport default {\n    extends: ["stylelint-plugin-file-progress/configs/${name}"],\n};\n\x60\x60\x60\n\n![${name} colored terminal demonstration](../../static/demos/presets/${name}.gif)\n\n${name.includes("-ci") ? "This recording uses CI=true. Outside CI, the preset displays ordinary progress.\n\n" : ""}See [all options](../activate.md) and [compatibility](../compatibility.md) for summary and terminal behavior.\n`
    );
await mkdir("docs/docusaurus/site-docs/developer", { recursive: true });
await sync(
    "docs/docusaurus/site-docs/developer/contributing.md",
    await readFile("CONTRIBUTING.md", "utf8")
);
const readme = `# stylelint-plugin-file-progress\n\nLive filenames and configurable process summaries for Stylelint.\n\n${badges}\n\n![Colored per-file progress](https://raw.githubusercontent.com/Nick2bad4u/stylelint-plugin-file-progress/main/docs/docusaurus/static/demos/presets/recommended.gif)\n\n![Detailed process summary](https://raw.githubusercontent.com/Nick2bad4u/stylelint-plugin-file-progress/main/docs/docusaurus/static/demos/presets/recommended-detailed.gif)\n\n[Documentation](https://nick2bad4u.github.io/stylelint-plugin-file-progress/) · [All preset and option demos](https://nick2bad4u.github.io/stylelint-plugin-file-progress/demos)\n\n## Quick start\n\n\x60\x60\x60sh\nnpm install --save-dev stylelint stylelint-plugin-file-progress\n\x60\x60\x60\n\n\x60\x60\x60js\nexport default {\n    extends: ["stylelint-plugin-file-progress/configs/recommended"],\n};\n\x60\x60\x60\n\n## Rule\n\n| Rule | Purpose |\n| --- | --- |\n| [file-progress/activate](docs/rules/activate.md) | Observe files without changing CSS or lint findings. |\n\n## Presets\n\n${configNames.map((name) => `- \x60${name}\x60: ${descriptions[name]}`).join("\n")}\n\n## Compatibility\n\nNode.js 22+, Stylelint \x60^16.0.0 || ^17.14.0\x60, ESM and CommonJS. CommonJS with Stylelint 17 requires Node 22.12+ for synchronous ESM loading. Progress goes to stderr by default. Summaries measure observed file events over the process lifetime, not problem counts or exact per-file completion times.\n\nSee [contributing](CONTRIBUTING.md) for development and verification, and [NOTICE](NOTICE) for the ESLint progress project's attribution.\n`;
await sync("README.md", readme);

await sync(
    "docs/docusaurus/site-docs/demos.md",
    [
        "# Colored terminal demos",
        "",
        "These deterministic recordings use the plugin's actual display controller. File events arrive at fixed intervals to make behavior reproducible; the timings illustrate process-wide metrics and do not measure individual file completion. Spinner frames advance with file events, and each update leaves a complete line.",
        "",
        "Animated GIFs follow the presentation used by eslint-plugin-file-progress-2. For a still image, see the [static terminal poster](../static/img/terminal.svg). The casts preserve selectable terminal text and ANSI colors.",
        "",
        "## Presets",
        "",
        ...configNames.flatMap((name) => [
            `### ${name}`,
            "",
            descriptions[name],
            "",
            `![${name} terminal recording](../static/demos/presets/${name}.gif)`,
            "",
            `[Preset configuration](./presets/${name}.md) · [Terminal cast](../static/demos/casts/presets-${name}.cast)`,
            "",
        ]),
        "The two CI recordings use CI=true; recommended-tty uses an interactive stderr stream.",
        "",
        "## Options",
        "",
        'Add these secondary options to the rule: `rules: { "file-progress/activate": [true, options] }`.',
        "",
        ...optionDemos.flatMap((demo) => [
            `### ${demo.name}`,
            "",
            demo.description,
            "",
            "```json",
            JSON.stringify(demo.options, null, 4),
            "```",
            "",
            `![${demo.name} terminal recording](../static/demos/options/${demo.name}.gif)`,
            "",
            `[Terminal cast](../static/demos/casts/options-${demo.name}.cast)`,
            "",
        ]),
        "## Reproduce the recordings",
        "",
        "Install [agg 1.9.0](https://github.com/asciinema/agg/releases/tag/v1.9.0), then run `npm run build` and `npm run docs:demos:write`. The renderer uses the GitHub dark palette. Glyph appearance can vary with the system's monospace and fallback fonts.",
        "",
        "`npm run docs:demos:check` regenerates the expected terminal traces in memory and checks every committed cast, GIF integrity hash, gallery entry, and static poster without writing files or requiring agg. Regenerate the recordings whenever output behavior changes.",
        "",
    ].join("\n")
);
