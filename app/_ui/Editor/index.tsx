"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import {
    MenuList, MenuItem,
    Disclosure, DisclosureButton, DisclosureContents
} from "@/ui";
import Layout from "../Layout";
import TextBox from "../TextBox";

import styles from "./Editor.module.css";

const useObjectURL = (blob?: Blob) => {
    const [url, setURL] = useState<string | null>(null);
    useEffect(() => {
        if (!blob) {
            setURL(null);
            return;
        }
        const url = URL.createObjectURL(blob);
        setURL(url);
        return () => URL.revokeObjectURL(url);
    }, [blob]);
    return url;
};

const Editor = () => {
    const [file, setFile] = useState<File | null>(null);
    const [value, setValue] = useState<string | null>(null);

    const fileRef = useRef<HTMLInputElement>(null);
    const onChange = useCallback(async () => {
        const files = fileRef.current!.files;
        if (!files || files.length == 0) {
            return;
        }

        const file = files[0];
        setFile(file);
        setValue(null);

        const reader = new FileReader();

        await new Promise<void>((res, rej) => {
            reader.onload = () => res();
            reader.onerror = () => rej();
            reader.readAsText(file);
        });

        setValue(reader.result as string);
    }, []);

    const blob = useMemo(() => {
        if (!value) {
            return;
        }
        return new Blob([value]);
    }, [value]);
    const url = useObjectURL(blob);

    const title = file?.name ?? 'No File';

    const h1Id = useId();
    const disclosureButtonId = useId();

    return <main aria-describedby={h1Id}>
        <title>{title}</title>
        <Layout
            heading={
                <header>
                    <h1 id={h1Id} className={styles.h1}>{title}</h1>
                </header>}
            menu={
                <section aria-describedby={disclosureButtonId}>
                    <Disclosure>
                        <DisclosureButton><span id={disclosureButtonId}>Menu</span></DisclosureButton>
                        <DisclosureContents>
                            <MenuList>
                                <MenuItem>
                                    <div className={styles.filesWrapper}>
                                       <label>
                                            <div className={styles.filesContent}>Upload</div>
                                            <input className={styles.files} ref={fileRef} onChange={onChange} type="file" />
                                       </label>
                                   </div>
                                </MenuItem>
                                <MenuItem>
                                   <a href={url ?? undefined} download={title}>Download</a>
                                </MenuItem>
                            </MenuList>
                        </DisclosureContents>
                    </Disclosure>
                </section>
                }
            >
              <TextBox value={value ?? ''} />
            </Layout>
        </main>;
};

export default Editor;
