import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import xterm from "@xterm/headless";
import { format, resolveConfig } from "prettier";
import { ProgressController } from "../dist/_internal/controller.js";
import {
    normalizeSettings,
    possibleOptions,
} from "../dist/_internal/options.js";
import { optionDemos } from "./demo-cases.mjs";

const check = process.argv.includes("--check");
for (const option of Object.keys(possibleOptions))
    assert.ok(
        optionDemos.some((demo) => Object.hasOwn(demo.options, option)),
        `Missing option demo: ${option}`
    );
const root = "docs/docusaurus/static/demos";
const hash = (value) => createHash("sha256").update(value).digest("hex");
const env = { ...process.env, CI: "true" };
delete env.NODE_OPTIONS;
delete env.VSCODE_INSPECTOR_OPTIONS;
// Resolve CI-aware presets in a fresh process, independent of the generator's environment.
const presets = JSON.parse(
    execFileSync(
        process.execPath,
        [
            "--input-type=module",
            "--eval",
            'import { configs } from "./dist/plugin.js"; console.log(JSON.stringify(configs));',
        ],
        { encoding: "utf8", env }
    )
);
const cases = [
    ...Object.entries(presets).map(([name, config]) => ({
        name,
        group: "presets",
        options: config.rules["file-progress/activate"][1],
        ci: name === "recommended-ci" || name === "recommended-ci-detailed",
    })),
    ...optionDemos.map((demo) => ({ ...demo, group: "options" })),
];
const samples = [
    "src/base.css",
    "src/layout.css",
    "src/components/card.css",
    "src/components/button.css",
    "src/theme.css",
    "src/utilities.css",
];
const manifest = {};
const recorded = check
    ? JSON.parse(await readFile(`${root}/integrity.json`, "utf8"))
    : {};
if (!check) {
    assert.equal(
        execFileSync("agg", ["--version"], { encoding: "utf8" }).trim(),
        "agg 1.9.0",
        "Install agg 1.9.0 to regenerate the GIFs"
    );
    for (const group of [
        "presets",
        "options",
        "casts",
    ])
        await mkdir(`${root}/${group}`, { recursive: true });
}

async function sync(file, expected) {
    if (check)
        assert.equal(
            await readFile(file, "utf8"),
            expected,
            `Stale demo: ${file}; run npm run docs:demos:write`
        );
    else await writeFile(file, expected);
}

let poster = "";
let posterSummary = "";
for (const demo of cases) {
    const settings = normalizeSettings(demo.options);
    const tty = demo.tty !== false;
    let milliseconds = 0;
    let onExit;
    let display = "";
    const stream = settings.outputStream;
    const events = [
        [
            0,
            "o",
            "\u001b[?25l",
        ],
    ];
    const emit = (text) => {
        display += text;
        events.push([
            milliseconds / 1000,
            "o",
            text.replaceAll("\n", "\r\n"),
        ]);
    };
    emit(`\u001b[1;36mStylelint File Progress\u001b[0m  /  ${demo.name}\n`);
    emit(
        `\u001b[90m${stream} | ${tty ? "interactive terminal" : "redirected output"}${demo.ci ? " | CI=true" : ""}\u001b[0m\n\n`
    );
    emit("\u001b[36m$\u001b[0m npx stylelint 'src/**/*.css'\n\n");
    const controller = new ProgressController({
        color: () => tty,
        cwd: () => "/demo",
        isTTY: () => tty,
        now: () => milliseconds,
        onExit: (callback) => {
            onExit = callback;
        },
        terminal: () =>
            tty
                ? { columns: 94, rows: 22, revision: String(display.length) }
                : undefined,
        write: (selected, text, isFinal) => {
            if (isFinal && demo.name === "recommended-detailed")
                posterSummary = text;
            assert.equal(selected, stream);
            emit(text);
        },
    });
    for (const filename of samples) {
        milliseconds += 380;
        controller.observe({}, `/demo/${filename}`, settings);
    }
    if (demo.name === "recommended-detailed") poster = display;
    milliseconds += 700;
    onExit(demo.exitCode ?? 0);
    milliseconds += 400;
    emit("\n\u001b[36m$\u001b[0m ");
    const cast = `${JSON.stringify({ version: 2, width: 94, height: 22, timestamp: 1744070400, env: { TERM: "xterm-256color", SHELL: "/bin/sh" } })}\n${events.map((event) => JSON.stringify(event)).join("\n")}\n`;
    const stem = `${demo.group}-${demo.name}`;
    const castPath = `${root}/casts/${stem}.cast`;
    const gifPath = `${root}/${demo.group}/${demo.name}.gif`;
    await sync(castPath, cast);
    if (!check)
        execFileSync(
            "agg",
            [
                castPath,
                gifPath,
                "--cols",
                "94",
                "--rows",
                "22",
                "--font-size",
                "16",
                "--idle-time-limit",
                "1",
                "--last-frame-duration",
                "1.5",
                "--theme",
                "github-dark",
            ],
            { stdio: "pipe" }
        );
    const gif = await readFile(gifPath);
    assert.equal(gif.subarray(0, 6).toString(), "GIF89a");
    manifest[stem] = { cast: hash(cast), gif: hash(gif) };
    if (check)
        assert.deepEqual(
            manifest[stem],
            recorded[stem],
            `Demo integrity mismatch: ${stem}`
        );
}
assert.equal(Object.keys(manifest).length, 31);
if (check)
    assert.deepEqual(
        Object.keys(manifest).sort(),
        Object.keys(recorded).sort(),
        "Demo inventory differs"
    );
