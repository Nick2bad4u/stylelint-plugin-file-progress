#!/usr/bin/env node

/**
 * Keep the exact npm development-engine version aligned with the exact
 * package-manager pin.
 *
 * Source of truth:
 *
 * - `packageManager`, in exact `npm@x.y.z` form.
 *
 * Managed value:
 *
 * - Root and workspace `devEngines.packageManager.version`, as the same exact
 *   version.
 * - Workspace `packageManager` pins, using the root pin as the source of truth.
 *
 * The exact package-manager pin gives automation a reproducible npm release,
 * and the development-engine pin keeps local installs on that release.
 */

import { glob, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const packageJsonPath = fileURLToPath(
    new URL("../package.json", import.meta.url)
);

/**
 * Check whether an unknown value is a non-null object record.
 *
 * @param {unknown} value
 *
 * @returns {value is Record<string, unknown>}
 */
const isRecord = (value) => typeof value === "object" && value !== null;

/**
 * Parse the exact npm package-manager pin.
 *
 * @param {unknown} packageManager
 *
 * @returns {{ majorVersion: string; packageManagerSpec: string }}
 *
 * @throws {TypeError} If the pin is not in exact `npm@x.y.z` form
 */
const parseNpmPackageManager = (packageManager) => {
    if (typeof packageManager !== "string") {
        throw new TypeError(
            "Expected package.json packageManager to be a string."
        );
    }

    const packageManagerSpec = packageManager.trim();
    const versionMatch =
        /^npm@(?<majorVersion>0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)$/v.exec(
            packageManagerSpec
        );
    const majorVersion = versionMatch?.groups?.["majorVersion"];

    if (majorVersion === undefined) {
        throw new TypeError(
            [
                "Expected package.json packageManager to pin an exact stable npm version",
                `in npm@x.y.z form, received: ${packageManager}`,
            ].join(" ")
        );
    }

    return { majorVersion, packageManagerSpec };
};

/**
 * Parse command-line arguments.
 *
 * Supported options:
 *
 * - No option: update package.json when synchronization is required
 * - `--check`: validate synchronization without writing
 * - `--print-package-manager`: print the validated exact npm pin for automation.
 *
 * @param {readonly string[]} argumentList
 *
 * @returns {"check" | "print" | "write"}
 *
 * @throws {TypeError} If an unsupported or conflicting option is provided
 */
const parseArguments = (argumentList) => {
    /** @type {"check" | "print" | "write"} */
    let mode = "write";

    for (const argument of argumentList) {
        if (argument !== "--check" && argument !== "--print-package-manager") {
            throw new TypeError(`Unsupported argument: ${argument}`);
        }

        const nextMode =
            argument === "--check" ? "check" : /** @type {const} */ ("print");

        if (mode !== "write") {
            throw new TypeError(
                "Use only one of --check or --print-package-manager."
            );
        }

        mode = nextMode;
    }

    return mode;
};

/**
 * Read and parse package.json.
 *
 * @param {string} [manifestPath]
 *
 * @returns {Promise<Record<string, unknown>>}
 */
const readPackageJson = async (manifestPath = packageJsonPath) => {
    try {
        const packageJsonContent = await readFile(manifestPath, "utf8");
        const packageJson = JSON.parse(packageJsonContent);

        if (!isRecord(packageJson)) {
            throw new TypeError("Expected package.json to contain an object.");
        }

        return packageJson;
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);

        throw new TypeError(
            `Failed to read package.json at ${manifestPath}: ${message}`,
            { cause: error }
        );
    }
};

/**
 * Resolve and validate the managed package-manager metadata.
 *
 * @param {Record<string, unknown>} packageJson
 *
 * @returns {{
 *     expectedEngineRange: string;
 *     packageManagerEngine: Record<string, unknown>;
 *     packageManagerSpec: string;
 * }}
 */
const resolvePackageManagerMetadata = (packageJson) => {
    const { packageManagerSpec } = parseNpmPackageManager(
        packageJson["packageManager"]
    );
    const devEngines = packageJson["devEngines"];

    if (!isRecord(devEngines)) {
        throw new TypeError(
            "Expected package.json devEngines to be an object."
        );
    }

    const packageManagerEngine = devEngines["packageManager"];

    if (!isRecord(packageManagerEngine)) {
        throw new TypeError(
            "Expected package.json devEngines.packageManager to be an object."
        );
    }

    if (packageManagerEngine["name"] !== "npm") {
        throw new TypeError(
            "Expected package.json devEngines.packageManager.name to be npm."
        );
    }

    return {
        expectedEngineRange: packageManagerSpec.slice(4),
        packageManagerEngine,
        packageManagerSpec,
    };
};

const main = async () => {
    const mode = parseArguments(process.argv.slice(2));
    const packageJson = await readPackageJson();
    const { expectedEngineRange, packageManagerEngine, packageManagerSpec } =
        resolvePackageManagerMetadata(packageJson);

    if (mode === "print") {
        process.stdout.write(packageManagerSpec);
        return;
    }

    const workspaces = packageJson["workspaces"] ?? [];
    if (
        !Array.isArray(workspaces) ||
        workspaces.some((workspace) => typeof workspace !== "string")
    ) {
        throw new TypeError(
            "Expected package.json workspaces to be an array of directory patterns."
        );
    }
    const rootPath = fileURLToPath(new URL("../", import.meta.url));
    const manifests = [
        {
            path: packageJsonPath,
            value: packageJson,
            engine: packageManagerEngine,
        },
    ];
    for (const workspace of workspaces) {
        const matches = [];
        for await (const path of glob(`${workspace}/package.json`, {
            cwd: rootPath,
            exclude: ["**/node_modules/**"],
        })) {
            matches.push(
                fileURLToPath(
                    new URL(
                        path.replaceAll("\\", "/"),
                        new URL("../", import.meta.url)
                    )
                )
            );
        }
        if (matches.length === 0)
            throw new Error(`Workspace manifest not found: ${workspace}`);
        for (const path of matches) {
            const value = await readPackageJson(path);
            const { packageManagerEngine: engine } =
                resolvePackageManagerMetadata(value);
            manifests.push({ path, value, engine });
        }
    }
    const changes = manifests.filter(
        ({ value, engine }) =>
            value["packageManager"] !== packageManagerSpec ||
            engine["version"] !== expectedEngineRange
    );
    if (mode === "check" && changes.length > 0) {
        throw new TypeError(
            `npm metadata is out of sync in ${changes.map(({ path }) => path).join(", ")}. Expected ${packageManagerSpec}; run npm run sync:npm-version.`
        );
    }
    for (const { path, value, engine } of changes) {
        value["packageManager"] = packageManagerSpec;
        engine["version"] = expectedEngineRange;
        await writeFile(path, `${JSON.stringify(value, null, 4)}\n`, "utf8");
    }
    console.log(
        `npm metadata synchronized across ${manifests.length} manifests: ${packageManagerSpec}`
    );
};

try {
    await main();
} catch (error) {
    console.error("Failed to synchronize npm package-manager metadata:", error);
    process.exitCode = 1;
}
