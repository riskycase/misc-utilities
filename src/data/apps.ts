import Transformer from "./transformer/transformer";

interface App {
    displayName: string;
    identifier: string;
    description?: string;
    element: () => JSX.Element
}

export const apps: App[] = [
    {
        displayName: "Text Transformer",
        identifier: "transformer",
        description:
            "Transform text through different data types, parsers and formatters",
        element: Transformer
    },
];
