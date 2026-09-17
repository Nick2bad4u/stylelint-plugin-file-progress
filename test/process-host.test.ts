import * as fs from "node:fs";
import pc from "picocolors";
import { describe, expect, it, vi } from "vitest";

import { processHost } from "../src/_internal/controller.js";

const environment = vi.hoisted<{
    mainThread: boolean;
    platform: "linux" | "win32";
}>(() => ({
    mainThread: true,
    platform: "linux",
}));
vi.mock(import("node:os"), async (importOriginal) => ({
    ...(await importOriginal()),
    platform: () => environment.platform,
}));
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

function restoreTerminal(
    output: typeof process.stderr | typeof process.stdout,
    descriptors: PropertyDescriptorMap
): void {
    for (const key of [
        "isTTY",
        "columns",
        "rows",
        "bytesWritten",
    ]) {
        const descriptor = descriptors[key];
        if (descriptor) Object.defineProperty(output, key, descriptor);
        else Reflect.deleteProperty(output, key);
    }
}
function withTerminal<T>(action: () => T): T {
    const originals = [process.stderr, process.stdout].map((output) => ({
        descriptors: Object.getOwnPropertyDescriptors(output),
        output,
    }));
    Object.defineProperties(process.stderr, {
        bytesWritten: { configurable: true, value: 100 },
        columns: { configurable: true, value: 80 },
        isTTY: { configurable: true, value: true },
        rows: { configurable: true, value: 24 },
    });
    try {
        return action();
    } finally {
        environment.mainThread = true;
        for (const { descriptors, output } of originals)
            restoreTerminal(output, descriptors);
    }
}

describe("process boundary", () => {
    it("observes terminal dimensions and writes on either stream", () => {
        expect.hasAssertions();

        const { first, second, third } = withTerminal(() => {
            const first = processHost.terminal("stderr");
            Object.defineProperty(process.stderr, "bytesWritten", {
                value: 101,
            });
            const second = processHost.terminal("stderr");
            Object.defineProperty(process.stdout, "bytesWritten", {
                configurable: true,
                value: process.stdout.bytesWritten + 1,
            });
            return { first, second, third: processHost.terminal("stderr") };
        });

        expect(first).toMatchObject({ columns: 80, rows: 24 });
        expect(second?.revision).not.toBe(first?.revision);
        expect(third?.revision).not.toBe(second?.revision);
    });

    it.each([
        ["bytesWritten", NaN],
        ["columns", 0],
        ["columns", NaN],
        ["isTTY", false],
        ["rows", 1],
        ["rows", NaN],
    ] as const)("declines cursor control with %s=%s", (key, value) => {
        expect.hasAssertions();

        const state = withTerminal(() => {
            Object.defineProperty(process.stderr, key, { value });
            return processHost.terminal("stderr");
        });

        expect(state).toBeUndefined();
    });

    it("declines cursor control on worker message-port streams", () => {
        expect.hasAssertions();

        const state = withTerminal(() => {
            environment.mainThread = false;
            return processHost.terminal("stderr");
        });

        expect(state).toBeUndefined();
    });

    it.each(["stderr", "stdout"] as const)(
        "preserves Windows terminal Unicode and ANSI output on %s, including shutdown",
        async (stream) => {
            expect.hasAssertions();

            environment.platform = "win32";
            const output = process[stream];
            const descriptor = Object.getOwnPropertyDescriptor(output, "isTTY");
            Object.defineProperty(output, "isTTY", {
                configurable: true,
                value: true,
            });
            const columns = output.columns;
            const before = output.listenerCount("error");
            const progress = "\u{1B}[36m⠋ SFP • linting élève.css\u{1B}[39m\n";
            const summary =
                "\u{1B}[31mSFP: ✖ Process exited with status 2.\u{1B}[39m\n";
            const write = vi
                .spyOn(output, "write")
                .mockImplementation((...args) => {
                    const complete = args.at(-1);
                    if (typeof complete === "function") complete();
                    return true;
                });
            vi.mocked(fs.writeSync).mockClear();
            try {
                processHost.write(stream, progress, false);
                processHost.write(stream, summary, true);
                await Promise.resolve();

                expect(write).toHaveBeenNthCalledWith(
                    1,
                    progress,
                    expect.any(Function)
                );
                expect(write).toHaveBeenNthCalledWith(
                    2,
                    summary,
                    expect.any(Function)
                );
                expect(fs.writeSync).not.toHaveBeenCalled();
                expect(output.columns).toBe(columns);
                expect(output.isTTY).toBe(true);
                expect(output.listenerCount("error")).toBe(before);
            } finally {
                write.mockRestore();
                if (descriptor)
                    Object.defineProperty(output, "isTTY", descriptor);
                else Reflect.deleteProperty(output, "isTTY");
                environment.platform = "linux";
            }
        }
    );

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
