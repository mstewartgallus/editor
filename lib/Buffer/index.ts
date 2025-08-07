export default interface Buffer {
    before: string;
    selection: string;
    after: string;
}

export const empty: Readonly<Buffer> = {
    before: '',
    selection: '',
    after: ''
};

export const insert = ({ before, selection, after }: Readonly<Buffer>, data: string) => {
    return {
        before: before + data,
        selection: '',
        after
    };
};

// FIXME...
export const deleteBackwards = ({ before, selection, after }: Readonly<Buffer>) => {
    if (selection === '') {
        before = before.substring(0, before.length - 1);
    }
    return {
        before,
        selection: '',
        after
    };
};

export const caretLeft = (
    { before, selection, after }: Readonly<Buffer>
) => {
    return {
        before: before.substring(0, before.length - 1),
        selection: '',
        after: before.substring(before.length - 1) + selection + after
    };
};

export const caretRight = (
    { before, selection, after }: Readonly<Buffer>
) => {
    return {
        before: before + selection + after.substring(0, 1),
        selection: '',
        after: after.substring(1)
    };
};

export const select = (
    { before, selection, after }: Readonly<Buffer>,
    selectionStart: number, selectionEnd: number
) => {
    // FIXME... ick
    const value = before + selection + after;
    return {
        before: value.substring(0, selectionStart),
        selection: value.substring(selectionStart, selectionEnd),
        after: value.substring(selectionEnd)
    };
};

export const selectLeft = ({ before, selection, after }: Readonly<Buffer>) => {
    return {
        before: before.substring(0, before.length - 1),
        selection: before.substring(before.length - 1) + selection,
        after
    };
};

export const selectRight = ({ before, selection, after }: Readonly<Buffer>) => {
    return {
        before,
        selection: selection + after.substring(0, 1),
        after: after.substring(1)
    };
};

export const fromString = (value: string) => {
    return { before: '', selection: '', after: value };
};

export const toBlob = ({ before, selection, after }: Readonly<Buffer>) => {
    return new Blob([before, selection, after]);
};
