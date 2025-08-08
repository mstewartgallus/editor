"use client";

import type { EditorHandle } from "@/lib";
import { useCallback, useId, useRef } from "react";
import { useEditor } from "@/lib";
import {
    MenuList, MenuItem,
    Disclosure, DisclosureButton, DisclosureContents
} from "@/ui";
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

const Editor = () => {
    const ref = useRef<EditorHandle>(null);
    const { loading, name, screen, asBlob } = useEditor(ref);

    const title = name ?? 'No File';

    const downloadAction = useCallback(() => {
        download(asBlob(), title);
    }, [asBlob, title]);

    const uploadAction = useCallback(async () => {
        const file = (await chooseFile())[0];

        ref.current!.chooseFile(file.name);

        const result = await file.text();

        ref.current!.readFile(result);
    }, []);

    const inputAction = useCallback(async (data: string) => {
        ref.current!.input(data);
    }, []);

    const backspaceAction = useCallback(async () => {
        ref.current!.deleteBackwards();
    }, []);
    const deleteAction = useCallback(async () => {
        ref.current!.deleteForwards();
    }, []);

    const selectLeftAction = useCallback(async () => {
        ref.current!.selectLeft();
    }, []);
    const selectRightAction = useCallback(async () => {
        ref.current!.selectRight();
    }, []);

    const caretLeftAction = useCallback(async () => {
        ref.current!.caretLeft();
    }, []);
    const caretRightAction = useCallback(async () => {
        ref.current!.caretRight();
    }, []);

    const caretUpAction = useCallback(async () => {
        ref.current!.caretUp();
    }, []);
    const caretDownAction = useCallback(async () => {
        ref.current!.caretDown();
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
                    <Disclosure>
                        <DisclosureButton><span id={disclosureButtonId}>Menu</span></DisclosureButton>
                        <DisclosureContents>
                            <MenuList>
                                <MenuItem>
                                   <button disabled={loading} onClick={uploadAction}>Upload</button>
                                </MenuItem>
                                <MenuItem>
                                    <button onClick={downloadAction}>Download</button>
                                </MenuItem>
                                <MenuItem>
                                    <a href="https://mstewartgallus.github.io/select-webapp">Select Another App</a>
                                </MenuItem>
                            </MenuList>
                        </DisclosureContents>
                    </Disclosure>
                </section>
                }
        >
              <TextBox
                     disabled={loading}
                     value={screen}
                     inputAction={inputAction}
                     backspaceAction={backspaceAction} deleteAction={deleteAction}
                     selectLeftAction={selectLeftAction} selectRightAction={selectRightAction}
                     caretLeftAction={caretLeftAction} caretRightAction={caretRightAction}
                     caretUpAction={caretUpAction} caretDownAction={caretDownAction}
              />
            </Layout>
        </main>;
};

export default Editor;
