import { writeSync } from "node:fs";
import { performance } from "node:perf_hooks";
import pc from "picocolors";
import { isFinite } from "ts-extras";

import type {
    NormalizedProgressSettings,
    OutputStream,
    SpinnerStyle,
} from "../types.js";

import { formatProgress, formatSummary, relativePath } from "./formatting.js";

/** Injectable process boundary for deterministic lifecycle and terminal tests. */
export interface ProgressHost {
    readonly color: (stream: OutputStream) => boolean;
    readonly cwd: () => string;
    readonly isTTY: (stream: OutputStream) => boolean;
    readonly now: () => number;
    readonly onExit: (callback: (code: number) => void) => void;
    readonly write: (
        stream: OutputStream,
        text: string,
        isFinal: boolean
    ) => void;
}

const frames: Record<SpinnerStyle, readonly string[]> = {
    arc: [
        "◜",
        "◠",
        "◝",
        "◞",
        "◡",
        "◟",
    ],
    bounce: [
        "▖",
        "▘",
        "▝",
        "▗",
    ],
    clock: [
        "🕛",
        "🕐",
        "🕑",
        "🕒",
        "🕓",
        "🕔",
    ],
    dots: [
        "⠋",
        "⠙",
        "⠹",
        "⠸",
        "⠼",
        "⠴",
        "⠦",
        "⠧",
        "⠇",
        "⠏",
    ],
    line: [
        "|",
        "/",
        "-",
        "\\",
    ],
};

/**
 * Per-process output state. Instantiation and module import have no side
 * effects.
 */
export class ProgressController {
    #count = 0;
    #finished = false;
    readonly #host: ProgressHost;
    #rendered = -Infinity;
    readonly #seen = new WeakSet<object>();
    #settings: NormalizedProgressSettings | undefined;
    #started = 0;

    public constructor(host: ProgressHost) {
        this.#host = host;
    }

    /**
     * Finish once at process exit; this is deliberately not a public session
     * API.
     */
    public finish(code: number): void {
        if (this.#finished) return;
        this.#finished = true;
        const settings = this.#settings;
        if (
            !settings ||
            !this.#canShow(settings) ||
            (settings.hide && !settings.showSummaryWhenHidden)
        )
            return;
        const text = formatSummary(
            {
                durationMs: Math.max(0, this.#host.now() - this.#started),
                exitCode: code,
                filesObserved: this.#count,
            },
            settings,
            this.#host.color(settings.outputStream)
        );
        this.#host.write(settings.outputStream, `${text}\n`, true);
    }

    /** Record a result once, retaining the last valid settings for shutdown. */
    public observe(
        result: object,
        filename: string,
        settings: Readonly<NormalizedProgressSettings>
    ): void {
        if (this.#seen.has(result) || this.#finished) return;
        this.#seen.add(result);
        this.#settings = settings;
        if (this.#count === 0) {
            this.#started = this.#host.now();
            this.#host.onExit((code) => {
                this.finish(code);
            });
        }
        this.#count += 1;
        if (
            !this.#canShow(settings) ||
            settings.hide ||
            settings.mode === "summary-only"
        )
            return;
        const now = this.#host.now();
        if (now - this.#rendered < settings.throttleMs) return;
        // Compact output is an activity notice, not one identical line per file.
        if (
            (settings.mode === "compact" || settings.hideFileName) &&
            isFinite(this.#rendered)
        )
            return;
        this.#rendered = now;
        const frameSet = frames[settings.spinnerStyle];
        const frame = this.#host.isTTY(settings.outputStream)
            ? `${frameSet[(this.#count - 1) % frameSet.length] ?? "•"} `
            : "";
        const text = formatProgress(
            relativePath(filename, this.#host.cwd()),
            settings,
            this.#host.color(settings.outputStream)
        );
        // File-driven frames leave a complete line: no timer can overwrite Stylelint's formatter.
        this.#host.write(settings.outputStream, `${frame}${text}\n`, false);
    }

    #canShow(settings: Readonly<NormalizedProgressSettings>): boolean {
        return (
            this.#count >= settings.minFilesBeforeShow &&
            (!settings.ttyOnly || this.#host.isTTY(settings.outputStream))
        );
    }
}

/** Real process boundary. Synchronous final writes cannot be lost on exit. */
export const processHost: ProgressHost = {
    color: (stream) => pc.isColorSupported && process[stream].isTTY,
    cwd: () => process.cwd(),
    isTTY: (stream) => process[stream].isTTY,
    now: () => performance.now(),
    onExit: (callback) => {
        process.once("exit", callback);
    },
    write: (stream, text) => {
        // Progress must not crash linting when a downstream pipe closes.

        try {
            // eslint-disable-next-line n/no-sync -- Exit handlers cannot await asynchronous writes.
            writeSync(stream === "stderr" ? 2 : 1, text);
        } catch {
            /* Output is best effort. */
        }
    },
};
