import stylelint from "stylelint";
import { safeCastTo } from "ts-extras";

import type { ProgressSettings } from "../types.js";

import { processHost, ProgressController } from "../_internal/controller.js";
import { normalizeSettings, possibleOptions } from "../_internal/options.js";

/** Public namespaced rule identifier. */
export const ruleName = "file-progress/activate";
const controllerKey = Symbol.for(
    "stylelint-plugin-file-progress.controller.v1"
);
const validationKey = Symbol.for(
    "stylelint-plugin-file-progress.validation.v1"
);
// Both module formats share a lazy controller in this process.
const controllerRegistry = safeCastTo<
    typeof globalThis & {
        [controllerKey]?: ProgressController;
        [validationKey]?: WeakSet<object>;
    }
>(globalThis);

/** Report progress using Stylelint's documented per-root rule callback. */
export const ruleFunction: stylelint.Rule =
    (
        primary,
        secondary:
            | null
            | Readonly<ProgressSettings>
            | undefined
    ) =>
    (root, result) => {
        // A multi-root document shares one result, including option diagnostics.
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- The global validation set is absent until the first rule invocation.
        controllerRegistry[validationKey] ??= new WeakSet<object>();
        const validated = controllerRegistry[validationKey];
        if (validated.has(result)) return;
        validated.add(result);
        if (
            !stylelint.utils.validateOptions(
                result,
                ruleName,
                { actual: primary, possible: [true] },
                { actual: secondary, optional: true, possible: possibleOptions }
            )
        )
            return;
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- The registry key is absent until either module format observes its first file.
        controllerRegistry[controllerKey] ??= new ProgressController(
            processHost
        );
        const controller = controllerRegistry[controllerKey];
        const filename =
            result.opts.from ?? root.source?.input.file ?? "<input>";
        controller.observe(
            result,
            filename.length > 0 ? filename : "<input>",
            normalizeSettings(secondary ?? undefined)
        );
    };
ruleFunction.ruleName = ruleName;
ruleFunction.messages = stylelint.utils.ruleMessages(ruleName, {});
ruleFunction.meta = {
    url: "https://nick2bad4u.github.io/stylelint-plugin-file-progress/activate",
};

/** Native Stylelint registration. */
const plugin: stylelint.Plugin = stylelint.createPlugin(ruleName, ruleFunction);
export default plugin;
