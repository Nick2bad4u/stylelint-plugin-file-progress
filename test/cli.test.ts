import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import * as path from "node:path";
import { pathToFileURL } from "node:url";
import { afterEach, describe, expect, it } from "vitest";

describe("command-line integration", () => {
    const folders: string[] = [];

    // eslint-disable-next-line vitest/no-hooks -- Temporary directories must be cleaned even after failed assertions.
    afterEach(() => {
        for (const folder of folders.splice(0))
            rmSync(folder, { force: true, recursive: true });
    });

    const entry = path.resolve("dist/plugin.js").replaceAll("\\", "/");

    function fixture(
        options: Record<string, unknown> = {},
        showProgress = true,
        defaultSeverity: "error" | "warning" = "error"
    ) {
        const folder = mkdtempSync(
            path.join(tmpdir(), "stylelint-progress-cli-")
        );
        folders.push(folder);
        writeFileSync(path.join(folder, "a.css"), "a { color: RED; }\n");
        writeFileSync(path.join(folder, "b.css"), "b { color: blue; }\n");
        writeFileSync(
            path.join(folder, "config.json"),
            JSON.stringify({
                defaultSeverity,
                plugins: showProgress ? [entry] : [],
                rules: {
                    "color-hex-length": "short",
                    "color-no-invalid-hex": true,
                    ...(showProgress && {
                        "file-progress/activate": [
                            true,
                            { detailedSuccess: true, ...options },
                        ],
                    }),
                },
            })
        );
        return folder;
    }
    function readReport(folder: string): string {
        return readFileSync(path.join(folder, "report.json"), "utf8");
    }
    function readWarnings(folder: string): unknown {
        const data: unknown = JSON.parse(readReport(folder));
        if (!Array.isArray(data))
            throw new TypeError("Expected a report array");
        const file: unknown = data[0];
        if (typeof file !== "object" || file === null || !("warnings" in file))
            throw new TypeError("Expected a warning list");
        return file.warnings;
    }
    function run(folder: string, args: string[] = [], input?: string) {
        return spawnSync(
            process.execPath,
            [
                path.resolve("node_modules/stylelint/bin/stylelint.mjs"),
                "--config",
                path.join(folder, "config.json"),
                ...args,
            ],
            {
                cwd: folder,
                encoding: "utf8",
                // eslint-disable-next-line n/no-process-env -- The real CLI inherits the caller environment with color disabled for assertions.
                env: { ...process.env, FORCE_COLOR: "0", NO_COLOR: "1" },
                input,
                timeout: 20_000,
            }
        );
    }

    it("keeps stdout and JSON report files intact and emits one process summary after two files", () => {
        expect.hasAssertions();

        const folder = fixture();
        const result = run(folder, [
            "*.css",
            "--formatter",
            "json",
            "--output-file",
            "report.json",
        ]);

        expect(result.status).toBe(0);
        expect(JSON.parse(readReport(folder))).toHaveLength(2);
        expect(result.stdout).toBe("");
        expect(result.stderr).toContain("a.css");
        expect(result.stderr).toContain("b.css");
        expect(result.stderr.match(/Files observed:/gv)).toHaveLength(1);
        expect(result.stderr).toContain("Files observed: 2");
        expect(result.stderr).not.toContain("\u{1B}[");
    });

    it("preserves failure diagnostics and exit status", () => {
        expect.hasAssertions();

        const folder = fixture();
        writeFileSync(path.join(folder, "a.css"), "a { color: #ggg; }\n");
        const withPlugin = run(folder, [
            "a.css",
            "--formatter",
            "json",
            "--output-file",
            "report.json",
        ]);
        const plain = fixture({}, false);
        writeFileSync(path.join(plain, "a.css"), "a { color: #ggg; }\n");
        const plainResult = run(plain, [
            "a.css",
            "--formatter",
            "json",
            "--output-file",
            "report.json",
        ]);

        expect(withPlugin.status).toBe(plainResult.status);
        expect(withPlugin.status).toBe(2);
        expect(readWarnings(folder)).toStrictEqual(readWarnings(plain));
        expect(withPlugin.stderr).toContain("Process exit code: 2");
    });

    it("preserves warnings with a successful process exit", () => {
        expect.hasAssertions();

        const folder = fixture({}, true, "warning");
        writeFileSync(path.join(folder, "a.css"), "a { color: #ggg; }\n");
        const result = run(folder, [
            "a.css",
            "--formatter",
            "json",
            "--output-file",
            "report.json",
        ]);

        expect(result.status).toBe(0);
        expect(readWarnings(folder)).toMatchObject([
            { rule: "color-no-invalid-hex", severity: "warning" },
        ]);
        expect(result.stderr).toContain("Process exit code: 0");
        expect(result.stderr).not.toContain("0 warnings");
    });

    it.each([
        "true",
        "false",
        "TRUE",
        "",
    ])("preserves all seven presets with CI=%s", (ci) => {
        expect.hasAssertions();

        const program = `import {configs} from ${JSON.stringify(pathToFileURL(entry).href)}; console.log(JSON.stringify(Object.fromEntries(Object.entries(configs).map(([name,config])=>[name,config.rules['file-progress/activate'][1]]))));`;
        const result = spawnSync(
            process.execPath,
            [
                "--input-type=module",
                "-e",
                program,
            ],
            {
                encoding: "utf8",
                // eslint-disable-next-line n/no-process-env -- Presets are resolved at import time in an isolated process.
                env: { ...process.env, CI: ci },
                timeout: 20_000,
            }
        );
        const isActive = ci === "true";

        expect(result.status).toBe(0);
        expect(result.stderr).toBe("");
        expect(JSON.parse(result.stdout)).toStrictEqual({
            recommended: {},
            "recommended-ci": { hide: isActive },
            "recommended-ci-detailed": {
                detailedSuccess: true,
                hide: isActive,
                showSummaryWhenHidden: isActive,
            },
            "recommended-compact": { mode: "compact" },
            "recommended-detailed": { detailedSuccess: true },
            "recommended-summary-only": { mode: "summary-only" },
            "recommended-tty": { ttyOnly: true },
        });
    });

    it("observes repeated API calls and anonymous input without a premature summary", () => {
        expect.hasAssertions();

        const stylelintUrl = pathToFileURL(
            path.resolve("node_modules/stylelint/lib/index.mjs")
        ).href;
        const program = String.raw`import stylelint from ${JSON.stringify(stylelintUrl)}; import plugin from ${JSON.stringify(pathToFileURL(entry).href)}; const config={plugins:plugin,rules:{'file-progress/activate':[true,{detailedSuccess:true}]}};for(const codeFilename of ['same.css','same.css',undefined])await stylelint.lint({code:'a{color:red}',codeFilename,config});process.stderr.write('API_CALLS_RETURNED\n');`;
        const result = spawnSync(
            process.execPath,
            [
                "--input-type=module",
                "-e",
                program,
            ],
            { encoding: "utf8", timeout: 20_000 }
        );

        expect(result.status).toBe(0);
        expect(result.stdout).toBe("");
        expect(result.stderr.match(/linting same\.css/gv)).toHaveLength(2);
        expect(result.stderr).toContain("<input>");
        expect(result.stderr).toContain("Files observed: 3");
        expect(result.stderr.indexOf("API_CALLS_RETURNED")).toBeLessThan(
            result.stderr.indexOf("Files observed:")
        );
        expect(result.stderr.match(/Files observed:/gv)).toHaveLength(1);
    });

    it("does not announce syntax failures that never reach the rule", () => {
        expect.hasAssertions();

        const folder = fixture();
        writeFileSync(path.join(folder, "a.css"), "a { color: red;\n");
        const result = run(folder, [
            "a.css",
            "--formatter",
            "json",
        ]);

        expect(result.status).toBe(2);
        expect(result.stderr).not.toContain("SFP");
    });

    it("respects caching and stdin filenames", () => {
        expect.hasAssertions();

        const folder = fixture();

        expect(run(folder, ["*.css", "--cache"]).status).toBe(0);
        expect(run(folder, ["*.css", "--cache"]).stderr).not.toContain("SFP");

        const stdin = run(
            folder,
            [
                "--stdin-filename",
                "input.css",
                "--formatter",
                "json",
            ],
            "a { color: red; }\n"
        );

        expect(stdin.status).toBe(0);
        expect(stdin.stderr).toContain("input.css");
    });

    it("does not change autofix output and supports stdout explicitly", () => {
        expect.hasAssertions();

        const folder = fixture({ outputStream: "stdout" });
        const result = run(
            folder,
            [
                "--stdin-filename",
                "input.css",
                "--fix",
            ],
            "a { color: #ffffff; }\n"
        );

        expect(result.status).toBe(0);
        expect(result.stdout).toContain("#fff");
        expect(result.stdout).toContain("SFP");
    });

    it("deduplicates multiple CSS roots in an HTML input", () => {
        expect.hasAssertions();

        const folder = fixture();
        writeFileSync(
            path.join(folder, "page.html"),
            "<style>a{color:red}</style><style>b{color:blue}</style>"
        );
        const result = run(folder, [
            "page.html",
            "--custom-syntax",
            createRequire(import.meta.url).resolve("postcss-html"),
            "--formatter",
            "json",
        ]);

        expect(result.status).toBe(0);
        expect(result.stderr).toContain("Files observed: 1");
    });

    it("imports ESM and CommonJS without output or process listeners", () => {
        expect.hasAssertions();

        const result = spawnSync(
            process.execPath,
            [
                "--input-type=module",
                "-e",
                `const before=process.listenerCount('exit'); await import(${JSON.stringify(pathToFileURL(entry).href)}); const module=await import('node:module'); const require=module.createRequire(import.meta.url); require(${JSON.stringify(path.resolve("dist/plugin.cjs"))}); if(process.listenerCount('exit')!==before)throw Error('import registered exit hook');`,
            ],
            { encoding: "utf8", timeout: 20_000 }
        );

        expect(result.status).toBe(0);
        expect(result.stdout).toBe("");
        expect(result.stderr).toBe("");
    });
});
