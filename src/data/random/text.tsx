"use client";

import { useState } from "react";
import { RandomTextPickerState, RandomTextPickerStateUpdate } from "./types";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  SimpleGrid,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
  Tooltip,
  useClipboard,
} from "@chakra-ui/react";
import { MdContentCopy } from "react-icons/md";

export default function RandomTextPicker() {
  const [state, setState] = useState<RandomTextPickerState>({
    texts: ["Heads", "Tails"],
    current: 0,
  });
  const [newChoice, setNewChoice] = useState("");
  const { onCopy, setValue } = useClipboard(state.texts[state.current]);

  function updateState(stateUpdate: RandomTextPickerStateUpdate) {
    const newState: RandomTextPickerState = { ...state, ...stateUpdate };
    newState.current = Math.floor(Math.random() * newState.texts.length);
    setState(newState);
    if (newState.texts.length > 0) setValue(newState.texts[newState.current]);
    else setValue("");
  }

  return (
    <Flex direction="column" alignItems="stretch" padding={4} gap={4} flex={1}>
      <Text fontSize="large">Choices</Text>
      <Flex wrap="wrap" gap={2}>
        {state.texts.map((text, index) => (
          <Tag size="lg" key={index}>
            <TagLabel>{text}</TagLabel>
            <TagCloseButton
              onClick={() => {
                state.texts.splice(index, 1);
                updateState({
                  texts: state.texts,
                });
              }}
            />
          </Tag>
        ))}
        {state.texts.length === 0 && <Text>No choices given!</Text>}
      </Flex>
      <FormControl>
        <FormLabel>Add new choice</FormLabel>
        <Flex direction="row" gap={2}>
          <Input
            value={newChoice}
            onChange={(e) => setNewChoice(e.target.value)}
          />
          <Button
            onClick={() => {
              setNewChoice("");
              state.texts.push(newChoice);
              updateState({
                texts: state.texts,
              });
            }}
            alignSelf="center"
          >
            Add Choice
          </Button>
        </Flex>
      </FormControl>
      <Button onClick={() => updateState({})}>Make new choice</Button>
      {state.texts[state.current] && (
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
            {/* Empty element to center element */}
            <Text />
            <Text fontSize="xxx-large">{state.texts[state.current]}</Text>
            <MdContentCopy />
          </SimpleGrid>
        </Tooltip>
      )}
      <Text fontStyle="italic" alignSelf="start">
        Presets
      </Text>
      <SimpleGrid columns={{ base: 2, md: 4 }} gap={2}>
        <Button
          onClick={() =>
            updateState({
              texts: ["Heads", "Tails"],
            })
          }
        >
          Flip a coin
        </Button>
      </SimpleGrid>
    </Flex>
  );
}
