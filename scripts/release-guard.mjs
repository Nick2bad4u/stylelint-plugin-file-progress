import { readFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
const manifest = JSON.parse(await readFile("package.json", "utf8"));
const version =
    process.env.RELEASE_VERSION ||
    process.env.GITHUB_REF_NAME?.replace(/^v/u, "");
if (
    !version ||
    !/^\d+\.\d+\.\d+$/u.test(version) ||
    version !== manifest.version
)
    throw new Error("Release version must match the committed package version");
if (
    process.env.GITHUB_EVENT_NAME === "workflow_dispatch" &&
    process.env.GITHUB_REF !== "refs/heads/main"
)
    throw new Error("Manual releases must run on main");
execFileSync(
    "git",
    [
        "merge-base",
        "--is-ancestor",
        "HEAD",
        "origin/main",
    ],
    {
        stdio: "inherit",
    }
);
const response = await fetch(
    `https://registry.npmjs.org/${manifest.name}/${version}`
);
if (response.status !== 404)
    throw new Error(
        `Publication blocked: registry returned ${response.status}; only a confirmed absent version may publish`
    );
console.log(`Verified unpublished ${manifest.name}@${version}`);
