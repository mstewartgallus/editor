import type Caret from "../Caret";
import * as Crt from "../Caret";

export default interface Selection {
    start: Caret;
    end: Caret;
}

export const start: Readonly<Selection> = {
    start: Crt.start,
    end: Crt.start
};
