<!-- markdownlint-disable -->
<!-- eslint-disable markdown/no-missing-label-refs -->

# 📜 Changelog

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

- [`e126e44`](https://github.com/Nick2bad4u/stylelint-plugin-file-progress/commit/e126e444f3af98828dda0673d37d8adb961a5ac6 "Diff: 1 file, +8 | -0") — 📝 [docs] Include release recovery in the 1.0.0 changelog&nbsp;<sub><em>(1&nbsp;file,&nbsp;+8,&nbsp;-0)</em></sub>

- [`dca91cb`](https://github.com/Nick2bad4u/stylelint-plugin-file-progress/commit/dca91cb03e3c0df4b554941bd748a93b0f0987ae "Diff: 1 file, +62 | -4") — 📝 [docs] Record the complete 1.0.0 release history&nbsp;<sub><em>(1&nbsp;file,&nbsp;+62,&nbsp;-4)</em></sub>

### 🎨 Styling

- [`fdf19f0`](https://github.com/Nick2bad4u/stylelint-plugin-file-progress/commit/fdf19f01f0317daa587354098474eac204d6a05d "Diff: 1 file, +1 | -1") — 🎨 [style] Order the documented runtime-boundary lint overrides&nbsp;<sub><em>(1&nbsp;file,&nbsp;+1,&nbsp;-1)</em></sub>

### 🧪 Testing

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

- [`a16e7cc`](https://github.com/Nick2bad4u/stylelint-plugin-file-progress/commit/a16e7ccc7764307d078df43457e9d493716b10ba "Diff: 1 file, +1 | -1") — ⬆️ [build] Update github/codeql-action/init&nbsp;<sub><em>(1&nbsp;file,&nbsp;+1,&nbsp;-1)</em></sub>

- [`22b2ad1`](https://github.com/Nick2bad4u/stylelint-plugin-file-progress/commit/22b2ad1797c5bb7dc3971697a48055fce563e747 "Diff: 1 file, +1 | -1") — ⬆️ [build] Update actions/deploy-pages&nbsp;<sub><em>(1&nbsp;file,&nbsp;+1,&nbsp;-1)</em></sub>

### New Contributors

- @dependabot[bot] made their first contribution in [#3](https://github.com/Nick2bad4u/stylelint-plugin-file-progress/pull/3)
- @Nick2bad4u made their first contribution in [#1](https://github.com/Nick2bad4u/stylelint-plugin-file-progress/pull/1)

## ⭐ Contributors

Thanks to anyone who has 🧑‍💻 [contributed](https://github.com/Nick2bad4u/stylelint-plugin-file-progress/graphs/contributors).

_This changelog was automatically generated with ⛰️ [git-cliff](https://github.com/orhun/git-cliff)._
