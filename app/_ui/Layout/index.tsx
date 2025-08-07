"use client";

import type { ReactNode } from "react";

import styles from "./Layout.module.css";

interface Props {
    heading?: ReactNode;
    menu?: ReactNode;
    children?: ReactNode;
}

const Layout = ({
    heading,
    menu,
    children
}: Props) =>
    <div className={styles.editorWrapper}>
       <div className={styles.menu}>
          {heading}
          {menu}
       </div>
       {children}
    </div>;

export default Layout;
