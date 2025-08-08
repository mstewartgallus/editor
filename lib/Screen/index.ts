import type Buffer from "./Buffer";
import * as Buf from "./Buffer";

export interface CurrentLine {
    beforeCursor: string;
    afterCursor: string;
}

export default interface Screen {
    currentLine: CurrentLine;
    beforeLine: string;
    afterLine: string;
}

export const empty: Readonly<Screen> = {
    currentLine: {
        beforeCursor: '',
        afterCursor: ''
    },
    beforeLine: '',
    afterLine: ''
}

export const fromBuffer = (buffer: Readonly<Buffer>) => {
    const { before, after } = buffer;
    const lineStart = before.lastIndexOf('\n');
    let lineEnd = after.indexOf('\n');
    if (lineEnd < 0) {
        lineEnd = after.length;
    }

    const beforeLine = before.substring(0, lineStart + 1);
    const afterLine = after.substring(lineEnd + 1);

    const beforeCursor = before.substring(lineStart + 1);
    let afterCursor = after.substring(0, lineEnd);
    if (afterCursor === '') {
        afterCursor = ' ';
    }

    return {
        currentLine: {
            beforeCursor, afterCursor
        },
        beforeLine, afterLine
    };
};
