"use client";

import styles from "./TextBox.module.css";

const TextBox = () =>
    <div contentEditable={true} suppressContentEditableWarning={true} className={styles.textBox} />;

export default TextBox;
