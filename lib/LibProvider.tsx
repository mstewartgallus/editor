"use client";

import type { ReactNode } from "react";
import { createContext, useEffect, useContext } from "react";

interface Context {
    persist(): void;
}

const LibContext = createContext<Context>({
    persist: () => {},
});
LibContext.displayName = 'LibContext';

type Props = Context & {
    children: ReactNode;
}

export const LibProvider = ({ children, ...props }: Props) =>
    <LibContext value={props}>{children}</LibContext>;

export const usePersist = () => {
    const { persist } = useContext(LibContext);
    useEffect(() => {
        persist();
    }, [persist]);
};
