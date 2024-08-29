import { Flex } from "@chakra-ui/react";
import Transformer from "./apps/transformer";

export default function Home() {
  return (
    <Flex
      className="h-full w-full"
      alignItems="stretch"
      direction="column"
      padding={{ base: 1, lg: 4 }}
      flex={1}
    >
      <Transformer />
    </Flex>
  );
}
