# Contributing

Use the Node version in `.node-version` and npm 12.0.2. Install dependencies with `npm ci`; the committed lifecycle allowlist is authoritative.

## Development

Run `npm run build`, `npm run typecheck`, and `npm test` while changing the runtime. Source is strict TypeScript; generated ESM, CommonJS, declarations, and preset modules live in `dist`.

Run `npm run lint:all` for shared-config checks. Use `npm run lint:fix` and `npm run lint:prettier:fix` only when intentionally rewriting files. Native actionlint is required for workflow checks; Gitleaks and Lychee support the additional security and link commands.

Run `npm run sync:rules:write` and `npm run docs:demos:write` when changing options or presets. Their check counterparts compare output without modifying tracked files. Run `npm run docs:build` to compile the Docusaurus site and both config inspectors.

## Validation

`npm run release:verify` runs the full local gate, including packed consumers on every supported Stylelint boundary. It does not publish. CI also exercises Linux, Windows, and macOS; minimum Node consumers are tested separately from the development install.

Use a `type/description` branch and the emoji/bracket commit convention in `.github/agent-commit-message-instructions.md`. Changes should include evidence that CSS, diagnostics, and exit codes remain unchanged.

## Release preparation

Keep the package version and exported metadata synchronized. Generate changelog history using the shared git-cliff configuration. The release workflow accepts an already committed version and protects against duplicate npm publication. Publication is a separately authorized operation.

## Dependency overrides

The docs toolchain currently pins vulnerable transitive ranges. Overrides select patched `serialize-javascript` and `qs`, and the CommonJS-compatible `uuid` 11 line used by SockJS only for `v4()`. Recheck these overrides when Docusaurus updates its dependencies. `image-size` currently has no published fix for its ICNS/JXL/HEIF parser advisories; docs builds process repository-owned assets, and this outstanding upstream advisory must remain visible in security reports.
