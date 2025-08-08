import type { PayloadAction, Selector } from "@reduxjs/toolkit";
import type Buffer from "../../Buffer";
import * as Buf from "../../Buffer";
import * as Scr from "../../Screen";
import { createSelector, createSlice } from "@reduxjs/toolkit";

export interface EditorSliceState {
    loading: boolean;
    name: string | null;
    buffer: Buffer;
}

interface ChooseFileAction {
    name: string;
}

interface ReadFileAction {
    result: string;
}

interface InputAction {
    data: string;
}

const initialState: Readonly<EditorSliceState> = {
    loading: false,
    name: null,
    buffer: Buf.empty
};

type EditorSelector<T> = Selector<EditorSliceState, T>;

const selectBuffer: EditorSelector<Buffer> = state => state.buffer;

export const editorSlice = createSlice({
    name: "editor",

    initialState,

    reducers: create => ({
        chooseFile: create.preparedReducer(
            (name: string) => ({ payload: { name } }),
            (state, { payload: { name } }: PayloadAction<ChooseFileAction>) => {
                state.loading = true;
                state.name = name;
                state.buffer = Buf.empty;
            }),

        readFile: create.preparedReducer(
            (result: string) => ({ payload: { result } }),
            (state, { payload: { result } }: PayloadAction<ReadFileAction>) => {
                state.loading = false;
                state.buffer = Buf.fromString(result);
            }),

        input: create.preparedReducer(
            (data: string) => ({ payload: { data } }),
            (state, { payload: { data } }: PayloadAction<InputAction>) => {
                state.buffer = Buf.insert(state.buffer, data);
            }),

        deleteBackwards: create.preparedReducer(
            () => ({ payload: null }),
            state => {
                state.buffer = Buf.deleteBackwards(state.buffer);
            }),
        deleteForwards: create.preparedReducer(
            () => ({ payload: null }),
            state => {
                state.buffer = Buf.deleteForwards(state.buffer);
            }),

        caretLeft: create.preparedReducer(
            () => ({ payload: null }),
            state => {
                state.buffer = Buf.caretLeft(state.buffer);
            }),
        caretRight: create.preparedReducer(
            () => ({ payload: null }),
            state => {
                state.buffer = Buf.caretRight(state.buffer);
            }),

        caretUp: create.preparedReducer(
            () => ({ payload: null }),
            state => {
                state.buffer = Buf.caretUp(state.buffer);
            }),
        caretDown: create.preparedReducer(
            () => ({ payload: null }),
            state => {
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
        selectScreen: createSelector(selectBuffer, Scr.fromBuffer),
        selectAsBlob: createSelector(selectBuffer, buf => () => Buf.toBlob(buf)),
        selectLoading: state => state.loading,
        selectName: state => state.name,
    },
});

export const {
    chooseFile,
    readFile,

    input,

    deleteBackwards, deleteForwards,

    caretLeft, caretRight,

    caretUp, caretDown,
    select,
    selectLeft, selectRight
} = editorSlice.actions;

export const {
    selectAsBlob,
    selectScreen,
    selectLoading,
    selectName
} = editorSlice.selectors;
