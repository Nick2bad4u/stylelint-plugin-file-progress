# Compatibility and metric boundaries

## Supported runtimes

The published plugin supports Node.js 22 and later and Stylelint `^16.0.0 || ^17.14.0`. Its package exports include native ESM, CommonJS, TypeScript declarations, and every preset subpath.

Development uses the pinned Node version and npm 12.0.2. Development-tool requirements are separate from the plugin's runtime floor.

## What a file event means

An event means the progress rule received the parsed stylesheet. It does not measure the start or completion of every rule on that file. Files skipped by Stylelint's cache or ignore handling do not produce events. A parse failure before the rule runs cannot produce a filename notice.

Custom syntaxes containing multiple CSS roots share a processing result and produce one notification for the physical input. Repeated lint calls create new events, even for a previously observed path. stdin uses the supplied filename when available and otherwise displays `<input>`.

## Long-lived processes

The summary spans the process lifetime after the first observed file. Editor integrations and watch processes can therefore accumulate multiple lint runs. The plugin provides no session API, percentage, ETA, or per-file completion timer. Disable progress in integrations that do not want terminal output.

## Other output

The default stderr stream keeps stdout intact, including CSS emitted when fixing stdin. Stylelint's normal CLI diagnostic report also uses stderr; use `--output-file report.json --formatter json` when consuming a machine-readable report. Explicitly selecting stdout mixes progress into that stream. Each display ends with a newline, so the plugin does not patch streams, replace formatters, or leave an animation running over the final report.

Windows terminals use Node's console-aware output for Unicode filenames, spinner frames, marks, and ANSI colors, including the shutdown summary. The plugin does not change the console code page, terminal width, or the linter's color settings. Stylelint's string formatter wraps diagnostics to the terminal width; the same wrapping applies with progress disabled.

The last valid file options determine the summary settings. The process exit code controls its success/failure appearance; applications using the Node API must manage their own exit status.

## Node and module formats

The Node 22.0.0 minimum is verified with Stylelint 16 in both ESM and CommonJS. Stylelint 17 is ESM-only: CommonJS consumers need Node 22.12.0 or later (or another Node version with synchronous ESM loading). The development toolchain uses the stricter engines declared in `devEngines`.

Worker threads keep independent progress state and emit their own shutdown summaries. When workers capture stdout or stderr, progress uses that captured stream. If a watched working directory disappears, filenames are displayed as supplied.

TypeScript consumers should use `node16`, `nodenext`, or `bundler` module resolution with Stylelint 17, whose types are exposed through package exports. Legacy `node10` resolution is additionally tested with Stylelint 16 and the CommonJS entrypoints.
