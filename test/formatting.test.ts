import { stripVTControlCharacters } from "node:util";
import { describe, expect, it } from "vitest";

import { formatProgress, formatSummary } from "../src/_internal/formatting.js";
import { normalizeSettings } from "../src/_internal/options.js";

describe("terminal presentation", () => {
    it("matches the ESLint prefix, dim status and arrow, directory colors, and filename emphasis", () => {
        expect.hasAssertions();

        expect(
            formatProgress(
                "src/components/card.module.css",
                normalizeSettings({ fileNameOnNewLine: true }),
                true
            )
        ).toBe(
            "\u{1B}[1m\u{1B}[36mSFP\u{1B}[39m\u{1B}[22m " +
                "\u{1B}[2m•\u{1B}[22m \u{1B}[2mlinting\u{1B}[22m\n" +
                "\u{1B}[2m  ↳\u{1B}[22m " +
                "\u{1B}[1m\u{1B}[34msrc\u{1B}[39m\u{1B}[22m\u{1B}[2m/\u{1B}[22m" +
                "\u{1B}[1m\u{1B}[36mcomponents\u{1B}[39m\u{1B}[22m\u{1B}[2m/\u{1B}[22m" +
                "\u{1B}[1m\u{1B}[32mcard.module\u{1B}[39m\u{1B}[22m\u{1B}[32m.css\u{1B}[39m"
        );
    });

    it("cycles the five directory colors independently of the green filename", () => {
        expect.hasAssertions();

        const output = formatProgress(
            "one/two/three/four/five/six/seven/style.css",
            normalizeSettings({ hidePrefix: true }),
            true
        );
        for (const [segment, color] of [
            ["five", 33],
            ["four", 35],
            ["one", 34],
            ["seven", 36],
            ["six", 34],
            ["three", 32],
            ["two", 36],
        ] as const)
            expect(output).toContain(
                `\u{1B}[1m\u{1B}[${color}m${segment}\u{1B}[39m\u{1B}[22m`
            );

        expect(output).toContain(
            "\u{1B}[1m\u{1B}[32mstyle\u{1B}[39m\u{1B}[22m\u{1B}[32m.css\u{1B}[39m"
        );
    });

    it.each([
        "/src//themes/élève.css",
        String.raw`C:\src\themes\card.css`,
        String.raw`\\server\share\theme.css`,
        "src/.stylelintrc",
        "styles/extensionless",
        "styles/",
        "",
    ])(
        "preserves the exact path text for %j with and without color",
        (filename) => {
            expect.hasAssertions();

            const settings = normalizeSettings({ hidePrefix: true });
            const plain = formatProgress(filename, settings, false);

            expect(plain).toBe(filename);
            expect(
                stripVTControlCharacters(
                    formatProgress(filename, settings, true)
                )
            ).toBe(plain);
            expect(plain).not.toContain("\u{1B}");
        }
    );

    it("styles basenames and generic notices without leaking hidden directories", () => {
        expect.hasAssertions();

        const basename = formatProgress(
            "src/styles/entry.css",
            normalizeSettings({ hidePrefix: true, pathFormat: "basename" }),
            true
        );

        expect(basename).toBe(
            "\u{1B}[1m\u{1B}[32mentry\u{1B}[39m\u{1B}[22m\u{1B}[32m.css\u{1B}[39m"
        );
        expect(
            formatProgress(
                "hidden.css",
                normalizeSettings({ hidePrefix: true, mode: "compact" }),
                true
            )
        ).toBe("\u{1B}[2mlinting project files...\u{1B}[22m");
    });

    it("escapes terminal controls before adding presentation styles", () => {
        expect.hasAssertions();

        const rendered = formatProgress(
            "src/\u{1B}[31mbad\nname.css",
            normalizeSettings({ fileNameOnNewLine: true, prefixMark: "•\r" }),
            true
        );

        expect(stripVTControlCharacters(rendered)).toBe(
            "SFP •\\r linting\n  ↳ src/bad\\nname.css"
        );
        expect(rendered).not.toContain("\u{1B}[31m");
    });

    it.each([0, 2])(
        "styles summary labels and metrics for exit %i without inferring problem totals",
        (exitCode) => {
            expect.hasAssertions();

            const rendered = formatSummary(
                { durationMs: 750.125, exitCode, filesObserved: 3 },
                normalizeSettings({ detailedSuccess: true }),
                true
            );
            const resultColor = exitCode === 0 ? 32 : 31;

            expect(rendered).toContain(
                `\u{1B}[${resultColor}m•\u{1B}[39m \u{1B}[1m\u{1B}[36mSFP\u{1B}[39m\u{1B}[22m\u{1B}[2m:\u{1B}[22m`
            );
            expect(rendered).toContain(
                `\u{1B}[1m\u{1B}[${resultColor}m${exitCode === 0 ? "✔" : "✖"}\u{1B}[39m\u{1B}[22m`
            );
            expect(rendered).toContain(
                "\u{1B}[2m  Elapsed since first file:\u{1B}[22m \u{1B}[33m750ms\u{1B}[39m"
            );
            expect(rendered).toContain(
                "\u{1B}[2m  Files observed:\u{1B}[22m \u{1B}[33m3\u{1B}[39m"
            );
            expect(rendered).toContain(
                "\u{1B}[2m  Observed throughput:\u{1B}[22m \u{1B}[33m4.00 files/s\u{1B}[39m"
            );
            expect(rendered).toContain(
                `\u{1B}[2m  Process exit code:\u{1B}[22m \u{1B}[${resultColor}m${exitCode}\u{1B}[39m`
            );
            expect(stripVTControlCharacters(rendered)).not.toContain(
                "Problems:"
            );
        }
    );

    it("keeps hidden-prefix summaries and redirected output free of presentation marks", () => {
        expect.hasAssertions();

        const output = formatSummary(
            { durationMs: 0, exitCode: 0, filesObserved: 1 },
            normalizeSettings({
                detailedSuccess: true,
                hidePrefix: true,
                successMessage: "Done",
            }),
            false
        );

        expect(output).toBe(
            "✔ Done\n  Elapsed since first file: 0ms\n  Files observed: 1\n  Observed throughput: 0.00 files/s\n  Process exit code: 0"
        );
    });
});
