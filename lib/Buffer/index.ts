export default interface Buffer {
    before: string;
    after: string;
}

export const empty: Readonly<Buffer> = {
    before: '',
    after: ''
};

export const insert = ({ before, after }: Readonly<Buffer>, data: string) => {
    const newData = data.replace('\r', '\n');
    return {
        before: before + newData,
        after
    };
};

export const deleteBackwards = ({ before, after }: Readonly<Buffer>) => {
    return {
        before: before.substring(0, before.length - 1),
        after
    };
};

export const deleteForwards = ({ before, after }: Readonly<Buffer>) => {
    return {
        before,
        after: after.substring(1)
    };
};

export const caretLeft = (
    { before, after }: Readonly<Buffer>
) => {
    return {
        before: before.substring(0, before.length - 1),
        after: before.substring(before.length - 1) + after
    };
};

export const caretRight = (
    { before, after }: Readonly<Buffer>
) => {
    return {
        before: before + after.substring(0, 1),
        after: after.substring(1)
    };
};

export const caretUp = (
    { before, after }: Readonly<Buffer>
) => {
    const index = before.lastIndexOf('\n', before.length);
    return {
        before: before.substring(0, index),
        after: before.substring(index) + after
    };
};

export const caretDown = (
    { before, after }: Readonly<Buffer>
) => {
    const index = after.indexOf('\n', 1);
    return {
        before: before + after.substring(0, index),
        after: after.substring(index)
    };
};

export const fromString = (value: string) => {
    return { before: '', after: value };
};

export const fromArrayBuffer = (buffer: ArrayBuffer) => {
    const textDecoder = new TextDecoder();
    return fromString(textDecoder.decode(buffer));
};

export const toBlob = ({ before, after }: Readonly<Buffer>) => {
    return new Blob([before, after]);
};
