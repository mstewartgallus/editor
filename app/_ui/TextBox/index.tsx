"use client";

import styles from "./TextBox.module.css";

interface Props {
    value?: string;
}

const TextBox = ({ value = '' }: Props) =>
    <div contentEditable={true} suppressContentEditableWarning={true} className={styles.textBox}>
       {value}
    </div>;

export default TextBox;
