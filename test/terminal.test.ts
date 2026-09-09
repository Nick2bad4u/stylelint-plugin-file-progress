import { describe, expect, it } from "vitest";

import type { OutputStream, ProgressSettings } from "../src/types.js";

import {
    ProgressController,
    type TerminalState,
} from "../src/_internal/controller.js";
import { normalizeSettings } from "../src/_internal/options.js";
import { terminalScreen } from "./terminal-helpers.js";

function harness(columns = 80, rows = 24) {
    let output = "";
    let revision = 0;
    let terminal: TerminalState | undefined = { columns, revision: "0", rows };
    const controller = new ProgressController({
        color: () => true,
        cwd: () => "/project",
        isTTY: () => true,
        now: () => 100,
        onExit: () => undefined,
        terminal: () => terminal && { ...terminal, revision: String(revision) },
        write: (_stream, text) => {
            output += text;
            revision += 1;
        },
    });
    return {
        controller,
        external: (text: string) => {
            output += text;
            revision += 1;
        },
        observe: (filename: string, options: ProgressSettings = {}) => {
            controller.observe(
                {},
                filename,
                normalizeSettings({ fileNameOnNewLine: true, ...options })
            );
        },
        output: () => output,
        resize: (next: TerminalState | undefined) => {
            terminal = next;
        },
        screen: () => terminalScreen(output, columns, rows),
    };
}

describe("in-place terminal progress", () => {
    it.each([
        20,
        80,
        160,
    ])(
        "replaces wrapped paths and both spinner rows at %s columns",
        async (columns) => {
            expect.hasAssertions();

            const h = harness(columns);
            h.external("Debugger attached.\n");
            h.observe(
                `storybook-static/${"assets/".repeat(8)}old-stylesheet.css`
            );
            h.observe("docs/layouts/plant-tracker.css");
            const screen = await h.screen();

            expect(screen).toContain("Debugger attached.");
            expect(screen.match(/SFP • linting/gv)).toHaveLength(1);
            expect(screen).not.toContain("storybook-static");
            expect(screen).not.toContain("old-stylesheet");
            expect(screen.replaceAll("\n", "")).toContain(
                "docs/layouts/plant-tracker.css"
            );
        }
    );

    it.each(["stderr", "stdout"] as const)(
        "reuses a single-line display on %s and replaces it with one summary",
        async (outputStream: OutputStream) => {
            expect.hasAssertions();

            const h = harness();
            h.observe("old.css", { fileNameOnNewLine: false, outputStream });
            h.observe("new.css", { fileNameOnNewLine: false, outputStream });

            await expect(h.screen()).resolves.toBe("⠙ SFP • linting new.css");

            h.controller.finish(0);
            h.controller.finish(2);
            const screen = await h.screen();

            expect(screen).not.toContain("linting");
            expect(screen).not.toContain("new.css");
            expect(screen.match(/Lint complete\./gv)).toHaveLength(1);
        }
    );

    it("preserves diagnostics between API calls and at shutdown", async () => {
        expect.hasAssertions();

        const h = harness();
        h.observe("first.css");
        h.external("\u{1B}[31mfirst.css: invalid hex\u{1B}[39m\n");
        h.observe("second.css");
        h.observe("third.css");
        h.external("third.css: unexpected property\n");
        h.controller.finish(2);
        const screen = await h.screen();

        expect(screen).toContain("first.css: invalid hex");
        expect(screen).toContain("third.css: unexpected property");
        expect(screen).not.toContain("second.css");
        expect(screen.match(/Process exited with status 2\./gv)).toHaveLength(
            1
        );
    });

    it("wraps wide glyphs, emoji frames, combining marks and exact-width paths without stale rows", async () => {
        expect.hasAssertions();

        const h = harness(20);
        h.external("KEEP THIS LINE\n");
        for (const filename of [
            "漢字/🧑‍💻/é.css",
            "a".repeat(19),
            "b".repeat(38),
            "final.css",
        ])
            h.observe(filename, { spinnerStyle: "clock" });
        const screen = await h.screen();

        expect(screen).toContain("KEEP THIS LINE");
        expect(screen.match(/SFP • linting/gv)).toHaveLength(1);
        expect(screen).toContain("final.css");
        expect(screen).not.toContain("漢字");
        expect(screen).not.toContain("aaaa");
        expect(screen).not.toContain("bbbb");
    });

    it("bounds very long paths to the viewport so clearing cannot erase preceding output", async () => {
        expect.hasAssertions();

        const h = harness(20, 5);
        h.external("KEEP THIS LINE\n");
        h.observe("long-path/".repeat(100));
        h.observe("final.css");

        await expect(h.screen()).resolves.toContain("KEEP THIS LINE");
        await expect(h.screen()).resolves.not.toContain("long-path");
    });

    it.each([
        { columns: 40, rows: 24 },
        { columns: 80, rows: 12 },
    ])("does not use stale cursor coordinates after resizing to %j", (size) => {
        expect.hasAssertions();

        const h = harness();
        h.observe("first.css");
        h.resize({ ...size, revision: "0" });
        h.observe("second.css");

        expect(h.output()).not.toContain("\u{1B}[1A");

        h.observe("third.css");

        expect(h.output()).toContain("\u{1B}[1A");
    });

    it("leaves the previous stream alone when settings change", () => {
        expect.hasAssertions();

        const h = harness();
        h.observe("first.css");
        h.observe("second.css", { outputStream: "stdout" });

        expect(h.output()).not.toContain("\u{1B}[1A");
    });

    it("falls back to complete lines when terminal coordinates become unavailable", () => {
        expect.hasAssertions();

        const h = harness();
        h.observe("first.css");
        h.resize(undefined);
        h.observe("second.css");
        h.observe("third.css");
        h.controller.finish(0);

        expect(h.output()).not.toContain("\u{1B}[1A");
        expect(h.output()).toContain("second");
        expect(h.output()).toContain("third");
    });
});
