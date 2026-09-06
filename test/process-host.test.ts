import * as fs from "node:fs";
import pc from "picocolors";
import { describe, expect, it, vi } from "vitest";

import { processHost } from "../src/_internal/controller.js";

// eslint-disable-next-line unicorn/import-style -- Vitest uses an import promise to type the partial module mock.
vi.mock(import("node:fs"), async (importOriginal) => ({
    ...(await importOriginal()),
    writeSync: vi.fn<(...args: unknown[]) => number>(() => 0),
}));

describe("process boundary", () => {
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
