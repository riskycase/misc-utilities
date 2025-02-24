"use client";

import { transformations } from "@/data/transformer/transformations";
import { TransformerInnerClass } from "@/data/transformer/types";
import {
  Button,
  Flex,
  IconButton,
  InputGroup,
  InputRightElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Textarea,
  theme,
  useClipboard,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import TransformerLayer from "./transformerLayer";
import { MdCheck, MdCopyAll } from "react-icons/md";

export default function Transformer() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [transformers, setTransformers] = useState<
    Array<TransformerInnerClass>
  >([]);
  const { onCopy, setValue, hasCopied } = useClipboard("");
  const toast = useToast();

  function addTransformer(transformer: TransformerInnerClass) {
    setTransformers([...transformers, transformer]);
    computeOutput(input, [...transformers, transformer]);
  }

  function deleteTransformer(index: number) {
    setTransformers(transformers.toSpliced(index, 1));
    computeOutput(input, transformers.toSpliced(index, 1));
  }

  function computeOutput(
    input: string,
    transformers: Array<TransformerInnerClass>
  ) {
    const output = transformers.reduce((prev, transformer) => {
      try {
        return transformer.transform(prev);
      } catch (e) {
        return prev;
      }
    }, input);
    setOutput(output);
    setValue(output);
  }

  return (
    <Flex
      direction={{ base: "column-reverse", md: "row" }}
      alignItems="stretch"
      padding={2}
      gap={2}
      flex={1}
    >
      <Flex direction="column" alignItems="stretch" gap={2} flex={3}>
        <Textarea
          flex={1}
          value={input}
          resize="none"
          onChange={(e) => {
            setInput(e.target.value);
            computeOutput(e.target.value, transformers);
          }}
          minHeight={"35vh"}
        />
        <InputGroup flex={1} flexDir="column">
          <InputRightElement>
            <IconButton
              icon={hasCopied ? <MdCheck /> : <MdCopyAll />}
              aria-label="Copy output"
              variant="text"
              onClick={onCopy}
            />
          </InputRightElement>
          <Textarea
            value={output}
            readOnly
            resize="none"
            minHeight={"35vh"}
            flex={1}
          />
        </InputGroup>
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
              computeOutput("", transformers);
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
              setInput("");
              setTransformers([]);
              computeOutput("", []);
              toast({
                title: "Transformer reset",
              });
            }}
            flex={1}
          >
            Reset
          </Button>
          <Button
            onClick={() => {
              onCopy();
              toast({
                title: "Output copied to clipboard",
                status: "success",
              });
            }}
            flex={1}
          >
            Copy output
          </Button>
        </Flex>
        <Menu matchWidth>
          <MenuButton as={Button}>Add layer</MenuButton>
          <MenuList>
            {transformations.map((transformation, index) => (
              <MenuItem
                key={index}
                onClick={() => addTransformer(transformation.inner())}
                color={theme.colors.gray[700]}
              >
                {transformation.name}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
        {transformers.map((transformer, index) => (
          <TransformerLayer
            key={index}
            transformer={transformer}
            deleteFunction={() => deleteTransformer(index)}
            updateFunction={() => computeOutput(input, transformers)}
          />
        ))}
      </Flex>
    </Flex>
  );
}
