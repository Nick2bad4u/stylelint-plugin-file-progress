# stylelint-plugin-file-progress

Live filenames and configurable process summaries for Stylelint.

[![CI](https://github.com/Nick2bad4u/stylelint-plugin-file-progress/actions/workflows/ci.yml/badge.svg)](https://github.com/Nick2bad4u/stylelint-plugin-file-progress/actions/workflows/ci.yml)

[Documentation](https://nick2bad4u.github.io/stylelint-plugin-file-progress/) · [CI](https://github.com/Nick2bad4u/stylelint-plugin-file-progress/actions/workflows/ci.yml)

![Terminal progress demo](docs/docusaurus/static/img/terminal.svg)

## Quick start

The initial npm release is being prepared. Build and install a repository tarball with `npm pack` until publication.

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
