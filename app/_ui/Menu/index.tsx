import type { ReactNode } from "react";
import {
    MenuList, MenuItem,
    Disclosure, DisclosureButton, DisclosureContents
} from "@/ui";

interface Props {
    children: ReactNode;
    disabled: boolean;
    uploadAction?: () => Promise<void>;
    downloadAction?: () => Promise<void>;
}

const Menu = ({
    children,
    disabled,
    uploadAction,
    downloadAction
}: Props) =>
<Disclosure>
    <DisclosureButton>{children}</DisclosureButton>
    <DisclosureContents>
        <MenuList>
            <MenuItem>
               <button disabled={disabled} onClick={uploadAction}>Upload</button>
            </MenuItem>
            <MenuItem>
               <button disabled={disabled} onClick={downloadAction}>Download</button>
            </MenuItem>
            <MenuItem>
                <a href="https://mstewartgallus.github.io/select-webapp">Select Another App</a>
            </MenuItem>
        </MenuList>
    </DisclosureContents>
</Disclosure>;

export default Menu;
