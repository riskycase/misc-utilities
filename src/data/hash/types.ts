import { IHasher } from "hash-wasm/dist/lib/WASMInterface";

const CHUNK_SIZE = 64 * 1024 * 1024;

interface HasherOptionsNumberAny {
    name: string;
    displayName: string;
    type: "number";
    default: number;
    max: number;
    min: number;
    tip?: string;
}

interface HasherOptionsNumberSpecific {
    name: string;
    displayName: string;
    type: "select";
    default: number;
    options: Array<number>;
    tip?: string;
}

export type HasherOptions =
    | HasherOptionsNumberAny
    | HasherOptionsNumberSpecific;

export abstract class HasherInnerClass {
    options: Array<HasherOptions> = [];
    config: any = {};
    name: string = "";
    abstract hasherPromise(): Promise<IHasher>;
    async hash(input: Uint8Array | string): Promise<string> {
        // Derived from https://stackoverflow.com/a/63287199
        const hasher = await this.hasherPromise();
        const chunkNumber = Math.floor(input.length / CHUNK_SIZE);
        for (let i: number = 0; i <= chunkNumber; i++) {
            const chunk = input.slice(
                CHUNK_SIZE * i,
                Math.min(CHUNK_SIZE * (i + 1), input.length)
            );
            hasher.update(chunk);
        }
        return hasher.digest();
    }

    constructor() {
        this.options.forEach(
            (option) => (this.config[option.name] = option.default)
        );
    }
}

export interface Hasher {
    inner: () => HasherInnerClass;
    name: string;
}
