"use client";

import type { ReactNode, KeyboardEvent, Ref } from "react";
import type Caret from "@/lib/Caret";
import { useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";

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
    const onKeyDown = useCallback((event: KeyboardEvent<HTMLSpanElement>) => {
        const { shiftKey, altKey, ctrlKey, metaKey } = event;
        if (!keyAction?.(event.key, { shiftKey, altKey, metaKey, ctrlKey })) {
            event.preventDefault();
        }
    }, [keyAction]);

    // React doesn't really give us enough control here unfortunately
    // and just abuses TextEvent

    // I think the caret trick doesn't really work and you need to
    // just handle all the inputType events...
    const onBeforeInput = useCallback((event: InputEvent) => {
        //  https://w3c.github.io/input-event
        event.preventDefault();
        switch (event.inputType) {
            case 'insertFromYank':
            case 'insertFromDrop':
            case 'insertFromPaste':
            case 'insertText':
                inputAction?.(event.data);
                break;

            case 'insertLineBreak':
                inputAction?.(' ');
                break;

            default:
                console.warn(`unhandled input event type ${event.inputType}`);
                break;
        }
    }, [inputAction]);
    useEffect(() => {
        const aborter = new AbortController();
        ref.current!.addEventListener('beforeinput', onBeforeInput, {
            signal: aborter.signal
        });
        return () => aborter.abort();
    }, [onBeforeInput]);
    return <span className={styles.caret} ref={ref}
       contentEditable={disabled ? undefined : "plaintext-only"}
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
        <div className={styles.linetrailing}>
        <div className={styles.lineno} />
        <div className={styles.linecontent} />
        </div>
        </div>;
};

export default TextBox;
