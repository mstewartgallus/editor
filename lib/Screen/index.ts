import type Buffer from "../Buffer";
import type Caret from "../Caret";

export default interface Screen {
    start: number;
    caret: Readonly<Caret>;
    lines: readonly string[];
}

export const empty: Readonly<Screen> = {
    start: 0,
    caret: {
        line: 0,
        character: 0
    },
    lines: Array(80).fill('')
}

// FIXME.. lines is UI
export const fromBuffer: (buffer: Readonly<Buffer>, lines?: number) => Screen = (
    buffer,
    lines = 35
) => {
    const { before, after } = buffer;
    const befores = before.split('\n');
    const afters = after.split('\n');

    const beforeCursor = befores.pop() ?? '';
    const afterCursor = afters.shift() ?? '';

    const afterLine = afters.slice(0, lines);
    const slack = Math.max(lines - afterLine.length, 0);

    const beforeLinesCount = lines + slack;
    const beforeLine = befores.slice(-beforeLinesCount);

    const start =  Math.max(befores.length - beforeLinesCount, 0);

    const caret = {
        line: start + beforeLine.length,
        character: beforeCursor.length
    };

    return {
        start,
        caret,
        lines: [
            ...beforeLine,
            beforeCursor + afterCursor,
            ...afterLine
        ]
    };
};
