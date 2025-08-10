import type { ReactNode } from "react";
import { Providers } from "@/lib";

import "./_ui/styles/globals.css";

interface Props {
    children: ReactNode;
}

const RootLayout = ({ children }: Readonly<Props>) =>
    <html lang="en">
           <body>
                <Providers>
                    {children}
                </Providers>
          </body>
        </html>;

export default RootLayout;
