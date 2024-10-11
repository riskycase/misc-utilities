import Hash from "./hash/hash";
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
    {
        displayName: "Hash tools",
        identifier: "hash",
        description: "Generate and verify hashes for text using different HMAC algorithms",
        element: Hash
    }
];
