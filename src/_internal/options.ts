import { isDefined, isSafeInteger, objectAssign, objectKeys } from "ts-extras";

import type { NormalizedProgressSettings, ProgressSettings } from "../types.js";

/** Defaults shared with the ESLint progress display. */
export const defaultSettings: Readonly<NormalizedProgressSettings> =
    Object.freeze({
        detailedSuccess: false,
        failureMark: "✖",
        fileNameOnNewLine: false,
        hide: false,
        hideFileName: false,
        hidePrefix: false,
        minFilesBeforeShow: 0,
        mode: "file",
        outputStream: "stderr",
        pathFormat: "relative",
        prefixMark: "•",
        showSummaryWhenHidden: false,
        spinnerStyle: "dots",
        successMark: "✔",
        successMessage: "Lint complete.",
        throttleMs: 0,
        ttyOnly: false,
    });

const isCount = (value: unknown): boolean =>
    typeof value === "number" && isSafeInteger(value) && value >= 0;
const isText = (value: unknown): boolean =>
    typeof value === "string" && value.trim().length > 0;

/** Stylelint's native secondary-option validators. */
export const possibleOptions: Record<
    keyof ProgressSettings,
    (
        | ((value: unknown) => boolean)
        | boolean
        | string
    )[]
> = {
    detailedSuccess: [true, false],
    failureMark: [isText],
    fileNameOnNewLine: [true, false],
    hide: [true, false],
    hideDirectoryNames: [true, false],
    hideFileName: [true, false],
    hidePrefix: [true, false],
    minFilesBeforeShow: [isCount],
    mode: [
        "compact",
        "file",
        "summary-only",
    ],
    outputStream: ["stderr", "stdout"],
    pathFormat: ["basename", "relative"],
    prefixMark: [isText],
    showSummaryWhenHidden: [true, false],
    spinnerStyle: [
        "arc",
        "bounce",
        "clock",
        "dots",
        "line",
    ],
    successMark: [isText],
    successMessage: [isText],
    throttleMs: [isCount],
    ttyOnly: [true, false],
};

/** Resolve already validated options, including the legacy path alias. */
export function normalizeSettings(
    options: Readonly<ProgressSettings> = {}
): NormalizedProgressSettings {
    const resolved = { ...defaultSettings };
    for (const key of objectKeys(defaultSettings)) {
        const value = options[key];
        if (isDefined(value)) objectAssign(resolved, { [key]: value });
    }

    // eslint-disable-next-line sonarjs/deprecation, @typescript-eslint/no-deprecated -- Read the supported deprecated alias at the normalization boundary.
    const isLegacyBasename = options.hideDirectoryNames === true;
    resolved.pathFormat =
        options.pathFormat ?? (isLegacyBasename ? "basename" : "relative");
    return resolved;
}
