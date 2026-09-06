# stylelint-plugin-file-progress

Live filenames and configurable process summaries for Stylelint.

[![Project type: Stylelint%20plugin.](https://flat.badgen.net/static/type/Stylelint%20plugin/A21CAF)](https://github.com/Nick2bad4u/stylelint-plugin-file-progress) [![Latest npm version.](https://flat.badgen.net/npm/v/stylelint-plugin-file-progress?color=0E7490)](https://www.npmjs.com/package/stylelint-plugin-file-progress) [![Monthly npm downloads.](https://flat.badgen.net/npm/dm/stylelint-plugin-file-progress?color=BE185D)](https://www.npmjs.com/package/stylelint-plugin-file-progress) [![Supported Node.js versions.](https://flat.badgen.net/npm/node/stylelint-plugin-file-progress?color=4D7C0F)](https://www.npmjs.com/package/stylelint-plugin-file-progress) [![TypeScript declaration status.](https://flat.badgen.net/npm/types/stylelint-plugin-file-progress?color=6D28D9)](https://www.npmjs.com/package/stylelint-plugin-file-progress) [![Codecov coverage.](https://flat.badgen.net/codecov/github/Nick2bad4u/stylelint-plugin-file-progress/main)](https://codecov.io/gh/Nick2bad4u/stylelint-plugin-file-progress/branch/main) [![GitHub Actions checks on main.](https://flat.badgen.net/github/checks/Nick2bad4u/stylelint-plugin-file-progress/main)](https://github.com/Nick2bad4u/stylelint-plugin-file-progress/actions) [![NPM license.](https://flat.badgen.net/npm/license/stylelint-plugin-file-progress?color=4338CA)](https://github.com/Nick2bad4u/stylelint-plugin-file-progress/blob/main/LICENSE)

![Colored per-file progress](https://raw.githubusercontent.com/Nick2bad4u/stylelint-plugin-file-progress/main/docs/docusaurus/static/demos/presets/recommended.gif)

![Detailed process summary](https://raw.githubusercontent.com/Nick2bad4u/stylelint-plugin-file-progress/main/docs/docusaurus/static/demos/presets/recommended-detailed.gif)

[Documentation](https://nick2bad4u.github.io/stylelint-plugin-file-progress/) · [All preset and option demos](https://nick2bad4u.github.io/stylelint-plugin-file-progress/demos)

## Quick start

```sh
npm install --save-dev stylelint stylelint-plugin-file-progress
```

```js
export default {
 extends: ["stylelint-plugin-file-progress/configs/recommended"],
};
```

## Rule

| Rule                                             | Purpose                                              |
| ------------------------------------------------ | ---------------------------------------------------- |
| [file-progress/activate](docs/rules/activate.md) | Observe files without changing CSS or lint findings. |

## Presets

- `recommended`: Show each file using the default display options.
- `recommended-ci`: Hide all plugin output when CI is exactly true.
- `recommended-ci-detailed`: Hide live output in CI while retaining the detailed process summary.
- `recommended-compact`: Announce generic activity once, without showing filenames.
- `recommended-detailed`: Show filenames and the detailed process summary.
- `recommended-summary-only`: Show only the final process summary.
- `recommended-tty`: Show output only when stderr is an interactive terminal.

## Compatibility

Node.js 22+, Stylelint `^16.0.0 || ^17.14.0`, ESM and CommonJS. CommonJS with Stylelint 17 requires Node 22.12+ for synchronous ESM loading. Progress goes to stderr by default. Summaries measure observed file events over the process lifetime, not problem counts or exact per-file completion times.

See [contributing](CONTRIBUTING.md) for development and verification, and [NOTICE](NOTICE) for the ESLint progress project's attribution.
