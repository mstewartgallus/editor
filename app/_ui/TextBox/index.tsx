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

    selectLeftAction: () => Promise<void>;
    selectRightAction: () => Promise<void>;
    selectAction: (selectionStart: number, selectionEnd: number) => Promise<void>;
}

const TextBox = ({
    disabled = false,

    value = Buf.empty,

    inputAction,
    backspaceAction,

    caretLeftAction,
    caretRightAction,

    selectLeftAction,
    selectRightAction,
    selectAction
}: Props) => {
    const { before, selection, after } = value;

    const cursorRef = useRef<HTMLSpanElement>(null);
    const selectionStartRef = useRef<HTMLSpanElement>(null);
    const selectionEndRef = useRef<HTMLSpanElement>(null);

    const onBeforeInput = useCallback((event: InputEvent<HTMLSpanElement>) => {
        event.preventDefault();
        inputAction?.(event.data);
    }, [value, inputAction]);

    const onClick = useCallback(() => {
        cursorRef.current!.focus();
    }, []);

    const onKeyDown = useCallback((event: KeyboardEvent<HTMLSpanElement>) => {
        switch (event.key) {
                // FIXME Not sure how to calculate line by line
            case 'ArrowDown':
                event.preventDefault();
                break;
            case 'ArrowUp':
                event.preventDefault();
                break;

            case 'Backspace':
                event.preventDefault();
                backspaceAction?.();
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
    }, [caretLeftAction, caretRightAction, selectAction, selectLeftAction, selectRightAction]);

    return <div role="textbox" className={styles.textBox} onClick={onClick}>
        <div>...</div>
        <div>
        <span>{before}</span>
        <span ref={selectionStartRef} />
        <span className={styles.selection}>
        {selection}
        <span className={styles.cursor}>
           <span ref={cursorRef}
               contentEditable={true} suppressContentEditableWarning={true}
               onBeforeInput={onBeforeInput}
               onKeyDown={onKeyDown}
              />
           </span>
        </span>
        <span ref={selectionEndRef} />
        <span>{after}</span>
        </div>
        <div>...</div>
        </div>;
};

export default TextBox;
