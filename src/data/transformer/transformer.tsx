"use client";

import { transformations } from "@/data/transformer/transformations";
import {
  TransformDataType,
  TransformerInnerClass,
} from "@/data/transformer/types";
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
import { base64Encode } from "@/util";

interface TransformerState {
  input?: string;
  transformers?: Array<{
    identifier: string;
    config: any;
  }>;
}

export default function Transformer(params: { state: string }) {
  function getInitialStateOrDefault(initialStateString: string) {
    const initialState = JSON.parse(initialStateString) as TransformerState;
    return {
      input: initialState.input || "",
      transformers: initialState.transformers
        ? initialState.transformers
            .map((transformer) =>
              transformations
                .find(
                  (transformation) =>
                    transformation.inner().identifier === transformer.identifier
                )
                ?.inner(transformer.config)
            )
            .filter((transformer) => transformer !== undefined)
        : [],
    };
  }

  const initialStateObject = getInitialStateOrDefault(params.state);

  function computeOutput(
    input: string,
    transformers: Array<TransformerInnerClass>,
    initialRun: boolean
  ): string {
    let output = transformers.reduce((prev, transformer) => {
      try {
        return transformer.transform(prev);
      } catch (e) {
        return prev;
      }
    }, input);
    if (transformers.toReversed()[0]?.output == TransformDataType.OBJECT) {
      output = JSON.stringify(output, null, 4);
    } else if (
      transformers.toReversed()[0]?.output == TransformDataType.NUMBER
    ) {
      output = Number(output).toLocaleString();
    }

    if (!initialRun) {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set(
        "state",
        base64Encode(
          JSON.stringify({
            input,
            transformers: transformers.map((transformer) => ({
              identifier: transformer.identifier,
              config: transformer.config,
            })),
          })
        )
      );

      window.history.replaceState(null, "", newUrl);
    }
    return output;
  }

  const [input, setInput] = useState(initialStateObject.input);
  const [output, setOutput] = useState(
    computeOutput(
      initialStateObject.input,
      initialStateObject.transformers,
      true
    )
  );
  const [transformers, setTransformers] = useState<
    Array<TransformerInnerClass>
  >(initialStateObject.transformers);
  const { onCopy, setValue, hasCopied } = useClipboard(computeOutput(
    initialStateObject.input,
    initialStateObject.transformers,
    true
  ));
  const toast = useToast();

  function addTransformer(transformer: TransformerInnerClass) {
    setTransformers([...transformers, transformer]);
    computeAndSetOutput(input, [...transformers, transformer]);
  }

  function deleteTransformer(index: number) {
    setTransformers(transformers.toSpliced(index, 1));
    computeAndSetOutput(input, transformers.toSpliced(index, 1));
  }

  function computeAndSetOutput(
    input: string,
    transformers: Array<TransformerInnerClass>
  ) {
    const output = computeOutput(input, transformers, false);
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
            computeAndSetOutput(e.target.value, transformers);
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
              computeAndSetOutput("", transformers);
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
              computeAndSetOutput("", []);
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
            updateFunction={() => computeAndSetOutput(input, transformers)}
          />
        ))}
      </Flex>
    </Flex>
  );
}
