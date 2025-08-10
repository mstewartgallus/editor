"use client";

import type { ReactNode } from "react";
import type { Store } from "redux";
import { useCallback, useRef, useState } from "react";
import { StoreProvider } from "./StoreProvider";
import { persistStore } from "redux-persist";
import { createContext, useEffect, useMemo, useContext } from "react";

interface State {
    init: boolean;
    promise: Promise<void>;
    resolve: () => void;
}

const withResolvers = <T,>() => {
    let resolve;
    let reject;
    const promise = new Promise<T>((res, rej) => {
        resolve = res;
        reject = rej;
    });
    return { promise, resolve: resolve!, reject: reject! };
};

interface Context {
    init: boolean;
    persist(): void;
}

const LibContext = createContext<Context>({
    persist: () => {},
});
LibContext.displayName = 'LibContext';

interface Props {
    children: ReactNode;
}

export const Providers = ({ children }: Readonly<Props>) => {
    const ref = useRef<State>(null);
    const storeRef = useRef<Store>(null);
    const [persisting, setPersisting] = useState(false);

    if (!ref.current) {
        const { promise, resolve } = withResolvers<void>();
        ref.current = { init: false, promise, resolve };
    }

    const persist = useCallback(() => {
        const store = storeRef.current!;
        const { init, promise, resolve } = ref.current!;

        if (!init) {
            persistStore(store, null, () => {
                setPersisting(true);
                resolve();
            });
            ref.current!.init = true;
        }

        return promise;
    }, []);
    const context = useMemo(() => ({ persist, persisting }), [persist, persisting]);
    return <StoreProvider ref={storeRef}>
        <LibContext value={context}>
           {children}
        </LibContext>
    </StoreProvider>;
};

export const usePersist = () => {
    const { persisting, persist } = useContext(LibContext);
    useEffect(() => {
        persist();
    }, [persist]);
    return persisting;
};
