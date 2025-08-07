import type { ReactNode } from "react";

import "./_ui/styles/globals.css";

interface Props {
  readonly children: ReactNode;
}

const RootLayout = ({ children }: Props) =>
    <html lang="en">
        <body>
            {children}
        </body>
    </html>;

export default RootLayout;
