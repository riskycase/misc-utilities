import {
    createAdler32,
    createBLAKE2b,
    createBLAKE2s,
    createBLAKE3,
    createCRC32,
    createKeccak,
    createMD4,
    createMD5,
    createRIPEMD160,
    createSHA1,
    createSHA224,
    createSHA256,
    createSHA3,
    createSHA384,
    createSHA512,
    createSM3,
    createWhirlpool,
} from "hash-wasm";
import { Hasher, HasherInnerClass, HasherOptions } from "./types";

function parseNumber(input: any, fallback: number): number {
    if(!Number.isNaN(Number(input))) {
        return Number(input)
    } else {
        return fallback
    }
}

export const hashers: Array<Hasher> = [
    {
        inner: () =>
            new (class extends HasherInnerClass {
                name = "Adler-32";
                hasherPromise = () => createAdler32();
            })(),
        name: "Adler-32",
    },
    {
        inner: () =>
            new (class extends HasherInnerClass {
                name = "BLAKE2b";
                options: HasherOptions[] = [
                    {
                        name: "bits",
                        displayName: "Bit size",
                        type: "select",
                        default: 512,
                        options: [8, 16, 32, 64, 128, 256, 512],
                    },
                ];
                hasherPromise = () =>
                    createBLAKE2b(parseNumber(this.config.bits, 512));
            })(),
        name: "BLAKE2b",
    },
    {
        inner: () =>
            new (class extends HasherInnerClass {
                name = "BLAKE2s";
                options: HasherOptions[] = [
                    {
                        name: "bits",
                        displayName: "Bit size",
                        type: "select",
                        default: 256,
                        options: [8, 16, 32, 64, 128, 256],
                    },
                ];
                hasherPromise = () =>
                    createBLAKE2s(parseNumber(this.config.bits, 256));
            })(),
        name: "BLAKE2s",
    },
    {
        inner: () =>
            new (class extends HasherInnerClass {
                name = "BLAKE3";
                options: HasherOptions[] = [
                    {
                        name: "bits",
                        displayName: "Bit size",
                        type: "select",
                        default: 256,
                        options: [8, 16, 32, 64, 128, 256, 512, 1024, 2048],
                    },
                ];
                hasherPromise = () =>
                    createBLAKE3(parseNumber(this.config.bits, 256));
            })(),
        name: "BLAKE3",
    },
    {
        inner: () =>
            new (class extends HasherInnerClass {
                name = "CRC-32";
                hasherPromise = () => createCRC32();
            })(),
        name: "CRC-32",
    },
    {
        inner: () =>
            new (class extends HasherInnerClass {
                name = "CRC-32C";
                hasherPromise = () => createCRC32();
            })(),
        name: "CRC-32C",
    },
    {
        inner: () =>
            new (class extends HasherInnerClass {
                name = "Keccak";
                options: HasherOptions[] = [
                    {
                        name: "bits",
                        displayName: "Bit size",
                        type: "select",
                        default: 512,
                        options: [224, 256, 384, 512],
                    },
                ];
                hasherPromise = () =>
                    createKeccak(
                        parseNumber(this.config.bits, 512) as
                            | 224
                            | 256
                            | 384
                            | 512
                    );
            })(),
        name: "Keccak",
    },
    {
        inner: () =>
            new (class extends HasherInnerClass {
                name = "MD4";
                hasherPromise = () => createMD4();
            })(),
        name: "MD4",
    },
    {
        inner: () =>
            new (class extends HasherInnerClass {
                name = "MD5";
                hasherPromise = () => createMD5();
            })(),
        name: "MD5",
    },
    {
        inner: () =>
            new (class extends HasherInnerClass {
                name = "RIPEMD-160";
                hasherPromise = () => createRIPEMD160();
            })(),
        name: "RIPEMD-160",
    },
    {
        inner: () =>
            new (class extends HasherInnerClass {
                name = "SHA-1";
                hasherPromise = () => createSHA1();
            })(),
        name: "SHA-1",
    },
    {
        inner: () =>
            new (class extends HasherInnerClass {
                name = "SHA-224";
                hasherPromise = () => createSHA224();
            })(),
        name: "SHA-224",
    },
    {
        inner: () =>
            new (class extends HasherInnerClass {
                name = "SHA-256";
                hasherPromise = () => createSHA256();
            })(),
        name: "SHA-256",
    },
    {
        inner: () =>
            new (class extends HasherInnerClass {
                name = "SHA-3";
                options: HasherOptions[] = [
                    {
                        name: "bits",
                        displayName: "Bit size",
                        type: "select",
                        default: 512,
                        options: [224, 256, 384, 512],
                    },
                ];
                hasherPromise = () =>
                    createSHA3(
                        parseNumber(this.config.bits, 512) as
                            | 224
                            | 256
                            | 384
                            | 512
                    );
            })(),
        name: "SHA-3",
    },
    {
        inner: () =>
            new (class extends HasherInnerClass {
                name = "SHA-384";
                hasherPromise = () => createSHA384();
            })(),
        name: "SHA-384",
    },
    {
        inner: () =>
            new (class extends HasherInnerClass {
                name = "SHA-512";
                hasherPromise = () => createSHA512();
            })(),
        name: "SHA-512",
    },
    {
        inner: () =>
            new (class extends HasherInnerClass {
                name = "SM3";
                hasherPromise = () => createSM3();
            })(),
        name: "SM3",
    },
    {
        inner: () =>
            new (class extends HasherInnerClass {
                name = "Whirlpool";
                hasherPromise = () => createWhirlpool();
            })(),
        name: "Whirlpool",
    },
];
