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
    currentLine: {
        beforeCursor: '',
        afterCursor: ''
    },
    beforeLine: [],
    afterLine: []
}

export const fromBuffer = (
    buffer: Readonly<Buffer>,
    lines: number = 30
) => {
    const { before, after } = buffer;
    const befores = before.split('\n');
    const afters = after.split('\n');

    let beforeCursor = befores.pop();
    const afterCursor = afters.shift();

    return {
        start: Math.max(befores.length - lines, 0),
        currentLine: {
            beforeCursor, afterCursor
        },
        beforeLine: befores.slice(-lines),
        afterLine: afters.slice(0, lines)
    };
};
