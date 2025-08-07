"use client";

import type { ReactNode } from "react";

import styles from "./Layout.module.css";

interface Props {
    menu?: ReactNode;
    children?: ReactNode;
}

const Layout = ({
    menu,
    children
}: Props) =>
    <div className={styles.editorWrapper}>
       <nav className={styles.menu}>{menu}</nav>
       {children}
    </div>;

export default Layout;
