import xterm from "@xterm/headless";

/** Replay ANSI output in a terminal so erased text cannot satisfy assertions. */
export async function terminalScreen(
    output: string,
    columns = 80,
    rows = 24
): Promise<string> {
    const terminal = new xterm.Terminal({
        allowProposedApi: true,
        cols: columns,
        convertEol: true,
        rows,
    });
    try {
        await new Promise<void>((resolve) => {
            terminal.write(output, resolve);
        });
        const buffer = terminal.buffer.active;
        return Array.from(
            { length: buffer.length },
            (_, index) => buffer.getLine(index)?.translateToString(true) ?? ""
        )
            .join("\n")
            .trimEnd();
    } finally {
        terminal.dispose();
    }
}
