# Working on Stylelint File Progress

This repository contains a native Stylelint plugin, not an ESLint rule or a CLI wrapper. Source lives in `src`, tests in `test`, and the Docusaurus workspace in `docs/docusaurus`.

- Use npm 12.0.2 and the Node version in `.node-version`. Install with `npm ci`; keep the dependency-specific lifecycle allowlist portable.
- Follow the published `nick2bad4u` shared configurations. Make narrow, explained overrides only when a rule conflicts with a demonstrated platform contract.
- Use strict TypeScript and ESM source. `npm run build` produces the ESM/CommonJS package and declarations; do not hand-edit `dist`.
- Preserve `file-progress/activate`, all seven configuration subpaths, and the public option types. Validate changes through real Stylelint and packed consumers.
- Progress is observational: never modify CSS, change diagnostics, infer problem totals from an exit code, or patch process streams. Deduplicate by processing-result identity.
- Imports must remain quiet. Summaries are process-scoped, and progress must not leave active timers or overwrite formatter output.
- Use `npm run sync:rules:write` and `npm run docs:demos:write` for generated content. Their check counterparts must not rewrite tracked files.
- Run `npm run release:verify` before release preparation. Do not weaken lint or coverage gates to make checks pass.
- Branch names use `type/description`; commits follow `.github/agent-commit-message-instructions.md`. Use subagents for independent substantial work when available.
- Keep owned reusable workflows at `@main`; pin third-party actions to verified full SHAs with version comments. Publication requires explicit user authorization.