else
    await writeFile(
        `${root}/integrity.json`,
        `${JSON.stringify(Object.fromEntries(Object.entries(manifest).sort(([left], [right]) => (left < right ? -1 : 1))), null, 4)}\n`
    );

// Keep a static, accessible poster for consumers that do not animate images.
const escape = (text) =>
    text
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");
const palette = {
    1: "#ff7b72",
    2: "#7ee787",
    3: "#e3b341",
    4: "#79c0ff",
    5: "#d2a8ff",
    6: "#a5d6ff",
    8: "#8b949e",
};
async function posterLines(output, startY) {
    const terminal = new xterm.Terminal({
        cols: 94,
        rows: 22,
        convertEol: true,
        allowProposedApi: true,
    });
    try {
        await new Promise((resolve) => terminal.write(output, resolve));
        const buffer = terminal.buffer.active;
        return Array.from({ length: buffer.length }, (_, index) => {
            const line = buffer.getLine(index);
            if (!line || !line.translateToString(true)) return "";
            const runs = [];
            for (let column = 0; column < line.length; column += 1) {
                const cell = line.getCell(column);
                if (!cell || cell.getWidth() === 0) continue;
                const color = cell.isFgPalette()
                    ? (palette[cell.getFgColor()] ?? "#e6edf3")
                    : "#e6edf3";
                const bold = cell.isBold() ? "700" : "400";
                const opacity = cell.isDim() ? "0.6" : "1";
                const chars = cell.getChars() || " ";
                const previous = runs.at(-1);
                if (
                    previous &&
                    previous.color === color &&
                    previous.bold === bold &&
                    previous.opacity === opacity
                )
                    previous.text += chars;
                else runs.push({ color, bold, opacity, column, text: chars });
            }
            // Positioned style runs preserve terminal spacing even after the
            // repository formatter adds whitespace between SVG elements.
            return runs
                .filter((run) => run.text.trim())
                .map((run) => {
                    const leading =
                        run.text.length - run.text.trimStart().length;
                    return (
                        '<text x="' +
                        (26 + (run.column + leading) * 9.6).toFixed(1) +
                        '" y="' +
                        (startY + index * 23) +
                        '" fill="' +
                        run.color +
                        '" font-weight="' +
                        run.bold +
                        '" opacity="' +
                        run.opacity +
                        '">' +
                        escape(run.text.trim()) +
                        "</text>"
                    );
                })
                .join("");
        }).join("");
    } finally {
        terminal.dispose();
    }
}
const lines = await posterLines(poster, 70);
const summaryLines = await posterLines(posterSummary, 330);
const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="940" height="540" viewBox="0 0 940 540" role="img" aria-label="Two moments from a Stylelint run: live progress and the final process summary"><rect width="940" height="540" rx="14" fill="#0d1117"/><circle cx="28" cy="25" r="6" fill="#ff7b72"/><circle cx="48" cy="25" r="6" fill="#e3b341"/><circle cx="68" cy="25" r="6" fill="#7ee787"/><g font-family="Consolas,monospace" font-size="16">' +
    lines +
    '<path d="M26 279H914" stroke="#30363d"/><text x="26" y="308" fill="#8b949e">After process exit</text>' +
    summaryLines +
    "</g></svg>\n";
const posterPath = "docs/docusaurus/static/img/terminal.svg";
await sync(
    posterPath,
    await format(svg, {
        ...(await resolveConfig(posterPath)),
        filepath: posterPath,
        parser: "html",
    })
);
console.log(
    `${check ? "Verified" : "Generated"} ${cases.length} colored demos, deterministic casts, integrity hashes, and static poster.`
);
