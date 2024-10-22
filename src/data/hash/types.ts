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
    private hashChunk(chunk: Blob, hasher: IHasher): Promise<void> {
        const fileReader = new FileReader();
        return new Promise((resolve, reject) => {
            fileReader.addEventListener("load", (event) => {
                const view = new Uint8Array(
                    event.target?.result as ArrayBuffer
                );
                hasher.update(view);
                resolve();
            });
            fileReader.readAsArrayBuffer(chunk);
        });
    }
    async hash(input: File | string | null): Promise<string> {
        if (input === null) return Promise.resolve("Empty file selected");
        // Derived from https://stackoverflow.com/a/63287199
        const hasher = await this.hasherPromise();
        if (typeof input === "string") {
            const size = input.length;
            const chunkNumber = Math.floor(size / CHUNK_SIZE);
            for (let i: number = 0; i <= chunkNumber; i++) {
                const chunk = input.slice(
                    CHUNK_SIZE * i,
                    Math.min(CHUNK_SIZE * (i + 1), size)
                );
                hasher.update(chunk);
            }
        } else {
            const size = input.size;
            const chunkNumber = Math.floor(size / CHUNK_SIZE);
            for (let i: number = 0; i <= chunkNumber; i++) {
                const chunk = input.slice(
                    CHUNK_SIZE * i,
                    Math.min(CHUNK_SIZE * (i + 1), size)
                );
                await this.hashChunk(chunk, hasher);
            }
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

export type HashInputMode = "text" | "file";

export type MaybeFile = File | null;

export const HASH_FILE_INPUT_ID: string = "hash-input-file";
