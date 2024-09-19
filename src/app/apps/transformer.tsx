"use client";

import { transformations } from "@/data/transformations";
import { TransformerInnerClass } from "@/data/types";
import {
  Button,
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Textarea,
  theme,
} from "@chakra-ui/react";
import { useState } from "react";
import TransformerLayer from "./transformerLayer";

export default function Transformer() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [transformers, setTransformers] = useState<
    Array<TransformerInnerClass>
  >([]);

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
    setOutput(
      transformers.reduce((prev, transformer) => {
        try {
          return transformer.transform(prev);
        } catch (e) {
          return prev;
        }
      }, input)
    );
  }

  return (
    <Flex direction="column" alignItems="stretch" padding={2} gap={2} flex={1}>
      <Heading>Text Transformer</Heading>
      <Flex direction="row" alignItems="stretch" padding={2} gap={2} flex={1}>
        <Flex direction="column" alignItems="stretch" gap={2} flex={3}>
          <Textarea
            flex={1}
            value={input}
            resize="none"
            onChange={(e) => {
              setInput(e.target.value);
              computeOutput(e.target.value, transformers);
            }}
          />
          <Textarea flex={1} value={output} readOnly resize="none" />
        </Flex>
        <Flex direction="column" alignItems="stretch" gap={2} flex={1}>
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
    </Flex>
  );
}
