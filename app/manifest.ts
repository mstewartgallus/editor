import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const manifest: () => MetadataRoute.Manifest = () => ({
    name: 'Editor',
    short_name: 'Editor',
    description: 'A minimalist editor',
    start_url: process.env.PAGES_BASE_PATH,
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#000000',
    icons: [32, 192, 512].map(size => ({
        src: `${process.env.PAGES_BASE_PATH}/icon/icon-${size}x${size}.png`,
        sizes: `${size}x${size}`,
        type: 'image/png'
    }))
});

export default manifest;
