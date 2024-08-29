"use client";

import { ChakraProvider, Flex, theme } from "@chakra-ui/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider>
      <Flex
        direction="column"
        minH="100vh"
        backgroundColor={theme.colors.gray[900]}
        color={theme.colors.gray[50]}
        maxWidth="100vw"
        boxSizing="border-box"
      >
        {children}
      </Flex>
    </ChakraProvider>
  );
}
