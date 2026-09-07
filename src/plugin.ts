import type { Config, Plugin, Rule } from "stylelint";

import type { ProgressSettings } from "./types.js";

import activate, { ruleFunction } from "./rules/activate.js";

/** Package identity. Kept in sync with package.json by sync:rules:check. */
export const meta = {
    /** Published npm package name. */
    name: "stylelint-plugin-file-progress",
    /** Namespace used by the file-progress/activate rule. */
    namespace: "file-progress",
    /** Version of this plugin build, matching package.json. */
    version: "1.0.2",
} as const;
/** Static package identity exposed on the plugin pack. */
export type FileProgressMetadata = typeof meta;

/** Rule registry keyed by unqualified rule name. */
export const rules: {
    /** Observes file-processing events without adding lint findings. */
    readonly activate: Rule;
} = { activate: ruleFunction };
/** Available configuration subpaths. */
export const configNames = [
    "recommended",
    "recommended-ci",
    "recommended-ci-detailed",
    "recommended-compact",
    "recommended-detailed",
    "recommended-summary-only",
    "recommended-tty",
] as const;
/** A Stylelint config with the progress plugin enabled. */
export type FileProgressConfig = Config;
/** Public preset names. */
export type FileProgressConfigName = (typeof configNames)[number];

// eslint-disable-next-line n/no-process-env -- CI-aware presets intentionally resolve the standard CI environment flag.
const isCi = process.env.CI === "true";
const presetOptions: Record<FileProgressConfigName, ProgressSettings> = {
    recommended: {},
    "recommended-ci": { hide: isCi },
    "recommended-ci-detailed": {
        detailedSuccess: true,
        hide: isCi,
        showSummaryWhenHidden: isCi,
    },
    "recommended-compact": { mode: "compact" },
    "recommended-detailed": { detailedSuccess: true },
    "recommended-summary-only": { mode: "summary-only" },
    "recommended-tty": { ttyOnly: true },
};

/** Shareable configurations; importing one does not start progress reporting. */
function makeConfig(name: FileProgressConfigName): FileProgressConfig {
    return {
        plugins: [activate],
        rules: { "file-progress/activate": [true, presetOptions[name]] },
    };
}
/** Shareable configurations; importing one does not start reporting. */
export const configs: Record<FileProgressConfigName, FileProgressConfig> = {
    recommended: makeConfig("recommended"),
    "recommended-ci": makeConfig("recommended-ci"),
    "recommended-ci-detailed": makeConfig("recommended-ci-detailed"),
    "recommended-compact": makeConfig("recommended-compact"),
    "recommended-detailed": makeConfig("recommended-detailed"),
    "recommended-summary-only": makeConfig("recommended-summary-only"),
    "recommended-tty": makeConfig("recommended-tty"),
};

/** Stylelint plugin pack with discoverable metadata, rules, and presets. */
export type FileProgressPlugin = Plugin[] & {
    /** Seven shareable presets, keyed by their public configuration names. */
    readonly configs: typeof configs;
    /** Package name, rule namespace, and build version. */
    readonly meta: typeof meta;
    /** Native Stylelint rules keyed by unqualified rule name. */
    readonly rules: typeof rules;
};

/** Default native plugin pack. */
const plugin: FileProgressPlugin = Object.assign([activate], {
    configs,
    meta,
    rules,
});
export type {
    OutputStream,
    ProgressMode,
    ProgressPathFormat,
    ProgressRuleOptions,
    ProgressSettings,
    SpinnerStyle,
} from "./types.js";
export default plugin;
