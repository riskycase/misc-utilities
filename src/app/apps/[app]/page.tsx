import { apps } from "@/data/apps";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    Flex,
} from "@chakra-ui/react";
import { Metadata } from "next";
import NextLink from "next/link";

export default function AppUI({ params }: { params: { app: string } }) {
    const app = apps.find((app) => app.identifier === params.app)!!;
    return (
        <Flex
            direction="column"
            alignItems="stretch"
            padding={{ base: 4, lg: 8 }}
            gap={2}
            flex={1}
        >
            <Breadcrumb fontSize="large">
                <BreadcrumbItem>
                    <BreadcrumbLink as={NextLink} href="/">
                        Home
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem>
                    <BreadcrumbLink isCurrentPage>
                        {app.displayName}
                    </BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
            <app.element />
        </Flex>
    );
}

export async function generateMetadata({ params }: { params: { app: string } }): Promise<Metadata> {
    const app = apps.find((app) => app.identifier === params.app)!!;
    return Promise.resolve({
        title: app.displayName,
        description: app.description
    })
}

export async function generateStaticParams() {
    return apps.map((app) => ({ app: app.identifier }));
}
