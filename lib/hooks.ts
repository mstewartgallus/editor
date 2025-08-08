'use client';

import type { Ref } from "react";
import { compose } from "redux";
import { useDispatch, useSelector, useStore } from "react-redux";
import { usePersist } from "./LibProvider";
import { useImperativeHandle } from 'react';
import type { AppDispatch, AppStore, RootState } from "./store";
import {
    selectAsBlob,
    selectScreen,
    selectLoading,
    selectName,

    chooseFile,
    readFile,
    input,

    deleteBackwards, deleteForwards,

    caretLeft, caretRight,

    caretUp, caretDown,
    select,
    selectLeft, selectRight
} from "@/lib/features/editor/editorSlice";

export const useAppStore = useStore.withTypes<AppStore>();
const useAppSelector = useSelector.withTypes<RootState>();
const useAppDispatch = useDispatch.withTypes<AppDispatch>();

// FIXME setup a separate thing for each page?
export interface EditorHandle {
    chooseFile(name: string): void;
    readFile(result: string): void;
    input(data: string): void;

    deleteBackwards(): void;
    deleteForwards(): void;

    caretLeft(): void;
    caretRight(): void;

    caretUp(): void;
    caretDown(): void;

    select(selectionStart: number, selectionEnd: number): void;
    selectLeft(): void;
    selectRight(): void;
}

export const useEditor = (ref: Ref<EditorHandle>) => {
    usePersist();

    const dispatch = useAppDispatch();

    useImperativeHandle(ref, () => ({
        chooseFile: compose(dispatch, chooseFile),
        readFile: compose(dispatch, readFile),

        input: compose(dispatch, input),

        deleteBackwards: compose(dispatch, deleteBackwards),
        deleteForwards: compose(dispatch, deleteForwards),

        caretLeft: compose(dispatch, caretLeft),
        caretRight: compose(dispatch, caretRight),

        caretUp: compose(dispatch, caretUp),
        caretDown: compose(dispatch, caretDown),

        select: compose(dispatch, select),
        selectLeft: compose(dispatch, selectLeft),
        selectRight: compose(dispatch, selectRight),
    }), [dispatch]);

    return {
        asBlob: useAppSelector(selectAsBlob),
        screen: useAppSelector(selectScreen),
        loading: useAppSelector(selectLoading),
        name: useAppSelector(selectName)
    };
};
