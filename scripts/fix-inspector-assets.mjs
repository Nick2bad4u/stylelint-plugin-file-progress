import { readFile, readdir, writeFile } from "node:fs/promises";

// stylelint-config-inspector 2.3.5 rewrites HTML for --base, but its hydrated
// head configuration still replaces icon links with origin-root URLs.
const root = "docs/docusaurus/static/stylelint-inspector/_nuxt/";
const base = "/stylelint-plugin-file-progress/stylelint-inspector/";
for (const file of await readdir(root)) {
    if (!file.endsWith(".js")) continue;
    const original = await readFile(root + file, "utf8");
    const updated = original.replaceAll(
        /(href:[`"'])\/(favicon\.svg|stylelint\/stylelint-icon-(?:black\.svg|white-512\.png))([`"'])/gu,
        `$1${base}$2$3`
    );
    if (updated !== original) await writeFile(root + file, updated);
}
