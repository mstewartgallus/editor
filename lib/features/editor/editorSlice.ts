import type Buffer from "@/lib/Buffer";
import type { PayloadAction, Selector } from "@reduxjs/toolkit";
import { createAppSlice } from "@/lib/createAppSlice";
import * as Buf from "@/lib/Buffer";
import * as Scr from "@/lib/Screen";
import { createSelector } from "@reduxjs/toolkit";


export interface EditorSliceState {
    loading: boolean;
    name: string | null;
    buffer: Buffer | null;
}

interface InputAction {
    data: string;
}

const initialState: Readonly<EditorSliceState> = {
    loading: false,
    name: null,
    buffer: null
};

type EditorSelector<T> = Selector<EditorSliceState, T>;

const selectBuffer: EditorSelector<Buffer | null> = state => state.buffer;
const selectLoading: EditorSelector<boolean> = state => state.loading;

export const editorSlice = createAppSlice({
    name: "editor",

    initialState,

    reducers: create => ({
        init: create.preparedReducer(
            (name: string) => ({ payload: name }),
            (state, { payload: name }) => {
                if (state.loading) {
                    throw Error("still loading");
                }
                state.buffer = Buf.empty;
                state.name = name;
            }),

        clear: create.preparedReducer(
            () => ({ payload: null }),
            state => {
                state.loading = false;
                state.buffer = null;
                state.name = null;
            }),

        fetch: create.asyncThunk(
            async ({ name, href }: { name: string, href: string }) => {
                const response = await fetch(href);
                const text = await response.text();
                return { name, text };
            },
            {
                pending: state => {
                    state.loading = true
                    state.buffer = Buf.empty;
                },
                rejected: state => {
                    state.loading = false
                },
                fulfilled: (state, { payload: { name, text } }) => {
                    state.loading = false
                    state.name = name;
                    state.buffer = Buf.fromString(text);
                }
            }
        ),

        input: create.preparedReducer(
            (data: string) => ({ payload: { data } }),
            (state, { payload: { data } }: PayloadAction<InputAction>) => {
                if (state.buffer === null) {
                    throw Error("not initialize");
                }
                state.buffer = Buf.insert(state.buffer, data);
            }),

        deleteBackwards: create.preparedReducer(
            () => ({ payload: null }),
            state => {
                if (state.buffer === null) {
                    throw Error("not initialize");
                }
                state.buffer = Buf.deleteBackwards(state.buffer);
            }),
        deleteForwards: create.preparedReducer(
            () => ({ payload: null }),
            state => {
                if (state.buffer === null) {
                    throw Error("not initialize");
                }
                state.buffer = Buf.deleteForwards(state.buffer);
            }),

        caretLeft: create.preparedReducer(
            () => ({ payload: null }),
            state => {
                if (state.buffer === null) {
                    throw Error("not initialize");
                }
                state.buffer = Buf.caretLeft(state.buffer);
            }),
        caretRight: create.preparedReducer(
            () => ({ payload: null }),
            state => {
                if (state.buffer === null) {
                    throw Error("not initialize");
                }
                state.buffer = Buf.caretRight(state.buffer);
            }),

        caretUp: create.preparedReducer(
            () => ({ payload: null }),
            state => {
                if (state.buffer === null) {
                    throw Error("not initialize");
                }
                state.buffer = Buf.caretUp(state.buffer);
            }),
        caretDown: create.preparedReducer(
            () => ({ payload: null }),
            state => {
                if (state.buffer === null) {
                    throw Error("not initialize");
                }
                state.buffer = Buf.caretDown(state.buffer);
            }),

        select: create.preparedReducer(
            (selectionStart: number, selectionEnd: number) => ({ payload: { selectionStart, selectionEnd } }),
            () => {
                throw Error("todo");
            }),
        selectLeft: create.preparedReducer(
            () => ({ payload: null }),
            () => {
                throw Error("todo");
            }),
        selectRight: create.preparedReducer(
            () => ({ payload: null }),
            () => {
                throw Error("todo");
            })
    }),

    selectors: {
        selectScreen: createSelector(
            selectBuffer,
            buf =>
                buf === null
                ? null
                : Scr.fromBuffer(buf)
        ),
        selectAsBlob: createSelector(selectBuffer, buf => {
            if (buf === null) {
                return null;
            }
            return () => Buf.toBlob(buf);
        }),
        selectInit: createSelector(
            [selectBuffer],
            buf => !!buf),
        selectDisabled: createSelector(
            [selectLoading, selectBuffer],
            (loading, buf) => loading || !buf),
        selectName: state => state.name,
    },
});
