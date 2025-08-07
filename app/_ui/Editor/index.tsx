"use client";

import {
    MenuList, MenuItem,
    Disclosure, DisclosureButton, DisclosureContents
} from "@/ui";
import Layout from "../Layout";
import TextBox from "../TextBox";

const Editor = () =>
    <Layout menu={
        <Disclosure>
            <DisclosureButton>Menu</DisclosureButton>
            <DisclosureContents>
               <MenuList>
                  <MenuItem><button>Option 1</button></MenuItem>
                   <MenuItem><button>Option 2</button></MenuItem>
                   <MenuItem><button>Option 3</button></MenuItem>
                </MenuList>
            </DisclosureContents>
        </Disclosure>
        }
    >
       <TextBox />
    </Layout>;

export default Editor;
