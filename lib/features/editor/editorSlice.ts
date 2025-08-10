import type Buffer from "@/lib/Buffer";
import type Screen from "@/lib/Screen";
import type {
    SliceCaseReducers, PayloadAction, Selector, ReducerCreators
} from "@reduxjs/toolkit";
import { createAppSlice } from "@/lib/createAppSlice";
import * as Buf from "@/lib/Buffer";
import * as Scr from "@/lib/Screen";
import { createSelector } from "@reduxjs/toolkit";

interface InputAction {
    data: string;
}

interface Uninitialized {
    state: 'uninitialized';
}
interface Loading {
    state: 'loading';
}
interface Error {
    state: 'error';
}
interface Open {
    state: 'open';
    name: string;
    buffer: Buffer;
}
export type EditorSliceState = Uninitialized | Open | Loading | Error;

type EditorSelector<T> = Selector<EditorSliceState, T>;

type EditorSliceCaseReducers = SliceCaseReducers<EditorSliceState>;

const uninitializedState: EditorSliceState = {
    state: 'uninitialized'
};
const errorState: EditorSliceState = {
    state: 'error'
};
const loadingState: EditorSliceState = {
    state: 'loading'
};

const reducers = (create: ReducerCreators<EditorSliceState>) => ({
    fetch: create.asyncThunk(
        async ({ name, href }: { name: string, href: string }) => {
            const response = await fetch(href);
            const text = await response.text();
            return { name, text };
        },
        {
            pending: () => loadingState,
            rejected: () => errorState,
            fulfilled: (state: EditorSliceState, { payload: { name, text } }) => ({
                state: 'open',
                name: name,
                buffer: Buf.fromString(text)
            })
        }
    ),

    init: create.preparedReducer(
        (name: string) => ({ payload: name }),
        (state, { payload: name }) => {
            if (state.state !== 'uninitialized') {
                throw Error("not uninitialized");
            }

            return {
                state: 'open',
                name: name,
                buffer: Buf.empty
            };
        }),

    input: create.preparedReducer(
        (data: string) => ({ payload: { data } }),
        (state, { payload: { data } }: PayloadAction<InputAction>) => {
            if (state.state !== 'open') {
                throw Error("not an open buffer");
            }
            if (data === '\r' || data === '\n') {
                state.buffer = Buf.newLine(state.buffer);
            } else {
                state.buffer = Buf.insert(state.buffer, data);
            }
        }),

    deleteBackwards: create.preparedReducer(
        () => ({ payload: null }),
        state => {
            if (state.state !== 'open') {
                throw Error("not an open buffer");
            }
            state.buffer = Buf.deleteBackwards(state.buffer);
        }),
    deleteForwards: create.preparedReducer(
        () => ({ payload: null }),
        state => {
            if (state.state !== 'open') {
                throw Error("not an open buffer");
            }
            state.buffer = Buf.deleteForwards(state.buffer);
        }),

    caretLeft: create.preparedReducer(
        () => ({ payload: null }),
        state => {
            if (state.state !== 'open') {
                throw Error("not an open buffer");
            }
            state.buffer = Buf.caretLeft(state.buffer);
        }),
    caretRight: create.preparedReducer(
        () => ({ payload: null }),
        state => {
            if (state.state !== 'open') {
                throw Error("not an open buffer");
            }
            state.buffer = Buf.caretRight(state.buffer);
        }),

    caretUp: create.preparedReducer(
        () => ({ payload: null }),
        state => {
            if (state.state !== 'open') {
                throw Error("not an open buffer");
            }
            state.buffer = Buf.caretUp(state.buffer);
        }),
    caretDown: create.preparedReducer(
        () => ({ payload: null }),
        state => {
            if (state.state !== 'open') {
                throw Error("not an open buffer");
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
});

const selectState: EditorSelector<EditorSliceState['state']> =
    (state: EditorSliceState) => state.state;

const selectBuffer = (state: EditorSliceState) => {
    if (state.state !== 'open') {
        return null;
    }
    return state.buffer;
};

const selectName = (state: EditorSliceState) => {
    if (state.state !== 'open') {
        return null;
    }
    return state.name;
};

interface UninitializedView {
    state: 'uninitialized';
}
interface LoadingView {
    state: 'loading';
}
interface ErrorView {
    state: 'error';
}
interface OpenView {
    state: 'open';
    name: string;
    screen: Screen;
    asBlob: () => Blob;
}
type View = UninitializedView | LoadingView | ErrorView | OpenView;

const selectView: EditorSelector<View> = createSelector(
    [selectState, selectBuffer, selectName],
    (state, buffer, name) => {
        switch (state) {
            case 'open':
                return {
                    state: 'open',
                    name: name!,
                    screen: Scr.fromBuffer(buffer!),
                    asBlob: () => Buf.toBlob(buffer!)
                };

            case 'loading':
                return { state: 'loading' };

            case 'error':
                return { state: 'error' };

            case 'uninitialized':
                return { state: 'uninitialized' };
        }
    });

const selectors = {
    selectView
};

export const editorSlice = createAppSlice<EditorSliceState, EditorSliceCaseReducers, 'editor', typeof selectors, 'editor'>({
    name: "editor",
    reducers,
    selectors,
    initialState: uninitializedState
});
