"use client";

import type { EditorHandle } from "@/lib";
import type Screen from "@/lib/Screen";
import { useCallback, useEffect, useId, useMemo, useRef } from "react";
import { useEditor } from "@/lib";
import * as Scr from "@/lib/Screen";
import Menu from "../Menu";
import Layout from "../Layout";
import TextBox from "../TextBox";

import styles from "./Editor.module.css";

const chooseFile = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    await new Promise<void>((res) => {
        input.onchange = () => {
            res();
        };
        input.click();
    });
    const files = input.files;
    if (!files) {
        return [];
    }
    return [...files];
};

const download = (blob: Blob, download?: string) => {
    const href = URL.createObjectURL(blob);
    try {
        const anchor = document.createElement('a');
        anchor.href = href;
        if (download) {
            anchor.download = download;
        }
        anchor.click();
    } finally {
        URL.revokeObjectURL(href);
    }
};

interface Modifiers {
    altKey: boolean;
    ctrlKey: boolean;
    metaKey: boolean;
    shiftKey: boolean;
}

interface Props {
    disabled?: boolean;
    value?: Readonly<Screen>;
    inputAction?: (data: string) => Promise<void>;
    keyAction?: (key: string, modifiers: Modifiers) => boolean;
}

const Page = ({ disabled, value = Scr.empty, inputAction, keyAction }: Props) => {
    const { start, lines, caret } = value;
    return <div className={styles.textBox}>
            <div className={styles.textBoxInner}>
                <TextBox start={start} lines={lines} caret={caret}
                     disabled={disabled} inputAction={inputAction} keyAction={keyAction} />
            </div>
        </div>;
};

const Editor = () => {
    const ref = useRef<EditorHandle>(null);
    const { persisting, ...view } = useEditor(ref);

    const shouldInitialize = persisting && view.state === 'uninitialized';
    useEffect(() => {
        if (!shouldInitialize) {
            return;
        }
        ref.current!.init('Blank');
    }, [shouldInitialize]);

    const disabled = view.state !== 'open';

    const screen = view.state === 'open' ? view.screen : undefined;
    const asBlob = view.state === 'open' ? view.asBlob : null;

    const name = (() => {
        switch (view.state) {
            case 'open':
                return view.name;
            case 'loading':
                return 'Loading...';
            case 'error':
                return 'Error!';
            case 'uninitialized':
                return 'Initializing...';
        }
    })();

    const title = name;

    const downloadAction = useMemo(() => {
        if (asBlob === null) {
            return;
        }
        return async () => {
            download(asBlob(), title);
        };
    }, [asBlob, title]);

    const uploadAction = useCallback(async () => {
        const file = (await chooseFile())[0];
        const name = file.name;

        const href = URL.createObjectURL(file);
        try {
            await ref.current!.fetch(name, href);
        } finally {
            URL.revokeObjectURL(href);
        }
    }, []);

    const inputAction = useCallback(async (data: string) => {
        let first = true;
        for (const line of data.split('\n')) {
            if (!first) {
                // FIXME... simplify
                ref.current!.newLine();
            }
            first = false;
            ref.current!.input(line);
        }
    }, []);

    const keyAction = useCallback((key: string, modifiers: Readonly<Modifiers>) => {
        switch (key) {
            case 'Backspace':
                ref.current!.deleteBackwards();
                return false;

            case 'Delete':
                ref.current!.deleteForwards();
                return false;

            case 'ArrowUp':
                if (!modifiers.ctrlKey && !modifiers.metaKey && !modifiers.shiftKey) {
                    ref.current!.caretUp();
                }
                return false;

            case 'ArrowDown':
                if (!modifiers.ctrlKey && !modifiers.metaKey && !modifiers.shiftKey) {
                    ref.current!.caretDown();
                }
                return false;

            case 'ArrowLeft':
                if (!modifiers.ctrlKey && !modifiers.metaKey) {
                    if (modifiers.shiftKey) {
                        ref.current!.selectLeft();
                    } else {
                        ref.current!.caretLeft();
                    }
                }
                return false;

            case 'ArrowRight':
                if (!modifiers.ctrlKey && !modifiers.metaKey) {
                    if (modifiers.shiftKey) {
                        ref.current!.selectRight();
                    } else {
                        ref.current!.caretRight();
                    }
                }
                return false;
        }
        return true;
    }, []);

    const h1Id = useId();
    const disclosureButtonId = useId();

    return <main aria-describedby={h1Id}>
        <title>{title}</title>
        <Layout
            heading={
                <header>
                    <h1 id={h1Id} className={styles.h1}>{title}</h1>
                </header>}
            menu={
                <section aria-describedby={disclosureButtonId}>
                    <Menu disabled={disabled}
                        downloadAction={downloadAction}
                        uploadAction={uploadAction}
                    >
                       <span id={disclosureButtonId}>Menu</span>
                    </Menu>
                </section>
            }>
                <Page value={screen} disabled={disabled} keyAction={keyAction} inputAction={inputAction} />
            </Layout>
        </main>;
};

export default Editor;
