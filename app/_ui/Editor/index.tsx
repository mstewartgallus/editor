"use client";

import type Buffer from "@/lib/Buffer";
import type Screen from "@/lib/Screen";
import * as Buf from "@/lib/Buffer";
import {
    useCallback, useId, useReducer
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

interface CaretUpAction {
    type: 'caretUp';
}

interface CaretDownAction {
    type: 'caretDown';
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
    | CaretUpAction | CaretDownAction
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

        case 'caretUp':
            return {
                ...state,
                value: Buf.caretUp(state.value)
            };

        case 'caretDown':
            return {
                ...state,
                value: Buf.caretDown(state.value)
            };

        case 'select':
            throw Error("todo");

        case 'selectLeft':
            throw Error("todo");

        case 'selectRight':
            throw Error("todo");

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

const Editor = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const {
        loading,
        name, value
    } = state;

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

    const caretUpAction = useCallback(async () => {
        dispatch({ type: 'caretUp' });
    }, []);
    const caretDownAction = useCallback(async () => {
        dispatch({ type: 'caretDown' });
    }, []);

    const h1Id = useId();
    const disclosureButtonId = useId();

    const { before, after } = value;
    const lineStart = before.lastIndexOf('\n');
    const lineEnd = after.indexOf('\n');

    const beforeLine = before.substring(0, lineStart + 1);
    const afterLine = after.substring(lineEnd + 1);

    const beforeCursor = before.substring(lineStart + 1);
    let afterCursor = after.substring(0, lineEnd);
    if (afterCursor === '') {
        afterCursor = ' ';
    }

    const view: Screen = {
        currentLine: {
            beforeCursor, afterCursor
        },
        beforeLine, afterLine
    };

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
                     value={view}
                     inputAction={inputActionDispatch} backspaceAction={backspaceActionDispatch}
                     selectLeftAction={selectLeftAction} selectRightAction={selectRightAction}
                     caretLeftAction={caretLeftAction} caretRightAction={caretRightAction}
                     caretUpAction={caretUpAction} caretDownAction={caretDownAction}
              />
            </Layout>
        </main>;
};

export default Editor;
