"use client";

import type { ReactNode, KeyboardEvent, InputEvent, Ref } from "react";
import type Screen from "@/lib/Screen";
import * as Scr from "@/lib/Screen";
import { useCallback, useImperativeHandle, useRef, useState } from "react";

import styles from "./TextBox.module.css";

interface Line {
    contents: string;
    cursor?: number;
}

interface LineProps {
    children?: ReactNode;
    index: number;
    selected?: boolean;
}

const Line = ({children, index, selected = false}: LineProps) => {
    return <div className={styles.line} data-current={selected}>
        <span>{index}: </span>
        <span>{children}</span>
    </div>;
};

interface LinesProps {
    children: ReactNode;
    start: number;
    lines: readonly Line[];
}

const Lines = ({ children, start, lines }: LinesProps) =>
    lines.map(({ contents, cursor }, ix) => {
        const index = start + ix;
        const selected = cursor !== undefined;
        const key = selected ? 'selected' : index;
        return <Line key={key} index={index} selected={selected}>
            {
                selected
                    ? <>
                    {contents.slice(0, cursor)}
                    {children}
                    {contents.slice(cursor)}
                    </>
                    : contents
            }
            {' '}
        </Line>;
    });

interface CaretHandle {
    focus(): void;
}

interface CaretProps {
    ref: Ref<CaretHandle>;
    disabled: boolean;

    // FIXME rework handlers
    onKeyDown?: (event: KeyboardEvent<HTMLSpanElement>) => void;

    inputAction: (data: string) => Promise<void>;

    focusAction?: () => Promise<void>;
    blurAction?: () => Promise<void>;
}

const Caret = ({
    ref: handleRef,
    disabled,
    onKeyDown, inputAction,
    focusAction, blurAction
}: CaretProps) => {
    const ref = useRef<HTMLSpanElement>(null);
    useImperativeHandle(handleRef, () => ({
        focus() {
            ref.current!.focus();
        }
    }), []);
    const onBeforeInput = useCallback((event: InputEvent<HTMLSpanElement>) => {
        event.preventDefault();
        inputAction?.(event.data);
    }, [inputAction]);
    return <span className={styles.caret} ref={ref}
       contentEditable={!disabled} suppressContentEditableWarning={true}
       onBeforeInput={onBeforeInput}
       onKeyDown={onKeyDown}
       onFocus={focusAction} onBlur={blurAction} />;
};

interface Props {
    disabled?: boolean;

    value?: Screen;

    inputAction: (data: string) => Promise<void>;
    backspaceAction: () => Promise<void>;
    deleteAction: () => Promise<void>;

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
    deleteAction,

    caretLeftAction,
    caretRightAction,

    caretUpAction,
    caretDownAction,

    selectLeftAction,
    selectRightAction
}: Props) => {

    const [focus, setFocus] = useState(false);
    const caretRef = useRef<CaretHandle>(null);

    const focusAction = useCallback(async () => {
        setFocus(true);
    }, []);
    const blurAction = useCallback(async () => {
        setFocus(false);
    }, []);

    const onClick = useCallback(() => {
        caretRef.current!.focus();
    }, []);

    const onKeyDown = useCallback((event: KeyboardEvent<HTMLSpanElement>) => {
        switch (event.key) {
            case 'Backspace':
                event.preventDefault();
                backspaceAction?.();
                break;

            case 'Delete':
                event.preventDefault();
                deleteAction?.();
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
        backspaceAction, deleteAction,
        caretUpAction, caretDownAction,
        caretLeftAction, caretRightAction,
        selectLeftAction, selectRightAction
    ]);

    const {
        start,
        beforeLine,
        currentLine: { beforeCursor, afterCursor },
        afterLine
    } = value;

    const lines: Line[] = [
        ...beforeLine.map(line => ({
            contents: line
        })),
        {
            contents: beforeCursor + afterCursor,
            cursor: beforeCursor.length
        },
        ...afterLine.map(line => ({
            contents: line
        })),
    ];

    return <div role="textbox" className={styles.textBox} onClick={onClick} data-focus={focus}>
           <div className={styles.contents}>
               <Lines start={start} lines={lines}>
                   <Caret ref={caretRef} disabled={disabled}
                      onKeyDown={onKeyDown}
                      inputAction={inputAction}
                      focusAction={focusAction} blurAction={blurAction} />
               </Lines>
           </div>
        </div>;
};

export default TextBox;
