<!-- markdownlint-disable -->
<!-- eslint-disable markdown/no-missing-label-refs -->

# 📜 Changelog

## ✨ What's Changed in v1.0.2

- <b>Commit Range: ➡️</b> [`v1.0.1...v1.0.2`](https://github.com/Nick2bad4u/stylelint-plugin-file-progress/compare/v1.0.1...v1.0.2 "View full commit range on GitHub")

### 🛠️ Bug Fixes

- [`cc3c9c8`](https://github.com/Nick2bad4u/stylelint-plugin-file-progress/commit/cc3c9c8af75b93e4e35befd049b8450529c74c23 "Diff: 2 files, +2 | -2") — 🐛 [fix] Round fractional milliseconds in short summaries&nbsp;<sub><em>(2&nbsp;files,&nbsp;+2,&nbsp;-2)</em></sub>

- [`59e0353`](https://github.com/Nick2bad4u/stylelint-plugin-file-progress/commit/59e0353b9502dbb15f227d2b8c6218f03a232c87 "Diff: 1 file, +1 | -1") — 🐛 [fix] Synchronize exported metadata with version 1.0.2&nbsp;<sub><em>(1&nbsp;file,&nbsp;+1,&nbsp;-1)</em></sub>

- [`738b7c7`](https://github.com/Nick2bad4u/stylelint-plugin-file-progress/commit/738b7c77981b935e410030ded956386497200bd9 "Diff: 66 files, +730 | -293") — 🐛 [fix] Match ESLint progress colors and terminal formatting&nbsp;<sub><em>(66&nbsp;files,&nbsp;+730,&nbsp;-293)</em></sub>
  - 🐛 [fix] Dim the activity text, marks, continuation arrows, and path separators; cycle bold directory colors and distinguish green filename stems from extensions.
    🐛 [fix] Color all spinner frames cyan and align summary marks, emphasis, spacing, duration units, labels, and metric colors while preserving observed-file and process-exit semantics.
    🧪 [test] Cover ANSI output, directory palette cycling, exact Windows and POSIX path text, terminal-control escaping, summaries, and all five spinner styles.
    📝 [docs] Regenerate terminal recordings and GIFs, render ANSI weight and dimming in the static poster, and explain presentation parity and Stylelint lifecycle boundaries.
    👷 [build] Retain native RegExp splitting for path separators because the shared ts-extras stringSplit helper accepts only string separators.

### 📝 Documentation

- [`ca9266d`](https://github.com/Nick2bad4u/stylelint-plugin-file-progress/commit/ca9266dd5d96a641873cf323717f17fa3188363e "Diff: 36 files, +3734 | -129") — 📝 [docs] Polish the site, README, and maintenance tooling (#13)&nbsp;<sub><em>(36&nbsp;files,&nbsp;+3734,&nbsp;-129)</em></sub>
  - 📝 [docs] Add a branded landing page, shared badges and preset metadata, colored sidebar groups, local search, linked guides, terminal demos, and a refreshed README.
  - 🐛 [fix] Improve light and dark contrast, make embedded inspector navigation consistent, validate the generated API route, and generate API docs before local startup.
  - 🧹 [chore] Integrate compatible maintenance dependencies and verified action pins, preserve the full lint gate, validate Node development ranges, synchronize npm workspace pins, and prepare dependency updates without running unreviewed lifecycle scripts.
  - 🧪 [test] Validate 63 tests, 31 demos, complete public API documentation, packed Stylelint 16/17 consumers, exact Node 22.0.0 compatibility, 16 toolchain CLI scenarios, a lifecycle update fixture, and light/dark browser accessibility checks.

### 🧹 Chores

- [`f98136c`](https://github.com/Nick2bad4u/stylelint-plugin-file-progress/commit/f98136c7ec1ecf3b1165a6326bcc5eedbbcaf08d "Diff: 3 files, +34 | -8") — 🧹 [chore] Prepare the 1.0.2 progress presentation release&nbsp;<sub><em>(3&nbsp;files,&nbsp;+34,&nbsp;-8)</em></sub>

> [!NOTE]
> **Release comparison**: https://github.com/Nick2bad4u/stylelint-plugin-file-progress/compare/v1.0.1...v1.0.2

## ✨ What's Changed in v1.0.1

- <b>Commit Range: ➡️</b> [`v1.0.0...v1.0.1`](https://github.com/Nick2bad4u/stylelint-plugin-file-progress/compare/v1.0.0...v1.0.1 "View full commit range on GitHub")

### 🛠️ Bug Fixes

- [`e141651`](https://github.com/Nick2bad4u/stylelint-plugin-file-progress/commit/e1416513611d9e214097c6a28fdc0501dd944ddd "Diff: 9 files, +194 | -18") — 🐛 [fix] Preserve Unicode and colors in Windows terminals (#12)&nbsp;<sub><em>(9&nbsp;files,&nbsp;+194,&nbsp;-18)</em></sub>
  - 🐛 [fix] Preserve Unicode and colors in Windows terminals
  - 🐛 [fix] Use Node console-aware streams for Windows TTY progress and shutdown summaries while retaining safe descriptor writes for redirected main-thread output.
  - 🧪 [test] Cover both Windows output streams and unchanged colored Stylelint diagnostics at narrow and wide terminal widths.
  - 📝 [docs] Document the console behavior and prepare the compatible 1.0.1 patch.
  - 📝 [docs] Record the complete 1.0.1 release history

### 🧹 Chores

- [`9edb490`](https://github.com/Nick2bad4u/stylelint-plugin-file-progress/commit/9edb4900fde609e03e08af88639aab5b71472f23 "Diff: 8 files, +470 | -314") — 🧹 [chore] Align shared tooling and adopt the upstream inspector fix (#11)&nbsp;<sub><em>(8&nbsp;files,&nbsp;+470,&nbsp;-314)</em></sub>
  - 🧹 [chore] Align repository tooling with shared validation configs
  - 👷 [build] Use the published Vitest and strict dual-module ATTW configs with compatible dependencies, preserve runtime coverage thresholds, and provide working lint, package, and explicit fix commands.
  - 🧹 [chore] Group dependency updates, scope actionlint and Node diagnostics to this repository, and retain a dependency-specific lifecycle allowlist without copied scanning exclusions.
  - 🐛 [fix] Activate build diagnostics and validate fresh package builds
  - 👷 [build] Load the repository Node configuration explicitly during development builds and build exports before standalone package-content checks.
  - 👷 [build] Adopt the upstream inspector base-path fix
  - 👷 [build] Update Stylelint Config Inspector to 2.3.6 and remove the temporary compiled-JavaScript asset correction and post-build hook.
  - 📝 [docs] Record the upstream runtime-base fix while retaining documentation checks for valid icon paths and files.
  - 👷 [build] Adopt the released Stylelint tooling integrations
  - 👷 [build] Use Inspector 2.3.7 with its startup and runtime icon fixes, and shared Stylelint config 3.0.0 so the repository enables progress through the shared preset.
  - 📝 [docs] Record the completed upstream browser fix without changing the progress plugin runtime or package version.

> [!NOTE]
> **Release comparison**: https://github.com/Nick2bad4u/stylelint-plugin-file-progress/compare/v1.0.0...v1.0.1

## ✨ What's Changed in v1.0.0

- <b>Commit Range: ➡️</b> [`175024c...v1.0.0`](https://github.com/Nick2bad4u/stylelint-plugin-file-progress/compare/175024cfff005672b09765769f41384681985edb...v1.0.0 "View full commit range on GitHub")

### ✨ Features

- [`b5232a6`](https://github.com/Nick2bad4u/stylelint-plugin-file-progress/commit/b5232a6cea6c57645956c76834558cb783073714 "Diff: 100 files, +2048 | -111") — ✨ [feat] Prepare 1.0.0 progress reporting and colored documentation&nbsp;<sub><em>(100&nbsp;files,&nbsp;+2048,&nbsp;-111)</em></sub>
  - 🐛 [fix] Accept null secondary settings, deduplicate multi-root validation, preserve worker stream capture, and tolerate removed working directories
    🐛 [fix] Align legacy CommonJS declarations and extend clean consumer validation across supported Stylelint releases
    📝 [docs] Document every public API member, preserve the README badges, and add 31 colored GIF and cast demonstrations with integrity checks
    👷 [build] Replace the vulnerable Docusaurus image parser with a reviewed scoped fork and add bounded parser regressions
    👷 [ci] Enforce API and demo checks, prepare trusted provenance publication, and make GitHub release completion independently retryable
    🧪 [test] Verify 59 runtime and CLI tests, 100 percent statement/line/function coverage, and 95.28 percent branch coverage

- [`f9437dc`](https://github.com/Nick2bad4u/stylelint-plugin-file-progress/commit/f9437dc1214f3ee5cd5576d87f20c6a580c6ff54 "Diff: 89 files, +47571 | -2") — ✨ [feat] Add native Stylelint file progress and plugin infrastructure&nbsp;<sub><em>(89&nbsp;files,&nbsp;+47571,&nbsp;-2)</em></sub>
  - Implement the observational activate rule, seven presets, dual module exports, option types, and process shutdown summaries. Add strict shared tooling, isolated consumer tests, Docusaurus documentation, inspectors, and CI/release automation without publishing.

### 🛠️ Bug Fixes

- [`f82d8ed`](https://github.com/Nick2bad4u/stylelint-plugin-file-progress/commit/f82d8ed6e7107868123e2d364b9ef0d1e6b14412 "Diff: 2 files, +8 | -1") — 🐛 [fix] Publish the verified tarball as an explicit local npm path&nbsp;<sub><em>(2&nbsp;files,&nbsp;+8,&nbsp;-1)</em></sub>
  - 🐛 [fix] Prefix the tarball argument with ./ so npm 12 does not parse it as GitHub shorthand.
  - 🧪 [test] Dry-run the packed artifact before publication and retain required provenance in the publishing job.

- [`5389572`](https://github.com/Nick2bad4u/stylelint-plugin-file-progress/commit/5389572fb77d52cb6469924b899d0bb7bd07c93a "Diff: 4 files, +32 | -1") — 🐛 [fix] Resolve inspector icons under the deployed Pages path&nbsp;<sub><em>(4&nbsp;files,&nbsp;+32,&nbsp;-1)</em></sub>
  - 🐛 [fix] Correct the Stylelint inspector 2.3.5 hydrated icon links after its static build.
  - 🧪 [test] Verify the icon assets exist and reject root-relative icon links in documentation checks.
  - 📝 [docs] Record the scoped upstream compatibility correction and its removal condition.

- [`93a8243`](https://github.com/Nick2bad4u/stylelint-plugin-file-progress/commit/93a82431c9d9fbd7a2eb250e326b0bd5afad252a "Diff: 7 files, +95 | -10") — 🐛 [fix] Share process state and harden terminal and workflow boundaries&nbsp;<sub><em>(7&nbsp;files,&nbsp;+95,&nbsp;-10)</em></sub>

- [`9092a94`](https://github.com/Nick2bad4u/stylelint-plugin-file-progress/commit/9092a943813d35b4aab08c201ab130636c7b7981 "Diff: 7 files, +63 | -8") — 🐛 [fix] Expose CommonJS option types and verify clean TypeScript consumers&nbsp;<sub><em>(7&nbsp;files,&nbsp;+63,&nbsp;-8)</em></sub>
  - Merge public type aliases into the CommonJS declaration bridge and keep the public ESM types independent of type-fest library requirements. Compile ESM and CommonJS consumers plus every preset against all supported Stylelint versions, including negative type assertions.

- [`0d1d4f8`](https://github.com/Nick2bad4u/stylelint-plugin-file-progress/commit/0d1d4f8b202175a9bc4412085ddf33615f8d4c4c "Diff: 5 files, +30 | -2") — 🐛 [fix] Build fresh artifacts for verification and repair inspector navigation&nbsp;<sub><em>(5&nbsp;files,&nbsp;+30,&nbsp;-2)</em></sub>
  - Make npm pack and standalone coverage/consumer commands build the package first. Document option domains and output streams, use inspector directory links that work in local preview and Pages, and grant the release artifact download its required read permission.

- [`688917c`](https://github.com/Nick2bad4u/stylelint-plugin-file-progress/commit/688917c36c9fbd1b77de288b5f968b908a800c65 "Diff: 5 files, +16 | -6") — 🐛 [fix] Preserve defensive TTY coercion against incorrect Node typings&nbsp;<sub><em>(5&nbsp;files,&nbsp;+16,&nbsp;-6)</em></sub>

- [`9b4d78a`](https://github.com/Nick2bad4u/stylelint-plugin-file-progress/commit/9b4d78ae917800f92e1346a3a480271d7f7442a5 "Diff: 5 files, +14 | -5") — 🐛 [fix] Normalize terminal detection and stabilize portable validation&nbsp;<sub><em>(5&nbsp;files,&nbsp;+14,&nbsp;-5)</em></sub>
  - Keep non-TTY output free of automatic color, preserve the Docusaurus generated module boundary, and make TOML formatting independent of user configuration. Put workflow job names before steps to avoid the shared YAML validator nesting ambiguity.

- [`7219cb4`](https://github.com/Nick2bad4u/stylelint-plugin-file-progress/commit/7219cb46452644b06820c450ee1acc261b27ee51 "Diff: 3 files, +55 | -11") — 🐛 [fix] Bootstrap npm before cache restoration in Actions&nbsp;<sub><em>(3&nbsp;files,&nbsp;+55,&nbsp;-11)</em></sub>

### 📝 Documentation

- [`aac0090`](https://github.com/Nick2bad4u/stylelint-plugin-file-progress/commit/aac0090d872839fbcd4f2f33515b347da28b7924 "Diff: 1 file, +4 | -4") — 📝 [docs] Preserve verified contributor links and nested release entries&nbsp;<sub><em>(1&nbsp;file,&nbsp;+4,&nbsp;-4)</em></sub>

- [`3899bd5`](https://github.com/Nick2bad4u/stylelint-plugin-file-progress/commit/3899bd57248d3b017255b105ecdb8ecba85cda53 "Diff: 1 file, +12 | -4") — 📝 [docs] Record the portable tarball gate in the complete release history&nbsp;<sub><em>(1&nbsp;file,&nbsp;+12,&nbsp;-4)</em></sub>

- [`5d78fe9`](https://github.com/Nick2bad4u/stylelint-plugin-file-progress/commit/5d78fe9f317a7f6ffc7d2aba7fdcda2018f35d0f "Diff: 1 file, +2 | -2") — 📝 [docs] Correct first-contribution links in the release history&nbsp;<sub><em>(1&nbsp;file,&nbsp;+2,&nbsp;-2)</em></sub>

- [`73fe4e4`](https://github.com/Nick2bad4u/stylelint-plugin-file-progress/commit/73fe4e415e69df5f528c2f12f93f9a9fe7e5ca36 "Diff: 1 file, +14 | -0") — 📝 [docs] Include validated action updates in the 1.0.0 history&nbsp;<sub><em>(1&nbsp;file,&nbsp;+14,&nbsp;-0)</em></sub>

- [`8561b50`](https://github.com/Nick2bad4u/stylelint-plugin-file-progress/commit/8561b50e4f2aa329f7dd4aa73868d2466d1ffcff "Diff: 1 file, +7 | -2") — 📝 [docs] Include npm tarball publication handling in the release history&nbsp;<sub><em>(1&nbsp;file,&nbsp;+7,&nbsp;-2)</em></sub>

- [`8634f0d`](https://github.com/Nick2bad4u/stylelint-plugin-file-progress/commit/8634f0db62acbed07e3e3a68800c411b410ae0c4 "Diff: 1 file, +7 | -0") — 📝 [docs] Record the inspector asset correction in the release history&nbsp;<sub><em>(1&nbsp;file,&nbsp;+7,&nbsp;-0)</em></sub>

- [`f4b32f4`](https://github.com/Nick2bad4u/stylelint-plugin-file-progress/commit/f4b32f4600413c7cc0325c0ee12ec7dac6c8763a "Diff: 1 file, +15 | -1") — 📝 [docs] Include the final CI safeguards in the 1.0.0 history&nbsp;<sub><em>(1&nbsp;file,&nbsp;+15,&nbsp;-1)</em></sub>

- [`e126e44`](https://github.com/Nick2bad4u/stylelint-plugin-file-progress/commit/e126e444f3af98828dda0673d37d8adb961a5ac6 "Diff: 1 file, +8 | -0") — 📝 [docs] Include release recovery in the 1.0.0 changelog&nbsp;<sub><em>(1&nbsp;file,&nbsp;+8,&nbsp;-0)</em></sub>

- [`dca91cb`](https://github.com/Nick2bad4u/stylelint-plugin-file-progress/commit/dca91cb03e3c0df4b554941bd748a93b0f0987ae "Diff: 1 file, +62 | -4") — 📝 [docs] Record the complete 1.0.0 release history&nbsp;<sub><em>(1&nbsp;file,&nbsp;+62,&nbsp;-4)</em></sub>

### 🎨 Styling

- [`fdf19f0`](https://github.com/Nick2bad4u/stylelint-plugin-file-progress/commit/fdf19f01f0317daa587354098474eac204d6a05d "Diff: 1 file, +1 | -1") — 🎨 [style] Order the documented runtime-boundary lint overrides&nbsp;<sub><em>(1&nbsp;file,&nbsp;+1,&nbsp;-1)</em></sub>

### 🧪 Testing

- [`6f006a7`](https://github.com/Nick2bad4u/stylelint-plugin-file-progress/commit/6f006a7e519bca0b74aab3008da315700247696a "Diff: 5 files, +39 | -4") — 🧪 [test] Keep tarball publication checks in a portable repository command&nbsp;<sub><em>(5&nbsp;files,&nbsp;+39,&nbsp;-4)</em></sub>
  - 🧪 [test] Validate exactly one tarball through npm run release:check-tarball without shell glob expansion or publication.
  - 📝 [docs] Fix nested changelog entries and document the reusable dry-run command.

- [`aa72f46`](https://github.com/Nick2bad4u/stylelint-plugin-file-progress/commit/aa72f46f8ca768263d24c2aff95ff355dc64aa4d "Diff: 1 file, +67 | -7") — 🧪 [test] Isolate CLI assertions from inherited debugger instrumentation&nbsp;<sub><em>(1&nbsp;file,&nbsp;+67,&nbsp;-7)</em></sub>

### 🧹 Chores

- [`e3c4767`](https://github.com/Nick2bad4u/stylelint-plugin-file-progress/commit/e3c4767f94010787432d15dfce5152fe24e0d729 "Diff: 3 files, +6 | -0") — 🧹 [chore] Ignore generated link-checker output&nbsp;<sub><em>(3&nbsp;files,&nbsp;+6,&nbsp;-0)</em></sub>

- [`02d297a`](https://github.com/Nick2bad4u/stylelint-plugin-file-progress/commit/02d297abacc74d4c20507b4a9493779742f96f89 "Diff: 5 files, +7 | -1") — 🧹 [chore] Keep generated QA reports outside source checks&nbsp;<sub><em>(5&nbsp;files,&nbsp;+7,&nbsp;-1)</em></sub>

- [`175024c`](https://github.com/Nick2bad4u/stylelint-plugin-file-progress/commit/175024cfff005672b09765769f41384681985edb "Diff: 3 files, +40 | -0") — 🧹 [chore] Initialize Stylelint file progress repository&nbsp;<sub><em>(3&nbsp;files,&nbsp;+40,&nbsp;-0)</em></sub>

### 👷 CI/CD

- [`2872fb6`](https://github.com/Nick2bad4u/stylelint-plugin-file-progress/commit/2872fb6e67139a3f9d085cc67e12787af603d3d6 "Diff: 4 files, +8 | -1") — 👷 [ci] Keep CodeQL updates compatible and require passing merge checks&nbsp;<sub><em>(4&nbsp;files,&nbsp;+8,&nbsp;-1)</em></sub>
  - 👷 [ci] Align CodeQL init and analyze at v4.37.9 and group future CodeQL updates in Dependabot.
  - 👷 [ci] Add manual CI and CodeQL triggers for automation-created commits.
  - 📝 [docs] Record the enforced main-branch checks and automatic merge safeguards.

- [`4a26a57`](https://github.com/Nick2bad4u/stylelint-plugin-file-progress/commit/4a26a5770e18963eb6cff8aee255f55dabf82d29 "Diff: 1 file, +2 | -0") — 👷 [ci] Finish draft releases when retrying interrupted uploads&nbsp;<sub><em>(1&nbsp;file,&nbsp;+2,&nbsp;-0)</em></sub>

### 📦 Dependencies

- [`1349377`](https://github.com/Nick2bad4u/stylelint-plugin-file-progress/commit/134937724df0c3afeadf182a29d8d67f50b78769 "Diff: 4 files, +7 | -7") — ⬆️ [build] Update actions/checkout&nbsp;<sub><em>(4&nbsp;files,&nbsp;+7,&nbsp;-7)</em></sub>

- [`a16e7cc`](https://github.com/Nick2bad4u/stylelint-plugin-file-progress/commit/a16e7ccc7764307d078df43457e9d493716b10ba "Diff: 1 file, +1 | -1") — ⬆️ [build] Update github/codeql-action/init&nbsp;<sub><em>(1&nbsp;file,&nbsp;+1,&nbsp;-1)</em></sub>

- [`22b2ad1`](https://github.com/Nick2bad4u/stylelint-plugin-file-progress/commit/22b2ad1797c5bb7dc3971697a48055fce563e747 "Diff: 1 file, +1 | -1") — ⬆️ [build] Update actions/deploy-pages&nbsp;<sub><em>(1&nbsp;file,&nbsp;+1,&nbsp;-1)</em></sub>

### 🛡️ Security

- [`4f92add`](https://github.com/Nick2bad4u/stylelint-plugin-file-progress/commit/4f92addb15d9064016bfc2fad5040179bd9b1692 "Diff: 4 files, +14 | -14") — 👷 [ci] Integrate validated action updates into the release fix&nbsp;<sub><em>(4&nbsp;files,&nbsp;+14,&nbsp;-14)</em></sub>
  - origin/main:
    ⬆️ [build] Update step-security/harden-runner
    ⬆️ [build] Update actions/checkout

- [`71e68fe`](https://github.com/Nick2bad4u/stylelint-plugin-file-progress/commit/71e68fe7943d8518643e7cead3ae49d7a21ad3b9 "Diff: 4 files, +7 | -7") — ⬆️ [build] Update step-security/harden-runner&nbsp;<sub><em>(4&nbsp;files,&nbsp;+7,&nbsp;-7)</em></sub>

### New Contributors

- @Nick2bad4u made their first contribution in [#10](https://github.com/Nick2bad4u/stylelint-plugin-file-progress/pull/10)
- @dependabot[bot] made their first contribution in [#8](https://github.com/Nick2bad4u/stylelint-plugin-file-progress/pull/8)

## ⭐ Contributors

Thanks to anyone who has 🧑‍💻 [contributed](https://github.com/Nick2bad4u/stylelint-plugin-file-progress/graphs/contributors).

_This changelog was automatically generated with ⛰️ [git-cliff](https://github.com/orhun/git-cliff)._
