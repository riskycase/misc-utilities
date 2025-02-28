"use client";

import { Flex } from "@chakra-ui/react";
import CurrentTime from "./currentTime";
import ParseUnix from "./parseUnix";

export default function UnixTime() {
    return <Flex direction="column" flex={1} padding={2} gap={4}>
        <CurrentTime />
        <ParseUnix />
    </Flex>
}