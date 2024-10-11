"use client";

import {
    Button,
    Flex,
    FormControl,
    FormHelperText,
    FormLabel,
    Link,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    NumberInput,
    NumberInputField,
    Select,
    Text,
    Textarea,
    theme,
    useClipboard,
    useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { hashers } from "./hashers";
import { HasherInnerClass } from "./types";
import NextLink from "next/link";

export default function Hash() {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [hasher, setHasher] = useState(hashers[0].inner);
    const { onCopy, setValue } = useClipboard("");
    const toast = useToast();

    function calculateHash(input: string, hasher: HasherInnerClass) {
        hasher.hash(input).then((output) => {
            setOutput(output);
            setValue(output);
        });
    }

    // Calculate the first hash
    useEffect(() => calculateHash(input, hasher), []);

    return (
        <Flex
            direction={{ base: "column-reverse", md: "row" }}
            alignItems="stretch"
            padding={2}
            gap={2}
            flex={1}
        >
            <Flex direction="column" alignItems="stretch" gap={2} flex={3}>
                <FormControl flex={1}>
                    <FormLabel>Input text</FormLabel>
                    <Textarea
                        value={input}
                        resize="none"
                        onChange={(e) => {
                            setInput(e.target.value);
                            calculateHash(e.target.value, hasher);
                        }}
                        minHeight={"35vh"}
                    />
                </FormControl>
                <FormControl flex={1}>
                    <FormLabel>{hasher.name} hash</FormLabel>
                    <Textarea
                        value={output}
                        readOnly
                        resize="none"
                        minHeight={"35vh"}
                    />
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
                            setInput("");
                            calculateHash("", hasher);
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
                <Menu matchWidth>
                    <MenuButton as={Button}>Change HMAC</MenuButton>
                    <MenuList maxHeight="50vh" overflowY="auto">
                        {hashers.map((hasher, index) => (
                            <MenuItem
                                key={index}
                                onClick={() => {
                                    const inner = hasher.inner();
                                    setHasher(inner);
                                    calculateHash(input, inner);
                                }}
                                color={theme.colors.gray[700]}
                            >
                                {hasher.name}
                            </MenuItem>
                        ))}
                    </MenuList>
                </Menu>
                <Text as="i" fontSize="small" alignSelf="center">
                    Hashes implemented by{" "}
                    <Link
                        as={NextLink}
                        href="https://www.npmjs.com/package/hash-wasm"
                    >
                        hash-wasm
                    </Link>{" "}
                    npm module
                </Text>
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
                                        calculateHash(input, hasher);
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
                                        calculateHash(input, hasher);
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
