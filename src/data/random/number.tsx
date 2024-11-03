"use client";

import { useState } from "react";
import {
  RandomNumberGeneratorState,
  RandomNumberGeneratorStateUpdate,
} from "./types";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  SimpleGrid,
  Text,
  Tooltip,
  useClipboard,
} from "@chakra-ui/react";
import { MdContentCopy } from "react-icons/md";

export default function Number() {
  const [state, setState] = useState<RandomNumberGeneratorState>({
    min: 1,
    max: 6,
    current: 1,
    prefix: "",
    suffix: "",
  });
  const { onCopy, setValue } = useClipboard(state.current.toString());

  function updateState(stateUpdate: RandomNumberGeneratorStateUpdate) {
    const newState: RandomNumberGeneratorState = { ...state, ...stateUpdate };
    newState.current =
      newState.min + Math.round(Math.random() * (newState.max - newState.min));
    setState(newState);
    setValue(
      `${newState.prefix}${newState.current.toString()}${newState.suffix}`
    );
  }

  return (
    <Flex direction="column" alignItems="stretch" padding={2} gap={4} flex={1}>
      <SimpleGrid columns={{ base: 1, md: 2 }} gap={2}>
        <FormControl>
          <FormLabel>Lower limit (inclusive)</FormLabel>
          <NumberInput
            value={state.min}
            max={state.max}
            min={0}
            onChange={(_, min) => updateState({ min })}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
        <FormControl>
          <FormLabel>Upper limit (inclusive)</FormLabel>
          <NumberInput
            value={state.max}
            min={state.min}
            onChange={(_, max) => updateState({ max })}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
        <FormControl>
          <FormLabel>Output prefix</FormLabel>
          <Input
            value={state.prefix}
            onChange={(e) => updateState({ prefix: e.target.value })}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Output suffix</FormLabel>
          <Input
            value={state.suffix}
            onChange={(e) => updateState({ suffix: e.target.value })}
          />
        </FormControl>
      </SimpleGrid>
      <Button onClick={() => updateState({})}>Generate again</Button>
      <Tooltip label="Click to copy">
        <SimpleGrid
          alignSelf="center"
          alignItems="start"
          justifyContent="center"
          columns={3}
          padding={4}
          gap={4}
          onClick={onCopy}
        >
          {/* Empty element to center number */}
          <Text />
          <Text fontSize="xxx-large">
            {state.prefix}
            {state.current}
            {state.suffix}
          </Text>
          <MdContentCopy />
        </SimpleGrid>
      </Tooltip>
      <Text fontStyle="italic" alignSelf="start">
        Presets
      </Text>
      <SimpleGrid columns={{ base: 2, md: 4 }} gap={2}>
        <Button
          onClick={() =>
            updateState({ min: 1, max: 6, prefix: "", suffix: "" })
          }
        >
          6 faced dice
        </Button>
        <Button
          onClick={() =>
            updateState({ min: 1, max: 20, prefix: "d", suffix: "" })
          }
        >
          20 faced dice (D&D)
        </Button>
      </SimpleGrid>
    </Flex>
  );
}
