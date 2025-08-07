"use client";

import type { KeyboardEvent, InputEvent } from "react";
import type Screen from "@/lib/Screen";
import * as Scr from "@/lib/Screen";
import { useCallback, useRef, useState } from "react";

import styles from "./TextBox.module.css";

interface Props {
    disabled?: boolean;

    value?: Screen;

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

    value = Scr.empty,

    inputAction,
    backspaceAction,

    caretLeftAction,
    caretRightAction,

    caretUpAction,
    caretDownAction,

    selectLeftAction,
    selectRightAction
}: Props) => {

    const [focus, setFocus] = useState(false);
    const cursorRef = useRef<HTMLSpanElement>(null);

    const onFocus = useCallback(() => {
        setFocus(true);
    }, []);
    const onBlur = useCallback(() => {
        setFocus(false);
    }, []);

    const onBeforeInput = useCallback((event: InputEvent<HTMLSpanElement>) => {
        event.preventDefault();
        inputAction?.(event.data);
    }, [inputAction]);

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
        backspaceAction,
        caretUpAction, caretDownAction,
        caretLeftAction, caretRightAction,
        selectLeftAction, selectRightAction
    ]);

    const {
        currentLine: { beforeCursor, afterCursor },
        beforeLine, afterLine
    } = value;

    return <div role="textbox" className={styles.textBox} onClick={onClick} data-focus={focus}>
        <div className={styles.contents}>
           <div className={styles.beforeLine}>{beforeLine}</div>
        <div className={styles.section}>
        <div className={styles.currentLine}>
                 {beforeCursor}
                 <span className={styles.cursor} ref={cursorRef}
                     contentEditable={!disabled} suppressContentEditableWarning={true}
                     onBeforeInput={onBeforeInput}
                     onKeyDown={onKeyDown}
                     onFocus={onFocus} onBlur={onBlur}
                    />
                 {afterCursor}
              </div>
        <div className={styles.afterLine}>{afterLine}</div>
        </div>
           </div>
        </div>;
};

export default TextBox;
