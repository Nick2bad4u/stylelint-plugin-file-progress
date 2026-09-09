# stylelint-plugin-file-progress

<p align="center">
  <img src="https://raw.githubusercontent.com/Nick2bad4u/stylelint-plugin-file-progress/main/docs/docusaurus/static/img/logo.svg" alt="Stylelint File Progress terminal logo" width="112" height="112" />
</p>

<p align="center"><strong>See the stylesheet behind the wait.</strong><br />Live filenames and configurable process summaries for Stylelint.</p>

<!-- badges:start -->

[![Latest npm version.](https://flat.badgen.net/npm/v/stylelint-plugin-file-progress?color=0E7490)](https://www.npmjs.com/package/stylelint-plugin-file-progress) [![Monthly npm downloads.](https://flat.badgen.net/npm/dm/stylelint-plugin-file-progress?color=BE185D)](https://www.npmjs.com/package/stylelint-plugin-file-progress) [![Supported Node.js versions.](https://flat.badgen.net/npm/node/stylelint-plugin-file-progress?color=4D7C0F)](https://www.npmjs.com/package/stylelint-plugin-file-progress) [![Bundled TypeScript declarations.](https://flat.badgen.net/npm/types/stylelint-plugin-file-progress?color=6D28D9)](https://www.npmjs.com/package/stylelint-plugin-file-progress) [![Latest GitHub release.](https://flat.badgen.net/github/release/Nick2bad4u/stylelint-plugin-file-progress?color=0F766E)](https://github.com/Nick2bad4u/stylelint-plugin-file-progress/releases) [![Codecov coverage.](https://flat.badgen.net/codecov/github/Nick2bad4u/stylelint-plugin-file-progress)](https://codecov.io/gh/Nick2bad4u/stylelint-plugin-file-progress) [![GitHub Actions checks on main.](https://flat.badgen.net/github/checks/Nick2bad4u/stylelint-plugin-file-progress/main)](https://github.com/Nick2bad4u/stylelint-plugin-file-progress/actions) [![GitHub stars.](https://flat.badgen.net/github/stars/Nick2bad4u/stylelint-plugin-file-progress?color=B45309)](https://github.com/Nick2bad4u/stylelint-plugin-file-progress/stargazers) [![MIT license.](https://flat.badgen.net/npm/license/stylelint-plugin-file-progress?color=4338CA)](https://github.com/Nick2bad4u/stylelint-plugin-file-progress/blob/main/LICENSE)

<!-- badges:end -->

<p align="center">
  <a href="https://nick2bad4u.github.io/stylelint-plugin-file-progress/">Documentation</a> ·
  <a href="https://nick2bad4u.github.io/stylelint-plugin-file-progress/getting-started">Getting started</a> ·
  <a href="https://nick2bad4u.github.io/stylelint-plugin-file-progress/presets">Presets</a> ·
  <a href="https://nick2bad4u.github.io/stylelint-plugin-file-progress/demos">Terminal demos</a> ·
  <a href="https://nick2bad4u.github.io/stylelint-plugin-file-progress/activate">Rule & options</a>
</p>

## A little clarity for every lint run

- **Native Stylelint integration.** One observational rule that leaves CSS, fixes, and diagnostics intact.
- **Output that fits your workflow.** File, compact, and summary modes, with presets for CI and interactive terminals.
- **Useful process summaries.** Observed file counts, elapsed time, throughput, and exit-code appearance.
- **Your terminal, your preferences.** Progress updates in place, with colored paths, spinner frames, marks, messages, streams, and display thresholds.
- **Typed and portable.** ESM and CommonJS exports, TypeScript declarations, and seven configuration subpaths.

![Colored per-file progress](https://raw.githubusercontent.com/Nick2bad4u/stylelint-plugin-file-progress/main/docs/docusaurus/static/demos/presets/recommended.gif)

<details>
<summary>Watch the detailed process summary</summary>

![Detailed process summary](https://raw.githubusercontent.com/Nick2bad4u/stylelint-plugin-file-progress/main/docs/docusaurus/static/demos/presets/recommended-detailed.gif)

</details>

[Explore every preset and option demo](https://nick2bad4u.github.io/stylelint-plugin-file-progress/demos). These reproducible recordings use the actual display controller; their timings illustrate process metrics.

## Contents

- [Quick start](#quick-start)
- [Choose a preset](#choose-a-preset)
- [Customize the display](#customize-the-display)
- [Rule reference](#rule-reference)
- [Compatibility and metrics](#compatibility-and-metrics)
- [Explore the project](#explore-the-project)
- [Contributing and attribution](#contributing-and-attribution)

## Quick start

```sh
npm install --save-dev stylelint stylelint-plugin-file-progress
```

Add the preset after your existing shared configs in `stylelint.config.mjs`:

```js
export default {
 extends: [
  // Keep your existing shared configs above this entry.
  "stylelint-plugin-file-progress/configs/recommended",
 ],
};
```

Then run Stylelint as usual:

```sh
npx stylelint "src/**/*.css"
```

The preset supplies progress output; keep your existing Stylelint rules or shared config for CSS diagnostics. See the [setup guide](https://nick2bad4u.github.io/stylelint-plugin-file-progress/getting-started) for CommonJS and formatter examples.

## Choose a preset

Every preset enables `file-progress/activate`. Use the exact subpath `stylelint-plugin-file-progress/configs/<preset>` in your `extends` array.

<!-- presets:start -->

| Preset                                                                                                                      | Best for                    | Behavior                                                             |
| --------------------------------------------------------------------------------------------------------------------------- | --------------------------- | -------------------------------------------------------------------- |
| [🟢 recommended](https://nick2bad4u.github.io/stylelint-plugin-file-progress/presets/recommended)                           | Follow each stylesheet      | Show each file using the default display options.                    |
| [🔵 recommended-ci](https://nick2bad4u.github.io/stylelint-plugin-file-progress/presets/recommended-ci)                     | Keep CI logs quiet          | Hide all plugin output when CI is exactly true.                      |
| [🟣 recommended-ci-detailed](https://nick2bad4u.github.io/stylelint-plugin-file-progress/presets/recommended-ci-detailed)   | Keep a summary in CI        | Hide live output in CI while retaining the detailed process summary. |
| [🟡 recommended-compact](https://nick2bad4u.github.io/stylelint-plugin-file-progress/presets/recommended-compact)           | Show activity without paths | Announce generic activity once, without showing filenames.           |
| [🟠 recommended-detailed](https://nick2bad4u.github.io/stylelint-plugin-file-progress/presets/recommended-detailed)         | See process-wide metrics    | Show filenames and the detailed process summary.                     |
| [🩷 recommended-summary-only](https://nick2bad4u.github.io/stylelint-plugin-file-progress/presets/recommended-summary-only) | Read the final summary      | Show only the final process summary.                                 |
| [🟦 recommended-tty](https://nick2bad4u.github.io/stylelint-plugin-file-progress/presets/recommended-tty)                   | Respect redirected output   | Show output only when stderr is an interactive terminal.             |

<!-- presets:end -->

[Compare configurations and watch their demos](https://nick2bad4u.github.io/stylelint-plugin-file-progress/presets). The CI presets check whether `CI` is exactly `true`; outside CI they show ordinary progress.

## Customize the display

Override the rule's secondary options after extending a preset:

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

Set `"file-progress/activate": null` to disable progress, including when another shared config enables it.

## Rule reference

| Rule                                             | Purpose                                              |
| ------------------------------------------------ | ---------------------------------------------------- |
| [file-progress/activate](docs/rules/activate.md) | Observe files without changing CSS or lint findings. |

The [complete option reference](https://nick2bad4u.github.io/stylelint-plugin-file-progress/activate#options) covers display modes, paths, streams, marks, spinner frames, throttling, and summary settings. The [API reference](https://nick2bad4u.github.io/stylelint-plugin-file-progress/developer/api) documents the public types and exports.

## Compatibility and metrics

| Surface                 | Support                                                                     |
| ----------------------- | --------------------------------------------------------------------------- |
| Node.js                 | 22 and later.                                                               |
| Stylelint               | `^16.0.0` or `^17.14.0`.                                                    |
| Module formats          | ESM and CommonJS, with TypeScript declarations.                             |
| CommonJS + Stylelint 17 | Node 22.12+ for synchronous ESM loading.                                    |
| Default stream          | stderr; stdout remains intact.                                              |
| Custom syntaxes         | One notice per processing result, including inputs with multiple CSS roots. |

**A filename event means the stylesheet reached the progress rule.** Ignored inputs, unchanged cached inputs, and parsing failures before rule execution are not observed. Counts describe observed file-processing events, including repeated lint calls.

**Summaries span the process lifetime.** They do not provide exact total inputs, percentages, ETA, problem counts, or per-file completion times. The success/failure appearance follows the process exit code.

Stylelint's normal CLI report also uses stderr. For an intact machine-readable report:

```sh
npx stylelint "src/**/*.css" --formatter json --output-file report.json
```

Read [compatibility and metric boundaries](https://nick2bad4u.github.io/stylelint-plugin-file-progress/compatibility) or [troubleshooting](https://nick2bad4u.github.io/stylelint-plugin-file-progress/troubleshooting) for cache behavior, watch processes, terminal output, and missing summaries.

## Explore the project

| Resource                                                                                                      | Purpose                                                     |
| ------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| [Documentation](https://nick2bad4u.github.io/stylelint-plugin-file-progress/)                                 | Setup, presets, demos, and reference guides.                |
| [Stylelint Inspector](https://nick2bad4u.github.io/stylelint-plugin-file-progress/stylelint-inspector/)       | Explore the repository's resolved Stylelint configuration.  |
| [ESLint Inspector](https://nick2bad4u.github.io/stylelint-plugin-file-progress/eslint-inspector/)             | Explore the repository's TypeScript and tooling lint setup. |
| [Releases](https://github.com/Nick2bad4u/stylelint-plugin-file-progress/releases) · [Changelog](CHANGELOG.md) | Published artifacts and full change history.                |
| [Issues](https://github.com/Nick2bad4u/stylelint-plugin-file-progress/issues) · [Support](SUPPORT.md)         | Bug reports, questions, and feedback.                       |
| [ESLint File Progress](https://nick2bad4u.github.io/eslint-plugin-file-progress-2/)                           | The ESLint counterpart and inspiration.                     |
| [ESLint Typefest](https://nick2bad4u.github.io/eslint-plugin-typefest/)                                       | TypeScript-focused rules for type-fest and ts-extras.       |
| [Shared Stylelint config](https://github.com/Nick2bad4u/stylelint-config-nick2bad4u)                          | The shared configuration used by this project.              |

## Contributing and attribution

See [CONTRIBUTING.md](CONTRIBUTING.md) for development, documentation generation, and the full verification gate. Report security concerns using [SECURITY.md](SECURITY.md).

Created by [Nick2bad4u](https://github.com/Nick2bad4u). Licensed under [MIT](LICENSE). See [NOTICE](NOTICE) for attribution to the ESLint progress project.
