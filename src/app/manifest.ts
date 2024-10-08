import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Miscallaneous Utilities",
        short_name: "Misc Utils",
        description: "Collection of useful snippets for everyday developer",
        start_url: "/",
        display: "standalone",
        background_color: "#171923",
        theme_color: "#F7FAFC",
        icons: [
            {
                src: "/favicon.ico",
                sizes: "any",
                type: "image/x-icon",
            },
        ],
    };
}
