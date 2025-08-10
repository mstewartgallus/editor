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
    lines: Array(30).fill('')
}

// FIXME.. lines is UI
export const fromBuffer: (buffer: Readonly<Buffer>, numLines?: number) => Screen = (
    buffer,
    numLines = 35
) => {
    const { lines, caret } = buffer;

    const start = Math.max(caret.line - numLines, 0);
    const slice = lines.slice(start, caret.line + numLines);

    return {
        start,
        caret,
        lines: slice
    };
};
