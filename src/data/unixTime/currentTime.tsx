"use client"

import { Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export default function CurrentTime() {
  const [seconds, setSeconds] = useState(Math.floor(Date.now() / 1000));
  useEffect(() => {
    setInterval(() => setSeconds(Math.floor(Date.now() / 1000)), 100);
  }, []);
  return <Flex>The current epoch time is {seconds}</Flex>;
}
