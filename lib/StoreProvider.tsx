"use client";

import type { ReactNode, Ref } from "react";
import type { Store } from "@reduxjs/toolkit";
import { makeStore } from "@/lib/store";
import { setupListeners } from "@reduxjs/toolkit/query";
import { useImperativeHandle, useEffect, useRef } from "react";
import { Provider } from "react-redux";

interface Props {
    readonly children: ReactNode;
    readonly ref: Ref<Store>
}

export const StoreProvider = ({ ref, children }: Props) => {
    const storeRef = useRef<Store>(null);

    if (!storeRef.current) {
        storeRef.current = makeStore();
    }

    useImperativeHandle(ref, () => storeRef.current!, []);

    useEffect(() => setupListeners(storeRef.current!.dispatch), []);

    return <Provider store={storeRef.current!}>
            {children}
    </Provider>;
};
