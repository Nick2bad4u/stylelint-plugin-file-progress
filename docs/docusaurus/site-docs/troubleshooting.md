---
sidebar_label: Troubleshooting
description: Understand missing progress output, cached files, CI settings, process summaries, and formatter behavior.
---

# Troubleshooting

Start by checking which preset and secondary options Stylelint actually resolves. The plugin observes only inputs that reach its rule.

## No progress appears

Confirm that `file-progress/activate` is enabled and has not been overridden with `null`. Check the selected stream and these display controls:

| Setting or preset                    | Why output can be hidden                                                                        |
| ------------------------------------ | ----------------------------------------------------------------------------------------------- |
| `recommended-ci`                     | Hides all plugin output when `CI` is exactly `true`.                                            |
| `recommended-ci-detailed`            | Hides live output in CI; the detailed summary appears at process shutdown.                      |
| `recommended-tty` or `ttyOnly: true` | The selected stream must be an interactive terminal. Pipes and redirection can suppress output. |
| `hide: true`                         | Suppresses output unless `showSummaryWhenHidden` restores the summary.                          |
| `minFilesBeforeShow`                 | Output starts only after the observed-file threshold is reached.                                |
| `mode: "summary-only"`               | No live filenames are printed.                                                                  |

Compare the [preset demos](./demos.md#presets) and [rule options](./activate.md#options) with your config.

## Fewer filenames than expected

Ignored inputs and unchanged cached inputs can bypass rule execution. A parse error before the progress rule runs also prevents a notice. Multiple CSS roots in one processing result count as one physical input.

`throttleMs` can suppress displayed updates while preserving the observed count. Compact mode prints one generic notice. A filename event does not signal completion of every rule on that file; see [what a file event means](./compatibility.md#what-a-file-event-means).

## The summary has not appeared

The summary is process-scoped and appears at shutdown, after at least one observed input. An editor, watch process, or application making repeated Stylelint API calls may keep running and accumulate observations across repeated lint calls.

The plugin has no per-invocation session API. Read [long-lived process behavior](./compatibility.md#long-lived-processes) and disable the rule in integrations that do not want terminal output.

## A success mark appears alongside warnings

The summary appearance follows the process exit code. A zero exit code does not mean Stylelint reported zero warnings, and the plugin does not infer problem totals. Applications using the Node API manage their own exit status.

Use Stylelint's actual diagnostics for problem counts. See [process summaries](./activate.md#process-summaries).

## JSON output contains progress lines

Stylelint's normal CLI report and this plugin's default progress both use stderr. Use `--formatter json --output-file report.json` for a separate machine-readable report, as shown in [getting started](./getting-started.md#keep-machine-readable-reports-intact).

## Colors, symbols, or line wrapping differ

Redirected output uses plain lines without frames or color. In a terminal, glyph appearance depends on its font and Unicode support. Try `spinnerStyle: "line"` and ASCII marks if your font lacks the default symbols.

The plugin does not change terminal width, the console code page, or Stylelint's color settings. Stylelint's formatter still wraps diagnostics to the terminal width. See [terminal behavior](./activate.md#terminal-behavior).

## Still need help?

[Open an issue](https://github.com/Nick2bad4u/stylelint-plugin-file-progress/issues) with your Node and Stylelint versions, module format, preset or secondary options, whether the stream is interactive, and a small reproducible example. Remove private paths or stylesheet content before sharing logs.
