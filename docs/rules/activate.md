# file-progress/activate

Report each physical input when it reaches the progress rule. The rule does not report lint findings or modify the stylesheet.

## Configuration

```js
export default {
 plugins: ["stylelint-plugin-file-progress"],
 rules: {
  "file-progress/activate": [
   true,
   {
    outputStream: "stderr",
    pathFormat: "relative",
    detailedSuccess: true,
   },
  ],
 },
};
```

Set the rule to `null` to disable it. Invalid options produce normal Stylelint configuration warnings. Stylelint's standard secondary options remain available.

## Options

<!-- options:start -->

| Option                  | Default            |
| ----------------------- | ------------------ |
| `detailedSuccess`       | `false`            |
| `failureMark`           | `"✖"`              |
| `fileNameOnNewLine`     | `false`            |
| `hide`                  | `false`            |
| `hideFileName`          | `false`            |
| `hidePrefix`            | `false`            |
| `minFilesBeforeShow`    | `0`                |
| `mode`                  | `"file"`           |
| `outputStream`          | `"stderr"`         |
| `pathFormat`            | `"relative"`       |
| `prefixMark`            | `"•"`              |
| `showSummaryWhenHidden` | `false`            |
| `spinnerStyle`          | `"dots"`           |
| `successMark`           | `"✔"`              |
| `successMessage`        | `"Lint complete."` |
| `throttleMs`            | `0`                |
| `ttyOnly`               | `false`            |

<!-- options:end -->

`hideDirectoryNames: true` is a deprecated alias for `pathFormat: "basename"`. An explicit `pathFormat` takes precedence. Marks and filenames are escaped before printing control characters.

- `mode` accepts `"file"`, `"compact"`, or `"summary-only"`.
- `pathFormat` accepts `"relative"` (relative to the process working directory) or `"basename"`.
- `spinnerStyle` accepts `"arc"`, `"bounce"`, `"clock"`, `"dots"`, or `"line"`. Frames are shown only on a terminal.
- `outputStream` accepts `"stderr"` or `"stdout"`. Choosing stdout mixes progress into that stream, including autofix output.
- `minFilesBeforeShow` and `throttleMs` are nonnegative safe integers. The first controls the observed-file threshold; the second sets the minimum milliseconds between displayed updates.
- `hide` suppresses progress and summaries; `showSummaryWhenHidden` restores the final summary while still honoring the file threshold and `ttyOnly`.
- `hideFileName` uses a generic activity notice. `hidePrefix` shows just the filename in file mode. `fileNameOnNewLine` places the filename below the progress prefix.
- `prefixMark`, `successMark`, `failureMark`, and `successMessage` accept nonempty strings. `detailedSuccess` adds the process metrics to both successful and unsuccessful shutdown summaries.

Each notification uses its validated file settings. The last observed valid settings determine the final summary.

## Process summaries

A summary is printed once at process shutdown after at least one observed input. Detailed mode includes the number of observed file-processing events, elapsed time since the first observed file, derived throughput, and process exit code. Zero elapsed time reports zero throughput instead of inventing a rate.

The success message follows a zero process exit code. It does not imply that Stylelint reported no warnings. No problem totals are inferred.

## Terminal behavior

In an interactive terminal, each file replaces the previous progress block, including the filename continuation row. Long paths wrap to the terminal width; exceptionally tall blocks are limited to the visible terminal height. Frames advance with file events, with no animation timer. Redirected output uses plain lines without frames, color, or cursor controls.

The renderer checks terminal dimensions and Node stream write counters before clearing its previous rows. A resize or intervening output on either process stream starts a fresh block, preserving formatter reports and messages between API calls. If terminal dimensions or write counters are unavailable, output uses complete lines. The plugin never patches process streams.

The terminal palette matches ESLint File Progress: cyan spinner frames and a bold cyan plugin label; dim status text, separators, and continuation arrows; directory names cycling through blue, cyan, green, magenta, and yellow; and a green filename with its stem emphasized. Summary labels are dim, metric values are yellow, and exit status uses green or red. A blank line separates the process summary from preceding output.

The display options and seven presets follow the ESLint counterpart. Stylelint retains its own lifecycle contract: frames advance on file events, summaries describe observed files and process timing, and no problem counts are inferred from the exit code.

Throttling limits displayed paths, not observed counts. Compact mode emits one generic activity notice. `ttyOnly` suppresses both progress and summaries when the selected stream is not a terminal, including when `showSummaryWhenHidden` is enabled.
