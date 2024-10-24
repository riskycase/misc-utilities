"use client";

import {
    Button,
    Flex,
    FormControl,
    FormErrorMessage,
    FormHelperText,
    FormLabel,
    Input,
    Link,
    NumberInput,
    NumberInputField,
    Select,
    Switch,
    Text,
    Textarea,
    theme,
    useClipboard,
    useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { hashers } from "./hashers";
import {
    HASH_FILE_INPUT_ID,
    HasherInnerClass,
    HashInputMode,
    MaybeFile,
} from "./types";
import NextLink from "next/link";
import { MdUploadFile } from "react-icons/md";

export default function Hash() {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState<string | null>("");
    const [hasher, setHasher] = useState(hashers[0].inner);
    const [mode, setMode] = useState<HashInputMode>("text");
    const [file, setFile] = useState<MaybeFile>(null);
    const [checkHash, setCheckHash] = useState<string | null>(null);

    const { onCopy, setValue } = useClipboard("");
    const toast = useToast();

    function calculateHash(
        input: string,
        file: MaybeFile,
        mode: HashInputMode,
        hasher: HasherInnerClass
    ) {
        setOutput(null);
        hasher.hash(mode === "text" ? input : file).then((output) => {
            setOutput(output);
            setValue(output);
        });
    }

    // Calculate the first hash
    useEffect(() => calculateHash(input, null, "text", hasher), []);

    return (
        <Flex
            direction={{ base: "column-reverse", md: "row" }}
            alignItems="stretch"
            padding={2}
            gap={2}
            flex={1}
        >
            <Flex direction="column" alignItems="stretch" gap={2} flex={3}>
                <FormControl flex={mode === "text" ? 1 : undefined}>
                    <Flex
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <FormLabel>Input</FormLabel>
                        <Flex direction="row" alignItems="center">
                            {file && (
                                <Text as="i" fontSize="small">
                                    {file.name}
                                </Text>
                            )}
                            <Button
                                as="label"
                                htmlFor={HASH_FILE_INPUT_ID}
                                variant="ghost"
                                colorScheme="white"
                                aria-label="select-file"
                                rightIcon={<MdUploadFile />}
                            >
                                Choose file
                            </Button>
                        </Flex>
                    </Flex>
                    <Textarea
                        value={input}
                        resize="none"
                        onChange={(e) => {
                            setInput(e.target.value);
                            setFile(null);
                            calculateHash(e.target.value, null, "text", hasher);
                        }}
                        onFocus={() => {
                            if (mode === "file") {
                                setMode("text");
                                setFile(null);
                                (
                                    document.getElementById(
                                        HASH_FILE_INPUT_ID
                                    ) as HTMLInputElement
                                ).value = "";
                                setInput("");
                                calculateHash("", null, "text", hasher);
                                setFile(null);
                            }
                        }}
                        minHeight={"35vh"}
                    />
                </FormControl>
                <Input
                    type="file"
                    id={HASH_FILE_INPUT_ID}
                    display="none"
                    onChange={(e) => {
                        if (file !== e.target.files!.item(0)) {
                            const file = e.target.files!.item(0);
                            setFile(file);
                            setMode("file");
                            setInput(
                                `File selected. Click here to go back to raw text hash`
                            );
                            calculateHash(input, file, "file", hasher);
                        } else {
                            setMode("text");
                            setFile(null);
                            setInput("");
                            calculateHash("", null, "text", hasher);
                            setFile(null);
                        }
                    }}
                />
                <FormControl
                    flex={1}
                    isInvalid={
                        checkHash !== null &&
                        output !== null &&
                        checkHash.toLowerCase() !== output.toLowerCase()
                    }
                >
                    <Flex
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <FormLabel>
                            {`${checkHash !== null ? "Verify " : ""}${
                                hasher.name
                            } `}
                            hash
                        </FormLabel>
                        <Flex direction="row" alignItems="center">
                            <FormControl display="flex" alignItems="center">
                                <FormLabel>Verify mode</FormLabel>
                                <Switch
                                    isChecked={checkHash !== null}
                                    onChange={() =>
                                        setCheckHash(
                                            checkHash === null
                                                ? ""
                                                : null
                                        )
                                    }
                                />
                            </FormControl>
                        </Flex>
                    </Flex>
                    <Textarea
                        value={
                            checkHash === null
                                ? output || "Calculating hash"
                                : checkHash
                        }
                        readOnly={checkHash === null}
                        onChange={(e) => setCheckHash(e.target.value)}
                        resize="none"
                        minHeight={"35vh"}
                    />
                    {checkHash !== null &&
                        output !== null &&
                        (checkHash.toLowerCase() === output.toLowerCase() ? (
                            <FormHelperText>Hashes match!</FormHelperText>
                        ) : (
                            <FormErrorMessage>
                                Hashes do not match!
                            </FormErrorMessage>
                        ))}
                </FormControl>
            </Flex>
            <Flex direction="column" alignItems="stretch" gap={2} flex={1}>
                <Flex
                    direction="row"
                    alignSelf="stretch"
                    gap={2}
                    top={0}
                    position="sticky"
                    backgroundColor={theme.colors.gray[900]}
                    zIndex={5}
                    paddingY={2}
                >
                    <Button
                        onClick={() => {
                            setMode("text");
                            setInput("");
                            calculateHash("", null, "text", hasher);
                            setFile(null);
                            toast({
                                title: "Input cleared",
                            });
                        }}
                        flex={1}
                    >
                        Clear
                    </Button>
                    <Button
                        onClick={() => {
                            onCopy();
                            toast({
                                title: "Hash copied to clipboard",
                                status: "success",
                            });
                        }}
                        flex={1}
                    >
                        Copy output
                    </Button>
                </Flex>
                <FormControl>
                    <FormLabel>Hashing algorithm</FormLabel>
                    <Select
                        value={hasher.name}
                        onChange={(e) =>
                            setHasher(
                                hashers
                                    .find(
                                        (hasher) =>
                                            hasher.name === e.target.value
                                    )!!
                                    .inner()
                            )
                        }
                        color={theme.colors.gray[700]}
                        backgroundColor={theme.colors.gray[50]}
                    >
                        {hashers.map((hasher, index) => (
                            <option value={hasher.name} key={index}>
                                {hasher.name}
                            </option>
                        ))}
                    </Select>
                    <FormHelperText color={theme.colors.gray[50]}>
                        Hashes implemented by{" "}
                        <Link
                            as={NextLink}
                            href="https://www.npmjs.com/package/hash-wasm"
                        >
                            hash-wasm
                        </Link>{" "}
                        npm module
                    </FormHelperText>
                </FormControl>
                {hasher.options.map((option, index) => {
                    if (option.type === "number")
                        return (
                            <FormControl key={index}>
                                <FormLabel>{option.displayName}</FormLabel>
                                <NumberInput
                                    defaultValue={
                                        hasher.config[option.name] === undefined
                                            ? option.default
                                            : hasher.config[option.name]
                                    }
                                    min={option.min}
                                    max={option.max}
                                    onChange={(_, value) => {
                                        if (!Number.isNaN(value))
                                            hasher.config[option.name] = value;
                                        calculateHash(
                                            input,
                                            file,
                                            mode,
                                            hasher
                                        );
                                    }}
                                >
                                    <NumberInputField />
                                </NumberInput>
                                {option.tip && (
                                    <FormHelperText>
                                        {option.tip}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        );
                    else if (option.type === "select")
                        return (
                            <FormControl key={index}>
                                <FormLabel>{option.displayName}</FormLabel>
                                <Select
                                    value={
                                        hasher.config[option.name] === undefined
                                            ? option.default
                                            : hasher.config[option.name]
                                    }
                                    onChange={(e) => {
                                        hasher.config[option.name] =
                                            e.target.value;
                                        calculateHash(
                                            input,
                                            file,
                                            mode,
                                            hasher
                                        );
                                    }}
                                    color={theme.colors.gray[700]}
                                    backgroundColor={theme.colors.gray[50]}
                                >
                                    {option.options.map((option, index) => (
                                        <option value={option} key={index}>
                                            {option}
                                        </option>
                                    ))}
                                </Select>
                                {option.tip && (
                                    <FormHelperText>
                                        {option.tip}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        );
                })}
            </Flex>
        </Flex>
    );
}
