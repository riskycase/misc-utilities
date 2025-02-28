"use client";

import {
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import RelativeTimeFormat from "dayjs/plugin/relativeTime";
import UTC from "dayjs/plugin/utc";
import { useState } from "react";

dayjs.extend(RelativeTimeFormat);
dayjs.extend(UTC);

export default function ParseUnix() {
  const [value, setValue] = useState(Date.now());
  const date = dayjs(value >= 10e11 ? value : value * 1000);
  return (
    <Flex direction="column" gap={4}>
      <Text fontSize="larger">Parse Unix times</Text>
      <FormControl>
        <FormLabel>Enter Unix timestamp</FormLabel>
        <NumberInput
          value={value}
          onChange={(_, newValue) => setValue(newValue)}
        >
          <NumberInputField />
        </NumberInput>
        <FormHelperText>
          Assuming current timestamp is {value > 10e11 && "milli"}seconds
        </FormHelperText>
      </FormControl>
      <SimpleGrid columns={2}>
        <Text>Current time (UTC):</Text>
        <Text>
          {date
            .utcOffset(new Date().getTimezoneOffset())
            .format("dddd, DD MMMM, YYYY HH:MM:ss.SSS")}
        </Text>
        <Text>
          Current time ({Intl.DateTimeFormat().resolvedOptions().timeZone}):
        </Text>
        <Text>{date.format("dddd, DD MMMM, YYYY HH:MM:ss.SSS")}</Text>
        <Text>Relative time:</Text>
        <Text>
          {date.valueOf() > Date.now() ? date.fromNow() : date.toNow()}
        </Text>
      </SimpleGrid>
    </Flex>
  );
}
