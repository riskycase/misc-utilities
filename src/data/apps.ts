import Hash from "./hash/hash";
import Number from "./random/number";
import Text from "./random/text";
import Transformer from "./transformer/transformer";
import UnixTime from "./unixTime/unixTime";

interface App {
  displayName: string;
  identifier: string;
  description?: string;
  element: () => JSX.Element;
}

export const apps: App[] = [
  {
    displayName: "Text Transformer",
    identifier: "transformer",
    description:
      "Transform text through different data types, parsers and formatters",
    element: Transformer,
  },
  {
    displayName: "Hash tools",
    identifier: "hash",
    description:
      "Generate or verify hashes for text or files using different HMAC algorithms",
    element: Hash,
  },
  {
    displayName: "Random Number Generator",
    identifier: "rng",
    description: "Quickly generate a random number within a specified range",
    element: Number,
  },
  {
    displayName: "Random Text Picker",
    identifier: "rtp",
    description: "Select a random item from a set of strings (Or flip a coin)",
    element: Text,
  },
  {
    displayName: "Unix Time Utils",
    identifier: "unixTime",
    description: "Manipulate and work with unix/epoch timestamps",
    element: UnixTime,
  },
];
