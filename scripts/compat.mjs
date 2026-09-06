import { mkdtemp, readFile, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const npmCli = process.env.npm_execpath;
// npm run exports the global policy, which npm 12 rejects in project installs.
const childEnvironment = Object.fromEntries(
    Object.entries(process.env).filter(
        ([name]) => name.toLowerCase() !== "npm_config_allow_scripts"
    )
);
if (!npmCli) throw new Error("Run this command through npm run test:compat");
function npm(args, cwd) {
    const result = spawnSync(process.execPath, [npmCli, ...args], {
        cwd,
        encoding: "utf8",
        env: {
            ...childEnvironment,
            npm_config_userconfig:
                process.platform === "win32" ? "NUL" : "/dev/null",
        },
        timeout: 180000,
    });
    if (result.status !== 0)
        throw new Error(
            `npm ${args.join(" ")}: ${result.stderr || result.stdout}`
        );
    return result.stdout;
}
const workspace = await mkdtemp(
    path.join(tmpdir(), "stylelint-progress-consumer-")
);
try {
    const packed = JSON.parse(
        npm(
            [
                "pack",
                "--json",
                "--ignore-scripts",
                "--pack-destination",
                workspace,
            ],
            root
        )
    );
    const packedItem = Array.isArray(packed)
        ? packed[0]
        : packed.filename
          ? packed
          : Object.values(packed)[0];
    if (
        !packedItem ||
        typeof packedItem.filename !== "string" ||
        path.basename(packedItem.filename) !== packedItem.filename
    )
        throw new Error("npm pack did not return one safe tarball filename");
    const tarball = path.join(workspace, packedItem.filename);
    const requested = process.argv
        .find((arg) => arg.startsWith("--stylelint="))
        ?.slice(12);
    const versions = requested
        ? [requested]
        : [
              "16.0.0",
              "16",
              "17.14.0",
              "17",
          ];
    const manifest = JSON.parse(await readFile("package.json", "utf8"));
    for (const version of versions) {
        const consumer = path.join(workspace, `stylelint-${version}`);
        await import("node:fs/promises").then(({ mkdir }) => mkdir(consumer));
        await writeFile(
            path.join(consumer, "package.json"),
            JSON.stringify({
                name: "progress-consumer",
                private: true,
                type: "module",
            })
        );
        npm(
            [
                "install",
                "--ignore-scripts",
                "--no-audit",
                "--no-fund",
                tarball,
                `stylelint@${version}`,
                "@types/node@22",
            ],
            consumer
        );
        await writeFile(
            path.join(consumer, "verify.mjs"),
            `import assert from 'node:assert/strict';\nimport {createRequire} from 'node:module';\nimport stylelint from 'stylelint';\nimport plugin, {configs} from 'stylelint-plugin-file-progress';\nconst require=createRequire(import.meta.url);\nconst cjs=require('stylelint-plugin-file-progress');\nfor(const pack of [plugin,cjs]){assert.equal(pack.length,1);const r=await stylelint.lint({code:'a { color: #ggg; }',config:{plugins:pack,rules:{'file-progress/activate':[true,{hide:true}],'color-no-invalid-hex':true}}});assert.equal(r.errored,true);assert.equal(r.results[0].warnings.length,1);}\nfor(const name of ${JSON.stringify(
                Object.keys(manifest.exports)
                    .filter((key) => key.startsWith("./configs/"))
                    .map((key) => key.slice(10))
            )}){const esm=await import('stylelint-plugin-file-progress/configs/'+name);const common=require('stylelint-plugin-file-progress/configs/'+name);for(const config of [esm.default,common,configs[name]]){const r=await stylelint.lint({code:'a { color: red; }',config:{...config,rules:{...config.rules,'file-progress/activate':[true,{hide:true}]}}});assert.equal(r.errored,false);}}\nconsole.log('Verified '+require('stylelint/package.json').version);\n`
        );
        const presetNames = Object.keys(manifest.exports)
            .filter((key) => key.startsWith("./configs/"))
            .map((key) => key.slice(10));
        for (const kind of ["mts", "cts"]) {
            const imports =
                kind === "mts"
                    ? "import pack from 'stylelint-plugin-file-progress';\n"
                    : "import pack = require('stylelint-plugin-file-progress');\n";
            const presetImports = presetNames
                .map((name, index) =>
                    kind === "mts"
                        ? `import preset${index} from 'stylelint-plugin-file-progress/configs/${name}';`
                        : `import preset${index} = require('stylelint-plugin-file-progress/configs/${name}');`
                )
                .join("\n");
            const code =
                imports +
                presetImports +
                `\nimport type {ProgressSettings, FileProgressConfigName, FileProgressMetadata} from 'stylelint-plugin-file-progress';
const options: ProgressSettings = {mode: 'file', outputStream: 'stderr', spinnerStyle: 'dots'};
const name: FileProgressConfigName = 'recommended';
const metadata: FileProgressMetadata = pack.meta;
// @ts-expect-error Invalid modes must remain a type error.
const invalid: ProgressSettings = {mode: 'invalid'};
// @ts-expect-error Unknown presets must remain a type error.
const missing: FileProgressConfigName = 'missing';
void [options, metadata, pack.configs[name], invalid, missing, ${presetNames.map((_, i) => "preset" + i + ".rules").join(",")}];\n`;
            await writeFile(path.join(consumer, `types.${kind}`), code);
        }
        const types = spawnSync(
            process.execPath,
            [
                path.join(root, "node_modules/typescript/bin/tsc"),
                "--noEmit",
                "--strict",
                "--module",
                "nodenext",
                "--target",
                "es2022",
                "types.mts",
                "types.cts",
            ],
            { cwd: consumer, encoding: "utf8", timeout: 30000 }
        );
        if (types.status !== 0)
            throw new Error(
                `Consumer declarations (Stylelint ${version}): ${types.stdout || types.stderr}`
            );
        const installedStylelint = JSON.parse(
            await readFile(
                path.join(consumer, "node_modules/stylelint/package.json"),
                "utf8"
            )
        ).version;
        // Stylelint 17 exposes types only through package exports, requiring modern resolution.
        if (installedStylelint.startsWith("16.")) {
            const legacy = spawnSync(
                process.execPath,
                [
                    path.join(root, "node_modules/typescript/bin/tsc"),
                    "--noEmit",
                    "--strict",
                    "--module",
                    "commonjs",
                    "--moduleResolution",
                    "node10",
                    "--ignoreDeprecations",
                    "6.0",
                    "--target",
                    "es2022",
                    "types.cts",
                ],
                { cwd: consumer, encoding: "utf8", timeout: 30000 }
            );
            if (legacy.status !== 0)
                throw new Error(
                    `Legacy CommonJS declarations (Stylelint ${version}): ${legacy.stdout || legacy.stderr}`
                );

            console.log(
                `Verified legacy CommonJS consumer declarations with Stylelint ${installedStylelint}`
            );
        }
        console.log(
            `Verified ESM and CommonJS consumer declarations with Stylelint ${installedStylelint}`
        );
        const result = spawnSync(process.execPath, ["verify.mjs"], {
            cwd: consumer,
            encoding: "utf8",
            timeout: 30000,
        });
        if (result.status !== 0) throw new Error(result.stderr);
        console.log(result.stdout.trim());
        if (
            process.argv.includes("--minimum-node") &&
            version.startsWith("16")
        ) {
            const platform =
                process.platform === "win32" ? "win" : process.platform;
            const binaryPackage = `node-${platform}-${process.arch}`;
            npm(
                [
                    "install",
                    "--ignore-scripts",
                    "--no-audit",
                    "--no-fund",
                    `${binaryPackage}@22.0.0`,
                ],
                consumer
            );
            const executable = path.join(
                consumer,
                "node_modules",
                binaryPackage,
                "bin",
                process.platform === "win32" ? "node.exe" : "node"
            );
            const minimum = spawnSync(executable, ["verify.mjs"], {
                cwd: consumer,
                encoding: "utf8",
                timeout: 30000,
            });
            if (minimum.status !== 0)
                throw new Error(
                    `Node 22.0.0: ${minimum.error || minimum.stderr}`
                );
            console.log(`Node 22.0.0: ${minimum.stdout.trim()}`);
        }
    }
} finally {
    await rm(workspace, { recursive: true, force: true });
}
