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
