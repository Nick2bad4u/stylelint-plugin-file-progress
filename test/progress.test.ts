import stylelint from "stylelint";
import { describe, expect, it, vi } from "vitest";

import type { ProgressSettings, SpinnerStyle } from "../src/types.js";

import {
    ProgressController,
    type ProgressHost,
} from "../src/_internal/controller.js";
import {
    formatProgress,
    formatSummary,
    relativePath,
    safeText,
} from "../src/_internal/formatting.js";
import {
    defaultSettings,
    normalizeSettings,
} from "../src/_internal/options.js";
import plugin, { configNames, configs, meta, rules } from "../src/plugin.js";

function harness(isTTY = false, useColor = false) {
    let now = 0;
    const write = vi.fn<ProgressHost["write"]>();
    const onExit = vi.fn<ProgressHost["onExit"]>();
    const host: ProgressHost = {
        color: () => useColor,
        cwd: () => "/project",
        isTTY: () => isTTY,
        now: () => now,
        onExit,
        write,
    };
    return {
        advance: (ms: number) => {
            now += ms;
        },
        controller: new ProgressController(host),
        onExit,
        write,
    };
}

describe("observational progress", () => {
    it("does nothing until the first file and deduplicates only result identities", () => {
        expect.hasAssertions();

        const h = harness();

        expect(h.write).not.toHaveBeenCalled();
        expect(h.onExit).not.toHaveBeenCalled();

        const result = {};
        h.controller.observe(result, "/project/a.css", { ...defaultSettings });
        h.controller.observe(result, "/project/a.css", { ...defaultSettings });
        h.controller.observe(
            {},
            "/project/a.css",
            normalizeSettings({ detailedSuccess: true })
        );

        expect(h.onExit).toHaveBeenCalledTimes(1);
        expect(h.write).toHaveBeenCalledTimes(2);

        h.advance(2000);
        h.onExit.mock.calls[0]?.[0](0);

        expect(h.write.mock.calls.at(-1)?.[1]).toContain("Files observed: 2");
        expect(h.write.mock.calls.at(-1)?.[1]).toContain("1.00 files/s");

        h.controller.finish(2);
        h.controller.observe({}, "b.css", { ...defaultSettings });

        expect(h.write).toHaveBeenCalledTimes(3);
    });

    it("never claims a problem count from exit status", () => {
        expect.hasAssertions();

        for (const exitCode of [0, 2]) {
            const h = harness();
            h.controller.observe(
                {},
                "a.css",
                normalizeSettings({ detailedSuccess: true })
            );
            h.controller.finish(exitCode);
            const summary = h.write.mock.calls.at(-1)?.[1];

            expect(summary).toContain(`Process exit code: ${exitCode}`);
            expect(summary).not.toContain("Problems:");
        }
    });

    it.each<ProgressSettings>([
        { hide: true },
        { ttyOnly: true },
        { minFilesBeforeShow: 3 },
    ])("suppresses output for %j", (settings) => {
        expect.hasAssertions();

        const h = harness();
        h.controller.observe({}, "a.css", normalizeSettings(settings));
        h.controller.finish(0);

        expect(h.write).not.toHaveBeenCalled();
    });

    it("supports hidden summaries, summary-only mode, and last-file settings", () => {
        expect.hasAssertions();

        for (const settings of [
            { hide: true, showSummaryWhenHidden: true },
            { mode: "summary-only" as const },
        ]) {
            const h = harness();
            h.controller.observe({}, "a.css", normalizeSettings(settings));

            expect(h.write).not.toHaveBeenCalled();

            h.controller.finish(0);

            expect(h.write).toHaveBeenCalledTimes(1);
        }
        const h = harness();
        h.controller.observe(
            {},
            "a.css",
            normalizeSettings({ outputStream: "stdout" })
        );
        h.controller.observe({}, "b.css", normalizeSettings({ hide: true }));
        h.controller.finish(0);

        expect(h.write.mock.calls).toMatchObject([
            [
                "stdout",
                expect.stringContaining("a.css"),
                false,
            ],
        ]);
    });

    it("counts throttled files and waits for the minimum count", () => {
        expect.hasAssertions();

        const h = harness();
        const settings = normalizeSettings({
            detailedSuccess: true,
            minFilesBeforeShow: 2,
            throttleMs: 100,
        });
        h.controller.observe({}, "a.css", settings);
        h.controller.observe({}, "b.css", settings);
        h.advance(20);
        h.controller.observe({}, "c.css", settings);
        h.advance(100);
        h.controller.observe({}, "d.css", settings);
        h.controller.finish(0);

        expect(h.write).toHaveBeenCalledTimes(3);
        expect(h.write.mock.calls.at(-1)?.[1]).toContain("Files observed: 4");
    });

    it.each<ProgressSettings>([{ mode: "compact" }, { hideFileName: true }])(
        "only announces generic activity once for %j",
        (settings) => {
            expect.hasAssertions();

            const h = harness();
            h.controller.observe({}, "a.css", normalizeSettings(settings));
            h.controller.observe({}, "b.css", normalizeSettings(settings));

            expect(h.write).toHaveBeenCalledTimes(1);
            expect(h.write.mock.calls[0]?.[1]).toContain(
                "linting project files..."
            );
        }
    );

    it.each<SpinnerStyle>([
        "arc",
        "bounce",
        "clock",
        "dots",
        "line",
    ])("renders %s frames only on a terminal", (spinnerStyle) => {
        expect.hasAssertions();

        const h = harness(true, true);
        h.controller.observe(
            {},
            "a.css",
            normalizeSettings({ spinnerStyle, ttyOnly: true })
        );
        h.controller.finish(0);

        expect(h.write.mock.calls[0]?.[1]).toContain("\u{1B}[");
        expect(h.write.mock.calls[0]?.[1]).toMatch(/\n$/v);
    });

    // eslint-disable-next-line test-signal/no-mock-call-only-tests -- Absence of output is the lifecycle contract before the first file.
    it("handles finishing before any files", () => {
        expect.hasAssertions();

        const h = harness();
        h.controller.finish(0);

        expect(h.write).not.toHaveBeenCalled();
    });
});

