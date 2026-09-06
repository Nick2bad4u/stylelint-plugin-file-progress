import { access, readFile } from "node:fs/promises";
import { configNames } from "../dist/plugin.js";

const root = "docs/docusaurus/build/";
for (const route of [
    "index.html",
    "activate.html",
    "presets.html",
    "compatibility.html",
    ...configNames.map((name) => `presets/${name}.html`),
    "eslint-inspector/index.html",
    "stylelint-inspector/index.html",
]) {
    await access(root + route);
}
const homepage = await readFile(root + "index.html", "utf8");
if (
    !homepage.includes("Stylelint File Progress") ||
    homepage.includes("stylelint-plugin-font")
)
    throw new Error("Documentation identity mismatch");
console.log(
    "Verified documentation routes, inspector entrypoints, and package identity."
);
