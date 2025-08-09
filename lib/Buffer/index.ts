import type Caret from "../Caret";
import * as Crt from "../Caret";

export default interface Buffer {
    lines: string[];
    caret: Caret;
}

export const empty: Readonly<Buffer> = {
    lines: [''],
    caret: Crt.start
};

export const newLine = ({ lines, caret }: Readonly<Buffer>) => {
    const line = lines[caret.line];
    const before = line.substring(0, caret.character);
    const after = line.substring(caret.character);
    const newCaret = {
        line: caret.line + 1,
        character: 0
    };
    return {
        lines: lines
            .toSpliced(caret.line, 1, before, after),
        caret: newCaret
    };
};

export const insert = ({ lines, caret }: Readonly<Buffer>, data: string) => {
    const line = lines[caret.line];
    const newLine = line.substring(0, caret.character) + data + line.substring(caret.character);
    const newCaret = {
        line: caret.line,
        character: caret.character + data.length
    };
    return {
        lines: lines.with(caret.line, newLine),
        caret: newCaret
    };
};

export const deleteBackwards = ({ lines, caret }: Readonly<Buffer>) => {
    const line = lines[caret.line];
    const newLine = line.substring(0, caret.character - 1) + line.substring(caret.character);
    return {
        lines: lines.with(caret.line, newLine),
        caret: {
            line: caret.line,
            character: caret.character - 1
        }
    };
};

export const deleteForwards = ({ lines, caret }: Readonly<Buffer>) => {
    const line = lines[caret.line];
    const newLine = line.substring(0, caret.character) + line.substring(caret.character + 1);
    return {
        lines: lines.with(caret.line, newLine),
        caret
    };
};

export const caretLeft = ({ lines, caret }: Readonly<Buffer>) => {
    const { line, character } = caret;
    return {
        lines,
        caret: {
            line,
            character: Math.max(character - 1, 0)
        }
    };
};

export const caretRight = ({ lines, caret }: Readonly<Buffer>) => {
    const { line, character } = caret;
    return {
        lines,
        caret: {
            line,
            character: Math.min(character + 1, lines[line].length)
        }
    };
};

export const caretUp = ({ lines, caret }: Readonly<Buffer>) => {
    const { line, character } = caret;
    const newLine = Math.max(0, line - 1);
    return {
        lines,
        caret: {
            line: newLine,
            character: Math.min(character, lines[newLine].length)
        }
    };
};

export const caretDown = ({ lines, caret }: Readonly<Buffer>) => {
    const { line, character } = caret;
    const newLine = Math.min(lines.length, line + 1);
    return {
        lines,
        caret: {
            line: newLine,
            character: Math.min(character, lines[newLine].length)
        }
    };
};

export const fromString = (value: string) => {
    return {
        lines: value.split('\n'),
        caret: Crt.start
    };
};

export const fromArrayBuffer = (buffer: ArrayBuffer) => {
    const textDecoder = new TextDecoder();
    return fromString(textDecoder.decode(buffer));
};

export const toBlob = ({ lines }: Readonly<Buffer>) => {
    return new Blob(lines);
};
