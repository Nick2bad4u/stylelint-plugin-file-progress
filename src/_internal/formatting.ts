import * as path from "node:path";
import { stripVTControlCharacters } from "node:util";
import pc from "picocolors";
import { arrayJoin } from "ts-extras";

import type { NormalizedProgressSettings } from "../types.js";

/** Observed process metrics; no inferred lint problem totals. */
export interface SummaryStats {
    readonly durationMs: number;
    readonly exitCode: number;
    readonly filesObserved: number;
}

/** Format an observed filename or generic activity. */
export function formatProgress(
    filename: string,
    options: Readonly<NormalizedProgressSettings>,
    useColor: boolean
): string {
    const colors = pc.createColors(useColor);
    const prefix = options.hidePrefix
        ? ""
        : `${colors.bold(colors.cyan("SFP"))} ${colors.dim(safeText(options.prefixMark))} `;
    if (options.mode === "compact" || options.hideFileName)
        return `${prefix}${colors.dim("linting project files...")}`;
    const text = formatPath(filename, options, colors);
    if (options.hidePrefix) return text;
    const continuation = options.fileNameOnNewLine
        ? `\n${colors.dim("  ↳")}`
        : "";
    return `${prefix}${colors.dim("linting")}${continuation} ${text}`;
}

/** Format a process-shutdown summary without claiming diagnostic counts. */
export function formatSummary(
    stats: SummaryStats,
    options: Readonly<NormalizedProgressSettings>,
    useColor: boolean
): string {
    const colors = pc.createColors(useColor);
    const resultColor = stats.exitCode === 0 ? colors.green : colors.red;
    const prefix = options.hidePrefix
        ? ""
        : `${resultColor(safeText(options.prefixMark))} ${colors.bold(colors.cyan("SFP"))}${colors.dim(":")} `;
    const mark = safeText(
        stats.exitCode === 0 ? options.successMark : options.failureMark
    );
    const message =
        stats.exitCode === 0
            ? safeText(options.successMessage)
            : `Process exited with status ${stats.exitCode}.`;
    const status = `${colors.bold(resultColor(mark))} ${resultColor(message)}`;
    const title = `${prefix}${status}`;
    if (!options.detailedSuccess) return title;
    const seconds = stats.durationMs / 1000;
    const duration =
        stats.durationMs < 1000
            ? `${Math.round(stats.durationMs)}ms`
            : `${seconds.toFixed(2)}s`;
    const throughput = `${seconds > 0 ? (stats.filesObserved / seconds).toFixed(2) : "0.00"} files/s`;
    return arrayJoin(
        [
            title,
            `${colors.dim("  Elapsed since first file:")} ${colors.yellow(duration)}`,
            `${colors.dim("  Files observed:")} ${colors.yellow(String(stats.filesObserved))}`,
            `${colors.dim("  Observed throughput:")} ${colors.yellow(throughput)}`,
            `${colors.dim("  Process exit code:")} ${resultColor(String(stats.exitCode))}`,
        ],
        "\n"
    );
}

/** Render Windows and POSIX paths consistently, including cross-platform tests. */
export function relativePath(filename: string, cwd: string): string {
    if (!cwd) return filename;
    const paths = pathImplementation(filename);
    if (!paths.isAbsolute(filename)) return filename;
    return paths.relative(cwd, filename) || paths.basename(filename);
}

/** Keep filenames and user messages on their intended terminal lines. */
export function safeText(value: string): string {
    return arrayJoin(
        Array.from(stripVTControlCharacters(value), (character) => {
            const code = character.codePointAt(0) ?? 0;
            if (code >= 127 && code <= 159)
                return String.raw`\u${code.toString(16).padStart(4, "0")}`;
            return code < 32
                ? JSON.stringify(character).slice(1, -1)
                : character;
        }),
        ""
    );
}

/** Match the ESLint renderer while retaining the exact displayed path text. */
function formatPath(
    filename: string,
    options: Readonly<NormalizedProgressSettings>,
    colors: Readonly<ReturnType<typeof pc.createColors>>
): string {
    const formatFile = (file: string): string => {
        const extension = file.lastIndexOf(".");
        return extension > 0
            ? `${colors.bold(colors.green(file.slice(0, extension)))}${colors.green(file.slice(extension))}`
            : colors.bold(colors.green(file));
    };
    if (options.pathFormat === "basename")
        return formatFile(
            safeText(pathImplementation(filename).basename(filename))
        );

    const segments = stripVTControlCharacters(filename).split(
        /(?<separator>[\/\\]+)/v
    );
    const directoryColors = [
        colors.blue,
        colors.cyan,
        colors.green,
        colors.magenta,
        colors.yellow,
    ];
    let directoryIndex = 0;
    return arrayJoin(
        segments.map((segment, index) => {
            const text = safeText(segment);
            if (index % 2 === 1) return colors.dim(text);
            if (index === segments.length - 1) return formatFile(text);
            if (!text) return text;
            const color =
                directoryColors[directoryIndex % directoryColors.length] ??
                colors.cyan;
            directoryIndex += 1;
            return colors.bold(color(text));
        }),
        ""
    );
}

function pathImplementation(filename: string): typeof path.posix {
    if (path.posix.isAbsolute(filename)) return path.posix;
    return path.win32.isAbsolute(filename) ? path.win32 : path;
}
