"use client";

import type { KeyboardEvent, InputEvent } from "react";
import type Buffer from "@/lib/Buffer";
import * as Buf from "@/lib/Buffer";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import styles from "./TextBox.module.css";

interface Props {
    disabled?: boolean;

    value?: Buffer;

    inputAction: (data: string) => Promise<void>;
    backspaceAction: () => Promise<void>;

    caretLeftAction: () => Promise<void>;
    caretRightAction: () => Promise<void>;

    caretUpAction: () => Promise<void>;
    caretDownAction: () => Promise<void>;

    selectLeftAction: () => Promise<void>;
    selectRightAction: () => Promise<void>;
}

const TextBox = ({
    disabled = false,

    value = Buf.empty,

    inputAction,
    backspaceAction,

    caretLeftAction,
    caretRightAction,

    caretUpAction,
    caretDownAction,

    selectLeftAction,
    selectRightAction
}: Props) => {
    const { before, after } = value;

    const cursorRef = useRef<HTMLSpanElement>(null);

    const onBeforeInput = useCallback((event: InputEvent<HTMLSpanElement>) => {
        event.preventDefault();
        inputAction?.(event.data);
    }, [value, inputAction]);

    const onClick = useCallback(() => {
        cursorRef.current!.focus();
    }, []);

    const onKeyDown = useCallback((event: KeyboardEvent<HTMLSpanElement>) => {
        switch (event.key) {
            case 'Backspace':
                event.preventDefault();
                backspaceAction?.();
                break;

            case 'ArrowUp':
                event.preventDefault();
                if (!event.ctrlKey && !event.metaKey && !event.shiftKey) {
                    caretUpAction?.();
                }
                break;

            case 'ArrowDown':
                event.preventDefault();
                if (!event.ctrlKey && !event.metaKey && !event.shiftKey) {
                    caretDownAction?.();
                }
                break;

            case 'ArrowLeft':
                event.preventDefault();
                if (!event.ctrlKey && !event.metaKey) {
                    if (event.shiftKey) {
                        selectLeftAction?.();
                    } else {
                        caretLeftAction?.();
                    }
                }
                break;

            case 'ArrowRight':
                event.preventDefault();
                if (!event.ctrlKey && !event.metaKey) {
                    if (event.shiftKey) {
                        selectRightAction?.();
                    } else {
                        caretRightAction?.();
                    }
                }
                break;
        }
    }, [
        caretUpAction, caretDownAction,
        caretLeftAction, caretRightAction,
        selectLeftAction, selectRightAction
    ]);

    let lineStart = before.lastIndexOf('\n');
    let lineEnd = after.indexOf('\n');

    const beforeLine = before.substring(0, lineStart + 1);
    const afterLine = after.substring(lineEnd + 1);

    let lineBefore = before.substring(lineStart + 1);
    let lineAfter = after.substring(0, lineEnd);

    if (lineAfter === '') {
        lineAfter = ' ';
    }

    return <div role="textbox" className={styles.textBox} onClick={onClick}>
        <div className={styles.contents}>
        <div className={styles.beforeLine}>{beforeLine}</div>
        <div className={styles.currentLine}>
           {lineBefore}
           <span className={styles.cursor} ref={cursorRef}
               contentEditable={true} suppressContentEditableWarning={true}
               onBeforeInput={onBeforeInput}
               onKeyDown={onKeyDown}
              />
           {lineAfter}
        </div>
        <div className={styles.afterLine}>{afterLine}</div>
        </div>
        </div>;
};

export default TextBox;