describe("formatting and settings", () => {
    it("retains the supplied path when the working directory is unavailable", () => {
        expect.hasAssertions();
        expect(relativePath("/removed/project/styles.css", "")).toBe(
            "/removed/project/styles.css"
        );
    });

    it("resolves defaults and deprecated alias precedence", () => {
        expect.hasAssertions();

        expect(normalizeSettings()).toStrictEqual(defaultSettings);
        expect(normalizeSettings({ hideDirectoryNames: true }).pathFormat).toBe(
            "basename"
        );
        expect(
            normalizeSettings({
                hideDirectoryNames: true,
                pathFormat: "relative",
            }).pathFormat
        ).toBe("relative");
    });

    it.each([
        [
            "/project/a.css",
            "/project",
            "a.css",
        ],
        [
            "a.css",
            "/project",
            "a.css",
        ],
        [
            "<input>",
            "/project",
            "<input>",
        ],
        [
            String.raw`C:\project\a.css`,
            String.raw`C:\project`,
            "a.css",
        ],
        [
            "/project/a.css",
            "/project/a.css",
            "a.css",
        ],
    ])("normalizes %s", (file, cwd, expected) => {
        expect.hasAssertions();
        expect(relativePath(file, cwd)).toBe(expected);
    });

    it("preserves POSIX backslashes and escapes C1 terminal controls", () => {
        expect.hasAssertions();

        const options = normalizeSettings({ pathFormat: "basename" });

        expect(
            formatProgress(String.raw`/project/foo\bar.css`, options, false)
        ).toBe(String.raw`SFP • linting foo\bar.css`);
        expect(
            formatProgress(String.raw`C:\project\bar.css`, options, false)
        ).toBe("SFP • linting bar.css");
        expect(safeText("a\u{85}b\u{9F}c\u{7F}")).toBe(
            String.raw`a\u0085b\u009fc\u007f`
        );
    });

    it("formats path, prefixes, multiline layouts, generic notices, and control characters", () => {
        expect.hasAssertions();

        expect(
            formatProgress(
                "src/a.css",
                normalizeSettings({ pathFormat: "basename" }),
                false
            )
        ).toBe("SFP • linting a.css");
        expect(
            formatProgress(
                "src/a.css",
                normalizeSettings({ fileNameOnNewLine: true }),
                false
            )
        ).toContain("\n  ↳ src/a.css");
        expect(
            formatProgress(
                "a.css",
                normalizeSettings({ hidePrefix: true }),
                false
            )
        ).toBe("a.css");
        expect(
            formatProgress(
                "a.css",
                normalizeSettings({ hidePrefix: true, mode: "compact" }),
                false
            )
        ).toBe("linting project files...");
        expect(safeText("a\n\u{1B}[31mb.css")).toBe(String.raw`a\nb.css`);
        expect(safeText("\u{1B}[31mred")).not.toContain("\u{1B}");
        expect(
            formatSummary(
                { durationMs: 0, exitCode: 0, filesObserved: 1 },
                normalizeSettings({
                    detailedSuccess: true,
                    hidePrefix: true,
                    successMark: "+",
                    successMessage: "Done",
                }),
                false
            )
        ).toContain("+ Done");
        expect(
            formatSummary(
                { durationMs: 0, exitCode: 1, filesObserved: 1 },
                normalizeSettings({ failureMark: "!" }),
                true
            )
        ).toContain("Process exited");
    });
});

