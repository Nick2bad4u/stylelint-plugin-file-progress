# Contributing

Use the Node version in `.node-version` and npm 12.0.2. Install dependencies with `npm ci`; the committed lifecycle allowlist is authoritative.

## Development

Run `npm run build`, `npm run typecheck`, and `npm test` while changing the runtime. Source is strict TypeScript; generated ESM, CommonJS, declarations, and preset modules live in `dist`.

Run `npm run lint:all` for shared-config checks. Use `npm run lint:fix` and `npm run lint:prettier:fix` only when intentionally rewriting files. Native actionlint is required for workflow checks; Gitleaks and Lychee support the additional security and link commands.

Run `npm run sync:rules:write` and `npm run docs:demos:write` when changing options or presets. These commands build current source first; GIF regeneration requires [agg 1.9.0](https://github.com/asciinema/agg/releases/tag/v1.9.0). Their check counterparts compare output without modifying tracked files. Run `npm run docs:build` to compile the Docusaurus site and both config inspectors. Every public API reflection must have TSDoc; the documentation build enforces 100% coverage.

## Documentation layout

The landing page lives in `docs/docusaurus/src/pages/index.tsx`; shared styles and the colored sidebar palette live in `src/css/custom.css` within that workspace. `sidebars.ts` groups the guides, display reference, presets, development docs, and ecosystem links. Keep the existing `/activate`, `/presets`, `/demos`, and preset subpaths stable when reorganizing navigation.

Edit README prose directly. `npm run sync:rules:write` updates only its marked badge and preset sections. The same command generates `docs/docusaurus/src/data/project.json`, the preset pages, and the demo gallery from public exports and `scripts/docs-catalog.mjs`. Do not hand-edit that JSON or generated pages. Edit the canonical rule reference in `docs/rules/activate.md` before syncing its site copy.

Local search indexes the production build, including guides and API docs. Validate it with `npm run docs:build`, then `npm run docs:serve`. Check the homepage, search results, sidebar navigation, and both inspectors at the `/stylelint-plugin-file-progress/` base path in light and dark mode and at a mobile width. The homepage uses a static terminal poster until the reader opens its animated recording.

The public API reference is generated under `site-docs/developer/api`; its edit link is hidden because changes belong in source TSDoc. Rebuild it with `npm run docs:api`.

## Toolchain maintenance

`npm run sync:node-version-files` synchronizes `.node-version` and `.nvmrc` with the running Node version; pass `--version` to the script directly for an explicit version. Its `:check` counterpart only validates the files. `npm run sync:npm-version` keeps the exact npm development-engine version aligned with `packageManager`; its `:check` counterpart does not write.

`npm run update-deps` uses the shared dependency updater and normal npm resolution, then synchronizes toolchain metadata. Resolve peer incompatibilities before installing updates. The published `vitest-config-nick2bad4u@1.0.0` supports Vitest 4, so upgrade the shared configuration before adopting Vitest 5. `npm run update-actions` retains SHA-style action references; review and verify the resulting commits before pushing.

## Validation

`npm run release:verify` runs the full local gate, including packed consumers on every supported Stylelint boundary. It does not publish. CI also exercises Linux, Windows, and macOS; minimum Node consumers are tested separately from the development install.

Use a `type/description` branch and the emoji/bracket commit convention in `.github/agent-commit-message-instructions.md`. Changes should include evidence that CSS, diagnostics, and exit codes remain unchanged.

## Release preparation

Keep the package version and exported metadata synchronized. Generate changelog history using the shared git-cliff configuration. The release workflow accepts an already committed version and protects against duplicate npm publication. Publication is a separately authorized operation. Configure npm trusted publishing for this repository, workflow `release.yml`, and environment `npm` when binding an environment. Dispatch the committed version from `main`; do not pass a token or disable provenance. If npm publication succeeds but the final GitHub Release job fails, rerun only failed jobs so artifact verification and release creation resume without repeating publication.

## Dependency overrides

The docs toolchain currently pins vulnerable transitive ranges. Overrides select patched `serialize-javascript` and `qs`, and the CommonJS-compatible `uuid` 11 line used by SockJS only for `v4()`. Recheck these overrides when Docusaurus updates its dependencies. Docusaurus alone receives `image-size-next@2.1.1` as an exact npm alias for `image-size`. The [reviewed fork delta](https://github.com/lcf2212dev/image-size-next/compare/v2.0.2...v2.1.1) adds bounds and forward-progress checks for CVE-2025-71329 and CVE-2025-71330. It preserves the `imageSizeFromFile` API and MIT license, adds no runtime dependencies or install hooks, and is locked by tarball integrity. `npm run test:docs-images` exercises the actual Docusaurus-resolved parser against malformed ICNS/JXL/HEIF inputs in timeout-protected subprocesses and checks SVG/GIF/PNG dimensions. This override affects documentation builds only; remove it when Docusaurus adopts a maintained, patched parser.
