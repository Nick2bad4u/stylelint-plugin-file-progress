import * as fs from "node:fs";
import pc from "picocolors";
import { describe, expect, it, vi } from "vitest";

import { processHost } from "../src/_internal/controller.js";

const environment = vi.hoisted(() => ({ mainThread: true }));
vi.mock(import("node:worker_threads"), () => ({
    get isMainThread() {
        return environment.mainThread;
    },
}));

// eslint-disable-next-line unicorn/import-style -- Vitest uses an import promise to type the partial module mock.
vi.mock(import("node:fs"), async (importOriginal) => ({
    ...(await importOriginal()),
    writeSync: vi.fn<(...args: unknown[]) => number>(() => 0),
}));

describe("process boundary", () => {
    it("shares one temporary error listener across a burst of buffered worker writes", async () => {
        expect.hasAssertions();

        environment.mainThread = false;
        const before = process.stdout.listenerCount("error");
        const completions: (() => void)[] = [];
        const write = vi
            .spyOn(process.stdout, "write")
            .mockImplementation((...args) => {
                const complete = args.at(-1);
                if (typeof complete === "function") completions.push(complete);
                return true;
            });
        try {
            for (let index = 0; index < 25; index += 1)
                processHost.write("stdout", `${index}.css\n`, false);

            expect(process.stdout.listenerCount("error")).toBe(before + 1);
            expect(completions).toHaveLength(25);

            for (const complete of completions) complete();
            await Promise.resolve();

            expect(process.stdout.listenerCount("error")).toBe(before);
        } finally {
            write.mockRestore();
            environment.mainThread = true;
        }
    });

    it("tolerates a working directory that no longer exists", () => {
        expect.hasAssertions();

        const cwd = vi.spyOn(process, "cwd").mockImplementationOnce(() => {
            throw new Error("ENOENT");
        });
        try {
            expect(processHost.cwd()).toBe("");
        } finally {
            cwd.mockRestore();
        }
    });

    it.each([false, true])(
        "cleans worker error listeners after completion (failed: %s)",
        async (failed) => {
            expect.hasAssertions();

            environment.mainThread = false;
            const before = process.stdout.listenerCount("error");
            const write = vi
                .spyOn(process.stdout, "write")
                .mockImplementationOnce((...args) => {
                    const complete = args.at(-1);
                    if (failed)
                        process.stdout.emit("error", new Error("EPIPE"));
                    if (typeof complete === "function") complete();
                    return true;
                });
            try {
                processHost.write("stdout", "worker progress\n", false);

                expect(write).toHaveBeenCalledWith(
                    "worker progress\n",
                    expect.any(Function)
                );

                await Promise.resolve();

                expect(process.stdout.listenerCount("error")).toBe(before);
            } finally {
                write.mockRestore();
                environment.mainThread = true;
            }
        }
    );

    it("releases worker error listeners when a write throws", () => {
        expect.hasAssertions();

        environment.mainThread = false;
        const before = process.stdout.listenerCount("error");
        const write = vi
            .spyOn(process.stdout, "write")
            .mockImplementationOnce(() => {
                throw new Error("closed");
            });
        try {
            expect(() => {
                processHost.write("stdout", "worker summary\n", true);
            }).not.toThrow();
            expect(process.stdout.listenerCount("error")).toBe(before);
        } finally {
            write.mockRestore();
            environment.mainThread = true;
        }
    });

    it("uses real clock, working directory, and terminal state", () => {
        expect.hasAssertions();
        expect(processHost.now()).toBeGreaterThanOrEqual(0);
        expect(processHost.cwd()).toBe(process.cwd());
        expect(processHost.isTTY("stderr")).toBe(Boolean(process.stderr.isTTY));
        expect(processHost.isTTY("stdout")).toBe(Boolean(process.stdout.isTTY));
        expect(processHost.color("stderr")).toBeTypeOf("boolean");
        expect(processHost.color("stdout")).toBe(
            pc.isColorSupported && Boolean(process.stdout.isTTY)
        );
    });

    it("writes to the selected descriptor and tolerates a closed downstream pipe", () => {
        expect.hasAssertions();

        processHost.write("stderr", "progress\n", false);

        expect(fs.writeSync).toHaveBeenLastCalledWith(2, "progress\n");

        processHost.write("stdout", "summary\n", true);

        expect(fs.writeSync).toHaveBeenLastCalledWith(1, "summary\n");

        vi.mocked(fs.writeSync).mockImplementationOnce(() => {
            throw new Error("EPIPE");
        });

        expect(() => {
            processHost.write("stdout", "closed\n", true);
        }).not.toThrow();
    });

    it("registers one exit listener without a beforeExit listener or timer", () => {
        expect.hasAssertions();

        const callback = vi.fn<(code: number) => void>();
        const beforeExitCount = process.listenerCount("beforeExit");
        const beforeCount = process.listenerCount("exit");
        processHost.onExit(callback);
        try {
            expect(process.listenerCount("exit")).toBe(beforeCount + 1);
            expect(process.listenerCount("beforeExit")).toBe(beforeExitCount);
            expect(callback).not.toHaveBeenCalled();
        } finally {
            process.removeListener("exit", callback);
        }
    });
});
