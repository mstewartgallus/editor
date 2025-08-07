import { useId } from "react";
import {
    MenuList, MenuItem,
    Disclosure, DisclosureButton, DisclosureContents
} from "@/ui";
import Layout from "../Layout";
import TextBox from "../TextBox";

import styles from "./Editor.module.css";

const Editor = () => {
    const h1Id = useId();
    const disclosureButtonId = useId();
    const title = 'Unsaved File';
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
                              <MenuItem><button>Option 1</button></MenuItem>
                               <MenuItem><button>Option 2</button></MenuItem>
                               <MenuItem><button>Option 3</button></MenuItem>
                            </MenuList>
                        </DisclosureContents>
                    </Disclosure>
                </section>
                }
            >
                <TextBox />
            </Layout>
        </main>;
};

export default Editor;
