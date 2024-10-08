import { TransformerInnerClass } from "@/data/types";
import {
  Box,
  Checkbox,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  NumberInput,
  NumberInputField,
  Select,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { MdEdit, MdDelete } from "react-icons/md";

export default function TransformerLayer({
  transformer,
  deleteFunction,
  updateFunction,
}: {
  transformer: TransformerInnerClass;
  deleteFunction: () => void;
  updateFunction: () => void;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box
      paddingY={2}
      paddingX={4}
      border="white"
      borderWidth="thin"
      borderStyle="solid"
      borderRadius={4}
    >
      <Flex justifyContent="space-between" alignItems="center">
        <Text size="large">{transformer.name}</Text>
        <Flex alignItems="center">
          {transformer.options.length > 0 && (
            <>
              <IconButton
                variant="text"
                icon={<MdEdit />}
                aria-label="Configure layer"
                onClick={onOpen}
              />
              <Modal isOpen={isOpen} isCentered onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>{transformer.name} options</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    {transformer.options.map((option, index) => {
                      if (option.type === "boolean")
                        return (
                          <FormControl key={index}>
                            <FormLabel>{option.displayName}</FormLabel>
                            <Checkbox
                              defaultChecked={
                                transformer.config[option.name] === undefined
                                  ? option.default
                                  : transformer.config[option.name]
                              }
                              onChange={(e) => {
                                transformer.config[option.name] =
                                  e.target.checked;
                                updateFunction();
                              }}
                            />
                            {option.tip && (
                              <FormHelperText>{option.tip}</FormHelperText>
                            )}
                          </FormControl>
                        );
                      else if (option.type === "number")
                        return (
                          <FormControl key={index}>
                            <FormLabel>{option.displayName}</FormLabel>
                            <NumberInput
                              defaultValue={
                                transformer.config[option.name] === undefined
                                  ? option.default
                                  : transformer.config[option.name]
                              }
                              min={option.min}
                              max={option.max}
                              onChange={(_, value) => {
                                if (!Number.isNaN(value))
                                  transformer.config[option.name] = value;
                                updateFunction();
                              }}
                            >
                              <NumberInputField />
                            </NumberInput>
                            {option.tip && (
                              <FormHelperText>{option.tip}</FormHelperText>
                            )}
                          </FormControl>
                        );
                      else if (option.type === "string")
                        return (
                          <FormControl key={index}>
                            <FormLabel>{option.displayName}</FormLabel>
                            <Input
                              defaultValue={
                                transformer.config[option.name] === undefined
                                  ? option.default
                                  : transformer.config[option.name]
                              }
                              onChange={(e) => {
                                transformer.config[option.name] =
                                  e.target.value;
                                updateFunction();
                              }}
                            />
                            {option.tip && (
                              <FormHelperText>{option.tip}</FormHelperText>
                            )}
                          </FormControl>
                        );
                      else if (option.type === "select")
                        return (
                          <FormControl key={index}>
                            <FormLabel>{option.displayName}</FormLabel>
                            <Select
                              value={
                                transformer.config[option.name] === undefined
                                  ? option.default
                                  : transformer.config[option.name]
                              }
                              onChange={(e) => {
                                transformer.config[option.name] =
                                  e.target.value;
                                updateFunction();
                              }}
                            >
                              {option.options.map((option, index) => (
                                <option value={option.value} key={index}>
                                  {option.displayName}
                                </option>
                              ))}
                            </Select>
                            {option.tip && (
                              <FormHelperText>{option.tip}</FormHelperText>
                            )}
                          </FormControl>
                        );
                    })}
                  </ModalBody>
                </ModalContent>
              </Modal>
            </>
          )}
          <IconButton
            variant="text"
            icon={<MdDelete />}
            aria-label="Delete layer"
            onClick={deleteFunction}
          />
        </Flex>
      </Flex>
    </Box>
  );
}
