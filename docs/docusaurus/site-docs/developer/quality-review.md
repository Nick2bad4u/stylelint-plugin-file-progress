# Version 1.0.0 quality review

This review covers the native rule, process lifecycle, package exports and declarations, tests, documentation, shared tooling, and GitHub release automation. The comparison was made on September 6, 2026 against these repository snapshots:

| Reference                                                                                                                                                                 | Role in this package                                                                              |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| [stylelint-plugin-font at c9fe171](https://github.com/Nick2bad4u/stylelint-plugin-font/tree/c9fe17123dedecc7cbdd12dcd632cccc0dfa8329)                                     | Stylelint API, repository structure, shared configurations, CI, and documentation infrastructure. |
| [eslint-plugin-file-progress-2 at v5.1.9](https://github.com/Nick2bad4u/eslint-plugin-file-progress-2/tree/v5.1.9)                                                        | Display options, seven presets, process summaries, and colored GIF/cast presentations.            |
| [stylelint-plugin-css-performance-budget at 73c865b](https://github.com/Nick2bad4u/stylelint-plugin-css-performance-budget/tree/73c865b45bb1f2521b7dcce4e6f52f849fb80419) | Additional comparison of package, compatibility, and release conventions.                         |

## Findings addressed

| Finding                                                              | Change and verification                                                                                                                                                                                                |
| -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Seven public TypeDoc members lacked comments.                        | Document metadata fields, the rule registry member, and plugin properties. Every docs build now requires all 40 public reflections to be documented.                                                                   |
| The original demonstration was a plain static image.                 | Add 31 colored GIFs with deterministic terminal casts: seven presets and 24 option scenarios covering every setting and spinner style. Check cast contents, GIF hashes, inventory, and the static poster.              |
| README generation would remove the maintainer's badge row.           | Preserve the badge identities, labels, colors, order, and links in the generator. Replace obsolete pre-publication installation guidance.                                                                              |
| Accepted null secondary settings could crash linting.                | Normalize `[true, null]` to the defaults and exercise it through Stylelint. A primary `null` still disables the rule.                                                                                                  |
| Multiple roots could repeat invalid-option diagnostics.              | Deduplicate validation by processing-result identity across module formats. Test an HTML document containing two style roots.                                                                                          |
| Numeric descriptor writes bypassed captured worker output.           | Use worker streams inside workers and release temporary error listeners after completion or failure. Real subprocess tests capture both stdout and stderr, including the single shutdown summary.                      |
| Removing a watched working directory could abort progress reporting. | Fall back to the supplied filename when the working directory cannot be resolved.                                                                                                                                      |
| Legacy TypeScript mappings did not match direct CommonJS exports.    | Point legacy package and preset resolution to CommonJS declarations; test preset properties and public option types with Stylelint 16 legacy resolution and strict NodeNext consumers across both Stylelint majors.    |
| Standalone generated-content checks could use stale builds.          | Build current source before all demo and synchronization commands, and fail if the generated option-table markers are missing.                                                                                         |
| Docusaurus inherited vulnerable image parsers.                       | Use the exact, reviewed `image-size-next@2.1.1` fork only beneath Docusaurus. Exercise malformed ICNS/JXL/HEIF files in bounded subprocesses and valid SVG/GIF/PNG dimensions. Keep the full dependency review active. |
| A post-publication GitHub API failure could strand a release.        | Move npm artifact/provenance verification and GitHub release creation into a separately retryable job. Rerun failed jobs to finish a successful publication without publishing again.                                  |
| A newer push could cancel an already validated Pages deployment.     | Let an active Pages deployment finish while subsequent runs wait.                                                                                                                                                      |

## Comparison with the plugin family

The package uses the same published shared configurations, strict TypeScript approach, npm 12 lifecycle allowlist, Node version files, dual module formats, inspector integrations, and owner-controlled reusable workflows as the maintained plugin family. It adds explicit checks for complete API documentation, generated demos, and legacy CommonJS consumers where the original progress implementation needed stronger guarantees.

The runtime remains a native Stylelint rule with no ESLint dependency, CLI wrapper, or public session API. The smaller rule count does not justify importing unrelated rule benchmarks, Electron tooling, or application database commands from a sibling repository. Verification instead concentrates on observational behavior: unchanged CSS, diagnostics, formatter output, fixes, and exit status.

Terminal frames advance when files are observed, with complete lines and no animation timers. This adapts the ESLint presentation to Stylelint's formatter and lifecycle. The documentation describes this behavior directly rather than presenting a timer-driven animation that the plugin does not produce.

## Release gates

The main branch requires all three operating-system test jobs, the combined quality/documentation/package job, and CodeQL analysis before merging. Dependabot updates to CodeQL actions are grouped so `init` and `analyze` stay on the same release. Manual CI and CodeQL triggers allow validation of commits created by automation that cannot trigger a new push workflow with `GITHUB_TOKEN`.

`npm run release:verify` checks source types, all shared-config linters, runtime coverage, malformed documentation images, generated content, the documentation application and public API, package exports, and clean package consumers. CI also runs coverage on Linux, Windows, and macOS, then separately verifies Node 22.0.0 consumers. Each runtime coverage threshold remains 90%.

Consumer checks install the packed artifact with exact Stylelint 16.0.0, current 16.x, exact 17.14.0, and current 17.x. Both ESM and CommonJS entrypoints and all seven preset subpaths are exercised. Legacy TypeScript resolution is tested with Stylelint 16; Stylelint 17 exposes its own types only through modern package exports. CommonJS with Stylelint 17 requires Node 22.12 or newer because of Stylelint's ESM loading requirements.

Release jobs verify the committed version, main-branch ancestry, tag identity, and absence of an existing npm version. Publication uses GitHub OIDC and npm provenance for the exact verified tarball. A subsequent job compares npm's integrity with that tarball and requires its provenance attestation before creating the GitHub Release.

The tarball publish command uses an explicit `./` prefix, as npm 12 otherwise interprets `release/package.tgz` as GitHub shorthand. The portable `npm run release:check-tarball` command requires exactly one artifact in `release/` and exercises its local tarball argument in a dry run before the publishing job starts. Provenance is disabled only for that non-uploading dry run; the publishing job requires it.

## Maintenance boundaries

Stylelint Config Inspector 2.3.5 restores three root-relative icon URLs during hydration even when built with `--base`. A scoped post-build correction fixes only those icon link values in its generated JavaScript. Documentation checks reject the broken URLs and require the icon files. Remove this correction when the inspector fixes its static build.

The documentation parser override is a maintained fork, not an upstream `image-size` release. Its source delta, exact version, license, API compatibility, and integrity are documented in [contributing](./contributing.md). Reassess it when Docusaurus adopts a patched parser; it is not shipped as a plugin runtime dependency.

Counts cover observed rule-processing events. Cache skips and parse failures before rule execution are absent; throttling can hide live notifications while counts continue. Long-lived applications aggregate until shutdown. Worker threads have independent JavaScript state and summaries, with output sent through their selected worker stream. No display claims an exact input total, ETA, problem count, or individual-file completion time.
