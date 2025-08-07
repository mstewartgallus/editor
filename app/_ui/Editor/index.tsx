"use client";

import {
    useCallback, useEffect, useId, useMemo, useRef, useReducer
} from "react";
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
    await new Promise<void>((res, rej) => {
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

const readFileAsText = async (file: File) => {
    const reader = new FileReader();
    await new Promise<void>((res, rej) => {
        reader.onload = () => res();
        reader.onerror = () => rej();
        reader.readAsText(file);
    });
    return reader.result as string;
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

interface State {
    name: string | null;
    value: string | null;
}

interface ChooseFileAction {
    type: 'chooseFile';
    name: string;
}

interface ReadFileAction {
    type: 'readFile';
    result: string;
}

type Action = ChooseFileAction | ReadFileAction;

const initialState: State = {
    name: null,
    value: null
};

const reducer = (state: State, action: Action) => {
    switch (action.type) {
        case 'chooseFile': {
            const { name } = action;
            return { ...state, name, value: null };
        }
        case 'readFile': {
            const { result } = action;
            return { ...state, value: result };
        }
    }
};

const chooseFileAction: (name: string) => ChooseFileAction
    = (name: string) => ({ type: 'chooseFile', name });

const readFileAction: (result: string) => ReadFileAction
    = (result: string) => ({ type: 'readFile', result });

const Editor = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { name, value } = state;

    const fileRef = useRef<HTMLInputElement>(null);

    const title = name ?? 'No File';

    const downloadAction = useCallback(() => {
        if (!value) {
            return;
        }
        download(new Blob([value]), title);
    }, [value, title]);

    const uploadAction = useCallback(async () => {
        const file = (await chooseFile())[0];

        dispatch(chooseFileAction(file.name));

        const result = await readFileAsText(file);

        dispatch(readFileAction(result));
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
                                    <button onClick={uploadAction}>Upload</button>
                                </MenuItem>
                                <MenuItem>
                                    <button disabled={!value} onClick={downloadAction}>Download</button>
                                </MenuItem>
                            </MenuList>
                        </DisclosureContents>
                    </Disclosure>
                </section>
                }
        >
              <div className={styles.scrollbox}>
                 <TextBox value={value ?? ''} />
              </div>
            </Layout>
        </main>;
};

export default Editor;
