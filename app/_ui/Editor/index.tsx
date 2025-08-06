"use client";

import styles from "./Editor.module.css";

const Editor = () => 
       <div contentEditable={true} suppressContentEditableWarning={true} className={styles.editor} />


export default Editor;
