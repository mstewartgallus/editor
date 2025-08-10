'use client';

import type { Ref } from "react";
import { compose } from "@reduxjs/toolkit";
import { useDispatch, useSelector, useStore } from "react-redux";
import { usePersist } from "./Providers";
import { useImperativeHandle } from 'react';
import type { AppDispatch, AppStore, RootState } from "./store";
import { editorSlice } from "@/lib/features/editor/editorSlice";

export const useAppStore = useStore.withTypes<AppStore>();
const useAppSelector = useSelector.withTypes<RootState>();
const useAppDispatch = useDispatch.withTypes<AppDispatch>();

export interface EditorHandle {
    // FIXME... return more info?
    fetch(name: string, href: string): Promise<void>;

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

    useImperativeHandle(ref, () => {
        const { actions } = editorSlice;
        return {
            fetch: async (name: string, href: string) => {
                await dispatch(actions.fetch({ name, href }));
            },

            input: compose(dispatch, actions.input),

            deleteBackwards: compose(dispatch, actions.deleteBackwards),
            deleteForwards: compose(dispatch, actions.deleteForwards),

            caretLeft: compose(dispatch, actions.caretLeft),
            caretRight: compose(dispatch, actions.caretRight),

            caretUp: compose(dispatch, actions.caretUp),
            caretDown: compose(dispatch, actions.caretDown),

            select: compose(dispatch, actions.select),
            selectLeft: compose(dispatch, actions.selectLeft),
            selectRight: compose(dispatch, actions.selectRight),
        };
    }, [dispatch]);

    const { selectors } = editorSlice;
    return useAppSelector(selectors.selectView);
};
