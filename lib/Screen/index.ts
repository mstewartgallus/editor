import type Buffer from "../Buffer";

export interface CurrentLine {
    beforeCursor: string;
    afterCursor: string;
}

export default interface Screen {
    start: number;
    currentLine: CurrentLine;
    beforeLine: string[];
    afterLine: string[];
}

export const empty: Readonly<Screen> = {
    start: 0,
    currentLine: {
        beforeCursor: '',
        afterCursor: ''
    },
    beforeLine: [],
    afterLine: []
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

    return {
        start: Math.max(befores.length - lines, 0),
        currentLine: {
            beforeCursor, afterCursor
        },
        beforeLine: befores.slice(-lines),
        afterLine: afters.slice(0, lines)
    };
};
