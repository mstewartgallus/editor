"use client";

import type { ReactNode, KeyboardEvent, InputEvent, Ref } from "react";
import type Screen from "@/lib/Screen";
import type Caret from "@/lib/Caret";
import * as Scr from "@/lib/Screen";
import { useCallback, useImperativeHandle, useRef, useState } from "react";

import styles from "./TextBox.module.css";

interface LineProps {
    children?: ReactNode;
    index: number;
    selected?: boolean;
}

const Line = ({children, index, selected = false}: LineProps) => {
    return <div className={styles.line} data-current={selected}>
        <div className={styles.lineno}>{index}</div>
        <div className={styles.linecontent}>{children}</div>
    </div>;
};

interface LinesProps {
    children: ReactNode;
    start: number;
    lines: readonly string[];
    caret: Readonly<Caret>;
}

const Lines = ({ children, start, lines, caret }: LinesProps) =>
    lines.map((contents, ix) => {
        const index = start + ix;
        const selected = caret.line === index;
        const key = selected ? 'selected' : index;
        return <Line key={key} index={index} selected={selected}>
            {
                selected
                    ? <>
                    {contents.slice(0, caret.character)}
                    {children}
                    {contents.slice(caret.character)}
                    </>
                    : contents
            }
            {' '}
        </Line>;
    });

interface Modifiers {
    altKey: boolean;
    ctrlKey: boolean;
    metaKey: boolean;
    shiftKey: boolean;
}

interface CaretHandle {
    focus(): void;
}

interface CaretProps {
    ref: Ref<CaretHandle>;
    disabled: boolean;

    // FIXME... make work async
    keyAction?: (key: string, modifiers: Readonly<Modifiers>) => boolean;
    inputAction?: (data: string) => Promise<void>;

    focusAction?: () => Promise<void>;
    blurAction?: () => Promise<void>;
}

const Caret = ({
    ref: handleRef,
    disabled,
    keyAction, inputAction,
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
    const onKeyDown = useCallback((event: KeyboardEvent<HTMLSpanElement>) => {
        const { shiftKey, altKey, ctrlKey, metaKey } = event;
        if (!keyAction?.(event.key, { shiftKey, altKey, metaKey, ctrlKey })) {
            event.preventDefault();
        }
    }, [keyAction]);
    return <span className={styles.caret} ref={ref}
       contentEditable={!disabled} suppressContentEditableWarning={true}
       onBeforeInput={onBeforeInput}
       onKeyDown={onKeyDown}
       onFocus={focusAction} onBlur={blurAction} />;
};

interface Props {
    disabled?: boolean;
    start: number;
    lines: readonly string[];
    caret: Readonly<Caret>;
    inputAction?: (data: string) => Promise<void>;
    keyAction?: (key: string, modifiers: Modifiers) => boolean;
}

const TextBox = ({
    disabled = false,

    start, lines, caret,

    inputAction,
    keyAction
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
        caretRef.current?.focus();
    }, []);

    return <div role="textbox" className={styles.contents} onClick={onClick} data-focus={focus}>
        <Lines start={start} lines={lines} caret={caret}>
            <Caret ref={caretRef} disabled={disabled}
                keyAction={keyAction}
                inputAction={inputAction}
                focusAction={focusAction} blurAction={blurAction} />
        </Lines>
        </div>;
};

export default TextBox;
