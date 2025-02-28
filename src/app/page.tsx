import { apps } from "@/data/apps";
import {
  Box,
  Divider,
  Flex,
  Heading,
  LinkBox,
  LinkOverlay,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import NextLink from "next/link";
import Footer from "./footer";

export default function Home() {
  return (
    <Flex
      className="h-full w-full"
      alignItems="stretch"
      direction="column"
      padding={{ base: 4, lg: 8 }}
      flex={1}
      justifyContent="start"
    >
      <Heading>Miscallaneous utilities</Heading>
      <Divider marginY={4} />
      <SimpleGrid spacing={{ base: 1, lg: 2 }} columns={{ base: 1, md: 2 }}>
        {apps.map((app, index) => (
          <LinkBox
            key={index}
            borderWidth="1px"
            rounded="md"
            padding={{ base: 2, lg: 4 }}
          >
            <Heading size="md">
              <LinkOverlay as={NextLink} href={`/apps/${app.identifier}`}>
                {app.displayName}
              </LinkOverlay>
            </Heading>
            {app.description && <Text>{app.description}</Text>}
          </LinkBox>
        ))}
      </SimpleGrid>
      <Box flex={1} />
      <Footer />
    </Flex>
  );
}
