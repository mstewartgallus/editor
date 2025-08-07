"use client";

import type Buffer from "@/lib/Buffer";
import * as Buf from "@/lib/Buffer";
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
    value: Buffer;
}

interface ChooseFileAction {
    type: 'chooseFile';
    name: string;
}

interface ReadFileAction {
    type: 'readFile';
    result: ArrayBuffer;
}

interface InputAction {
    type: 'input';
    data: string;
}

interface BackspaceAction {
    type: 'backspace';
}

interface CaretLeftAction {
    type: 'caretLeft';
}

interface CaretRightAction {
    type: 'caretRight';
}

interface SelectLeftAction {
    type: 'selectLeft';
}

interface SelectRightAction {
    type: 'selectRight';
}

interface SelectAction {
    type: 'select';
    selectionStart: number;
    selectionEnd: number;
}

type Action =
    | ChooseFileAction
    | ReadFileAction
    | InputAction
    | BackspaceAction
    | CaretLeftAction | CaretRightAction
    | SelectAction | SelectLeftAction | SelectRightAction;

const initialState: State = {
    loading: false,
    name: null,
    value: Buf.empty
};

const reducer: (state: State, action: Action) => State = (state: State, action: Action) => {
    switch (action.type) {
        case 'chooseFile': {
            const { name } = action;
            return {
                ...state,
                loading: true,
                name,
                value: Buf.empty
            };
        }

        case 'readFile': {
            const { result } = action;
            return { ...state, loading: false, value: Buf.fromArrayBuffer(result) };
        }

        case 'input': {
            const { value } = state;
            const { data } = action;
            return {
                ...state,
                value: Buf.insert(value, data)
            };
        }

        case 'select': {
            const { value } = state;
            const { selectionStart, selectionEnd } = action;
            return {
                ...state,
                value: Buf.select(value, selectionStart, selectionEnd)
            };
        }

        case 'caretLeft':
            return {
                ...state,
                value: Buf.caretLeft(state.value)
            };

        case 'caretRight':
            return {
                ...state,
                value: Buf.caretRight(state.value)
            };

        case 'selectLeft':
            return {
                ...state,
                value: Buf.selectLeft(state.value)
            };

        case 'selectRight':
            return {
                ...state,
                value: Buf.selectRight(state.value)
            };

        case 'backspace':
            return {
                ...state,
                value: Buf.deleteBackwards(state.value)
            };
    }
};

const chooseFileAction: (name: string) => ChooseFileAction
    = (name: string) => ({ type: 'chooseFile', name });

const readFileAction: (result: ArrayBuffer) => ReadFileAction
    = (result: ArrayBuffer) => ({ type: 'readFile', result });

const inputAction: (result: string) => InputAction
    = (data: string) => ({ type: 'input', data });

const selectAction: (selectionStart: number, selectionEnd: number) => SelectAction
    = (selectionStart: number, selectionEnd: number) => ({ type: 'select', selectionStart, selectionEnd });

const Editor = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const {
        loading,
        name, value
    } = state;

    const fileRef = useRef<HTMLInputElement>(null);

    const title = name ?? 'No File';

    const downloadAction = useCallback(() => {
        if (!value) {
            return;
        }
        download(Buf.toBlob(value), title);
    }, [value, title]);

    const uploadAction = useCallback(async () => {
        const file = (await chooseFile())[0];

        dispatch(chooseFileAction(file.name));

        const result = await file.arrayBuffer();

        dispatch(readFileAction(result));
    }, []);

    const inputActionDispatch = useCallback(async (data: string) => {
        dispatch(inputAction(data));
    }, []);

    const backspaceActionDispatch = useCallback(async () => {
        dispatch({ type: 'backspace' });
    }, []);

    const selectActionDispatch = useCallback(async (selectionStart: number, selectionEnd: number) => {
        dispatch(selectAction(selectionStart, selectionEnd));
    }, []);
    const selectLeftAction = useCallback(async () => {
        dispatch({ type: 'selectLeft' });
    }, []);
    const selectRightAction = useCallback(async () => {
        dispatch({ type: 'selectRight' });
    }, []);

    const caretLeftAction = useCallback(async () => {
        dispatch({ type: 'caretLeft' });
    }, []);
    const caretRightAction = useCallback(async () => {
        dispatch({ type: 'caretRight' });
    }, []);

    const h1Id = useId();
    const disclosureButtonId = useId();

    const len = 200;
    const view = useMemo(() => {
        const { before, selection, after } = value;
        return {
            before: before.substring(before.lastIndexOf('\n', before.length - len)),
            selection,
            after: after.substring(0, after.indexOf('\n', len))
        };
    }, [value, len]);
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
                            </MenuList>
                        </DisclosureContents>
                    </Disclosure>
                </section>
                }
        >
              <TextBox
                     disabled={loading}
                     value={view}
                     inputAction={inputActionDispatch} backspaceAction={backspaceActionDispatch}
                     selectAction={selectActionDispatch} selectLeftAction={selectLeftAction} selectRightAction={selectRightAction}
                     caretLeftAction={caretLeftAction} caretRightAction={caretRightAction}
              />
            </Layout>
        </main>;
};

export default Editor;
