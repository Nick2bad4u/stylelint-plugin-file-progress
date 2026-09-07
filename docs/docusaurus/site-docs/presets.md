---
sidebar_label: Presets
description: Compare seven Stylelint progress presets for local terminals, CI, compact activity, and process summaries.
---

# Choose your progress preset

Every preset enables `file-progress/activate`. Add its subpath to your Stylelint `extends` array after your existing configs.

## Choose by workflow

| Preset                                                               | Best for                    | Behavior                                                             |
| -------------------------------------------------------------------- | --------------------------- | -------------------------------------------------------------------- |
| [🟢 recommended](./presets/recommended.md)                           | Follow each stylesheet      | Show each file using the default display options.                    |
| [🔵 recommended-ci](./presets/recommended-ci.md)                     | Keep CI logs quiet          | Hide all plugin output when CI is exactly true.                      |
| [🟣 recommended-ci-detailed](./presets/recommended-ci-detailed.md)   | Keep a summary in CI        | Hide live output in CI while retaining the detailed process summary. |
| [🟡 recommended-compact](./presets/recommended-compact.md)           | Show activity without paths | Announce generic activity once, without showing filenames.           |
| [🟠 recommended-detailed](./presets/recommended-detailed.md)         | See process-wide metrics    | Show filenames and the detailed process summary.                     |
| [🩷 recommended-summary-only](./presets/recommended-summary-only.md) | Read the final summary      | Show only the final process summary.                                 |
| [🟦 recommended-tty](./presets/recommended-tty.md)                   | Respect redirected output   | Show output only when stderr is an interactive terminal.             |

## Use a preset

```js
export default {
 extends: ["stylelint-plugin-file-progress/configs/recommended"],
};
```

Keep existing shared configs before the progress preset. Each preset includes plugin registration; the preset itself adds no CSS diagnostics.

## Customize or disable

Override `"file-progress/activate": [true, options]` in `rules` to customize the display, or set the rule to `null` to disable it. See [getting started](./getting-started.md#customize-the-display) and [all options](./activate.md#options).

## CI and terminal behavior

The two CI presets activate their CI behavior only when `CI` is exactly `true`. Outside CI, both display ordinary progress. The TTY preset checks stderr, the default output stream. Summary counts and timing cover the process lifetime; read [compatibility and metrics](./compatibility.md) before interpreting them.

Watch [all preset recordings](./demos.md#presets), explore [option demonstrations](./demos.md#options), or use [troubleshooting](./troubleshooting.md) if your output differs.
