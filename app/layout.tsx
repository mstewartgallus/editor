"use client";

import type { ReactNode } from "react";
import type { Store } from "redux";
import { useCallback, useRef } from "react";
import { LibProvider, StoreProvider } from "@/lib";
import { persistStore } from "redux-persist";

import "./_ui/styles/globals.css";

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

interface Props {
  readonly children: ReactNode;
}

const RootLayout = ({ children }: Props) => {
    const ref = useRef<State>(null);
    const storeRef = useRef<Store>(null);

    if (!ref.current) {
        const { promise, resolve } = withResolvers<void>();
        ref.current = { init: false, promise, resolve };
    }

    const persist = useCallback(() => {
        const store = storeRef.current!;
        const { init, promise, resolve } = ref.current!;

        if (!init) {
            persistStore(store, null, () => resolve());
            ref.current!.init = true;
        }

        return promise;
    }, []);

    return <html lang="en">
           <body>
                <StoreProvider ref={storeRef}>
                    <LibProvider persist={persist}>
                       {children}
                    </LibProvider>
                </StoreProvider>
          </body>
        </html>;
};

export default RootLayout;
