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
    loading: boolean;
    name: string | null;
    value: string;
    selectionStart: number;
    selectionEnd: number;
}

interface ChooseFileAction {
    type: 'chooseFile';
    name: string;
}

interface ReadFileAction {
    type: 'readFile';
    result: string;
}

interface InputAction {
    type: 'input';
    data: string;
}

interface SelectAction {
    type: 'select';
    selectionStart: number;
    selectionEnd: number;
}

interface BackspaceAction {
    type: 'backspace';
}

type Action =
    | ChooseFileAction
    | ReadFileAction
    | InputAction
    | SelectAction
    | BackspaceAction;

const initialState: State = {
    loading: false,
    name: null,
    value: '',
    selectionStart: 0,
    selectionEnd: 0
};

const reducer = (state: State, action: Action) => {
    switch (action.type) {
        case 'chooseFile': {
            const { name } = action;
            return {
                ...state,
                loading: true,
                name,
                value: '', selectionStart: 0, selectionEnd: 0
            };
        }

        case 'readFile': {
            const { result } = action;
            return { ...state, loading: false, value: result };
        }

        case 'input': {
            let { selectionStart, selectionEnd, value } = state;
            const { data } = action;

            value = value.substring(0, selectionStart) + data + value.substring(selectionEnd);
            selectionStart += data.length;
            selectionEnd = selectionStart;

            return {
                ...state,
                value,
                selectionStart, selectionEnd
            };
        }

        case 'select': {
            const { selectionStart, selectionEnd } = action;
            return {
                ...state,
                selectionStart, selectionEnd
            };
        }

        case 'backspace': {
            let { selectionStart, selectionEnd, value } = state;

            selectionStart -= 1;
            value = value.substring(0, selectionStart) + value.substring(selectionEnd);
            selectionEnd = selectionStart;

            return {
                ...state,
                value,
                selectionStart, selectionEnd
            };
        }
    }
};

const chooseFileAction: (name: string) => ChooseFileAction
    = (name: string) => ({ type: 'chooseFile', name });

const readFileAction: (result: string) => ReadFileAction
    = (result: string) => ({ type: 'readFile', result });

const inputAction: (result: string) => InputAction
    = (data: string) => ({ type: 'input', data });

const selectAction: (selectionStart: number, selectionEnd: number) => SelectAction
    = (selectionStart: number, selectionEnd: number) => ({ type: 'select', selectionStart, selectionEnd });

const Editor = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const {
        loading,
        name, value,
        selectionStart, selectionEnd
    } = state;

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

    const inputActionDispatch = useCallback(async (data: string) => {
        dispatch(inputAction(data));
    }, []);

    const selectActionDispatch = useCallback(async (selectionStart: number, selectionEnd: number) => {
        dispatch(selectAction(selectionStart, selectionEnd));
    }, []);

    const backspaceActionDispatch = useCallback(async () => {
        dispatch({ type: 'backspace' });
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
                                    <button disabled={!value} onClick={downloadAction}>Download</button>
                                </MenuItem>
                            </MenuList>
                        </DisclosureContents>
                    </Disclosure>
                </section>
                }
        >
              <div className={styles.scrollbox}>
              <TextBox
                     disabled={loading}
                     value={value ?? ''}
                     selectionStart={selectionStart} selectionEnd={selectionEnd}
                     inputAction={inputActionDispatch} selectAction={selectActionDispatch}
                     backspaceAction={backspaceActionDispatch}
                 />
              </div>
            </Layout>
        </main>;
};

export default Editor;
