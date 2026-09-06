import stylelint from "stylelint";

import type { ProgressSettings } from "../types.js";

import { processHost, ProgressController } from "../_internal/controller.js";
import { normalizeSettings, possibleOptions } from "../_internal/options.js";

/** Public namespaced rule identifier. */
export const ruleName = "file-progress/activate";
const controllerRef: { current?: ProgressController } = {};

/** Report progress using Stylelint's documented per-root rule callback. */
export const ruleFunction: stylelint.Rule =
    (primary, secondary: Readonly<ProgressSettings> | undefined) =>
    (root, result) => {
        if (
            !stylelint.utils.validateOptions(
                result,
                ruleName,
                { actual: primary, possible: [true] },
                { actual: secondary, optional: true, possible: possibleOptions }
            )
        )
            return;
        controllerRef.current ??= new ProgressController(processHost);
        const filename =
            result.opts.from ?? root.source?.input.file ?? "<input>";
        controllerRef.current.observe(
            result,
            filename.length > 0 ? filename : "<input>",
            normalizeSettings(secondary)
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
