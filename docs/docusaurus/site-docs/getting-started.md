---
sidebar_label: Getting started
description: Install Stylelint File Progress, enable a preset, and customize terminal output in ESM or CommonJS.
---

# Getting started

Add live progress to your existing Stylelint workflow with one preset. The plugin observes files without changing CSS, fixes, or diagnostics.

## Install

```sh
npm install --save-dev stylelint stylelint-plugin-file-progress
```

The plugin supports Node.js 22+ and Stylelint `^16.0.0 || ^17.14.0`. See [module compatibility](./compatibility.md#node-and-module-formats) for the CommonJS requirements with Stylelint 17.

## Enable a preset

Add the preset to `stylelint.config.mjs`:

```js
export default {
 extends: [
  // Keep your existing shared configs here, before the progress preset.
  "stylelint-plugin-file-progress/configs/recommended",
 ],
};
```

Then run Stylelint with your usual inputs:

```sh
npx stylelint "src/**/*.css"
```

You will see a filename when each stylesheet reaches the progress rule, followed by a summary at process shutdown. The progress preset supplies no CSS lint rules of its own; keep the shared config or rules you already use.

:::tip Choose your level of detail

Use [`recommended-detailed`](./presets/recommended-detailed.md) for process metrics, [`recommended-ci-detailed`](./presets/recommended-ci-detailed.md) for a summary without live output when `CI=true`, or [compare all seven presets](./presets.md).

:::

## CommonJS

The same preset subpath works in `stylelint.config.cjs`:

```js
module.exports = {
 extends: ["stylelint-plugin-file-progress/configs/recommended"],
};
```

With Stylelint 17, CommonJS consumers need Node 22.12+ for synchronous ESM loading. Node 22.0.0 is supported with Stylelint 16 in both module formats.

## Customize the display

Override the rule after extending a preset. These are Stylelint secondary options:

```js
export default {
 extends: ["stylelint-plugin-file-progress/configs/recommended"],
 rules: {
  "file-progress/activate": [
   true,
   {
    pathFormat: "basename",
    spinnerStyle: "line",
    detailedSuccess: true,
   },
  ],
 },
};
```

Explore [all options and defaults](./activate.md#options) or [watch the option demos](./demos.md#options) before choosing your display.

## Keep machine-readable reports intact

Progress uses stderr by default. Stylelint's CLI diagnostic report also uses stderr, so write a JSON report to a separate file when another tool needs to parse it:

```sh
npx stylelint "src/**/*.css" --formatter json --output-file report.json
```

The default stream leaves stdout intact, including CSS produced when fixing stdin. Selecting `outputStream: "stdout"` mixes progress into that stream. Read [output behavior](./compatibility.md#other-output) for details.

## Disable progress

Set the rule to `null` in an override:

```js
export default {
 extends: ["stylelint-plugin-file-progress/configs/recommended"],
 rules: {
  "file-progress/activate": null,
 },
};
```

This also works when the rule comes from another shared config. For watch processes and editors, [summaries span the process lifetime](./compatibility.md#long-lived-processes).

## Next steps

- [Compare presets](./presets.md) to choose the output that suits your workflow.
- [Understand the metrics](./compatibility.md) before interpreting observed counts and timing.
- [Troubleshoot output](./troubleshooting.md) if files or summaries appear to be missing.
- [Explore the ecosystem](./resources.md) for inspectors, source code, and related plugins.
