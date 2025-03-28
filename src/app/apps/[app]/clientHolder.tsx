"use client";

import { App } from "@/data/apps";
import { base64Decode } from "@/util";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Flex,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useSearchParams } from "next/navigation";
import { MdShare } from "react-icons/md";

export default function ClientHolder({ app }: { app: App }) {
  const searchParams = useSearchParams();
  return (
    <Flex
      direction="column"
      alignItems="stretch"
      padding={{ base: 4, lg: 8 }}
      gap={2}
      flex={1}
    >
      <Flex justifyContent="space-between" alignItems="center">
        <Breadcrumb fontSize="large">
          <BreadcrumbItem>
            <BreadcrumbLink as={NextLink} href="/">
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink isCurrentPage>{app.displayName}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        {app.saveState ? (
          <Button
            rightIcon={<MdShare />}
            onClick={() => {
              navigator.share({ text: window.location.href });
            }}
          >
            Share this setup
          </Button>
        ) : (
          <></>
        )}
      </Flex>
      <app.element state={base64Decode(searchParams.get("state") || "e30=")} />
    </Flex>
  );
}