describe("stylelint contract", () => {
    it("exports one native rule and all presets", () => {
        expect.hasAssertions();

        expect(plugin).toHaveLength(1);
        expect(meta.name).toBe("stylelint-plugin-file-progress");
        expect(rules.activate.ruleName).toBe("file-progress/activate");
        expect(Object.keys(configs)).toStrictEqual(configNames);
        expect(plugin.configs).toBe(configs);
    });

    it.each([
        false,
        "on",
        [true, { mode: "invalid" }],
        [true, { unknownOption: true }],
        [true, { throttleMs: -1 }],
        [true, { successMark: " " }],
        [true, { ttyOnly: "true" }],
    ])("rejects invalid options %j", async (entry) => {
        expect.hasAssertions();

        const result = await stylelint.lint({
            code: "a { color: red; }",
            config: {
                plugins: plugin,
                rules: { "file-progress/activate": entry },
            },
        });

        expect(result.errored).toBe(true);
        expect(result.results[0]?.invalidOptionWarnings).not.toHaveLength(0);
    });

    it("does not add diagnostics or alter CSS and accepts null", async () => {
        expect.hasAssertions();

        for (const ruleEntry of [
            null,
            [true, null],
            [true, { hide: true }],
        ]) {
            const result = await stylelint.lint({
                code: "a { color: red; }",
                config: {
                    plugins: plugin,
                    rules: { "file-progress/activate": ruleEntry },
                },
            });

            expect(result.errored).toBe(false);
            expect(result.results[0]?.warnings).toStrictEqual([]);
        }
    });

    it("reports invalid options once for a document containing multiple roots", async () => {
        expect.hasAssertions();

        const result = await stylelint.lint({
            code: "<style>a{color:red}</style><style>b{color:blue}</style>",
            codeFilename: "page.html",
            config: {
                plugins: plugin,
                rules: {
                    "file-progress/activate": [true, { mode: "invalid" }],
                },
            },
            customSyntax: "postcss-html",
        });

        expect(result.errored).toBe(true);
        expect(result.results[0]?.invalidOptionWarnings).toHaveLength(1);
    });
});
