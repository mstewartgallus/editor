"use client";

import type { ReactNode } from "react";
import { createContext, useCallback, useContext, useMemo, useState } from "react";

import styles from "./Disclosure.module.css";

interface Context {
    expanded: boolean;
    toggleAction?: () => Promise<void>;
}

const DisclosureContext = createContext<Context>({
    expanded: false
});

interface ButtonProps {
    children?: ReactNode;
}

export const DisclosureButton = ({ children }: ButtonProps) => {
    const { expanded, toggleAction } = useContext(DisclosureContext);
    return <button aria-expanded={expanded} onClick={toggleAction}>
           {children}
       </button>;
};

interface ContentsProps {
    children?: ReactNode;
}

export const DisclosureContents = ({ children }: ContentsProps) => {
    const { expanded } = useContext(DisclosureContext);
    if (!expanded) {
        return;
    }
    return <div>{children}</div>;
};

interface Props {
    children: ReactNode;
}

export const Disclosure = ({
    children
}: Props) => {
    const [expanded, setExpanded] = useState(false);
    const toggleAction = useCallback(async () => {
        setExpanded(o => !o);
    }, []);
    const context = useMemo(() => ({
        expanded,
        toggleAction
    }), [expanded]);
    return <div className={styles.disclosure}>
          <DisclosureContext value={context}>
             {children}
           </DisclosureContext>
        </div>;
};
