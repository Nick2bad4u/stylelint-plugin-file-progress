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

## Process summaries

A summary is printed once at process shutdown after at least one observed input. Detailed mode includes the number of observed file-processing events, elapsed time since the first observed file, derived throughput, and process exit code. Zero elapsed time reports zero throughput instead of inventing a rate.

The success message follows a zero process exit code. It does not imply that Stylelint reported no warnings. No problem totals are inferred.

## Terminal behavior

Terminal output advances the chosen spinner frame when a file is displayed, then ends the line. No background animation or active timer runs to interfere with Stylelint's report. Redirected output uses plain lines without frames or color.

Throttling limits displayed paths, not observed counts. Compact mode emits one generic activity notice. `ttyOnly` suppresses both progress and summaries when the selected stream is not a terminal, including when `showSummaryWhenHidden` is enabled.
