export default interface Caret {
    line: number;
    character: number;
}

export const start: Readonly<Caret> = {
    line: 0,
    character: 0
};
