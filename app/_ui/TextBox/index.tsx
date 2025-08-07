"use client";

import type { KeyboardEvent, InputEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import styles from "./TextBox.module.css";

const getCaret = () => {
    const selection = window.getSelection();
    if (!selection) {
        return [0, 0];
    }
    const range = selection.getRangeAt(0);
    return [range.startOffset, range.endOffset];
};

interface Props {
    disabled?: boolean;

    value?: string;
    selectionStart?: number;
    selectionEnd?: number;

    inputAction: (data: string) => Promise<void>;
    selectAction: (selectionStart: number, selectionEnd: number) => Promise<void>;
    backspaceAction: () => Promise<void>;
}

const TextBox = ({
    disabled = false,

    value = '',
    selectionStart = 0,
    selectionEnd = 0,
    inputAction,
    selectAction,
    backspaceAction
}: Props) => {
    const ref = useRef<HTMLDivElement>(null);
    const [focus, setFocus] = useState(false);

    const onBeforeInput = useCallback((event: InputEvent<HTMLDivElement>) => {
        event.preventDefault();
        inputAction?.(event.data);
    }, [value, inputAction]);

    const onFocus = useCallback(() => {
        setFocus(true);
    }, []);
    const onBlur = useCallback(() => {
        setFocus(false);
    }, []);

    const onMouseUp = useCallback(() => {
        const [selectionStart, selectionEnd] = getCaret();
        selectAction?.(selectionStart, selectionEnd);
    }, [selectAction]);

    const onKeyDown = useCallback((event: KeyboardEvent<HTMLDivElement>) => {
        switch (event.key) {
                // FIXME Not sure how to calculate line by line
            case 'ArrowDown':
                event.preventDefault();
                break;
            case 'ArrowUp':
                event.preventDefault();
                break;

            case 'Backspace': {
                event.preventDefault();
                backspaceAction?.();
                break;
            }

            case 'ArrowLeft': {
                event.preventDefault();
                // FIXME... put back into reducer?
                if (!event.shiftKey && !event.ctrlKey && !event.metaKey) {
                    const selection = Math.max(selectionStart - 1, 0);
                    selectAction?.(selection, selection);
                }
                if (event.shiftKey && !event.ctrlKey && !event.metaKey) {
                    const selection = Math.max(selectionStart - 1, 0);
                    selectAction?.(selection, selectionEnd);
                }
                break;
            }

            case 'ArrowRight': {
                event.preventDefault();
                if (!event.shiftKey && !event.ctrlKey && !event.metaKey) {
                    const selection = Math.min(selectionEnd + 1, value.length);
                    selectAction?.(selection, selection);
                    break;
                }
                if (event.shiftKey && !event.ctrlKey && !event.metaKey) {
                    const selection = Math.min(selectionEnd + 1, value.length);
                    selectAction?.(selectionStart, selection);
                }
                break;
            }
        }
    }, [selectionStart, selectionEnd, selectAction]);

    useEffect(() => {
        if (!focus) {
            return;
        }
        const elem = ref.current!.lastChild;
        if (!elem) {
            return;
        }

        const range = document.createRange();
        range.setStart(elem, selectionStart);
        range.setEnd(elem, selectionEnd);

        const selection = window.getSelection()!;
        selection.empty();
        selection.addRange(range);
    }, [focus, selectionStart, selectionEnd]);

    return <div
           ref={ref}
           role="textbox"
           contentEditable={!disabled} suppressContentEditableWarning={true}
           className={styles.textBox}
           onBeforeInput={onBeforeInput}
           onKeyDown={onKeyDown}
           onMouseUp={onMouseUp}
           onFocus={onFocus}
           onBlur={onBlur}
        >
       {value}
    </div>;
};

export default TextBox;
