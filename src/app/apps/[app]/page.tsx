import { apps } from "@/data/apps";
import { Metadata } from "next";
import ClientHolder from "./clientHolder";
import { Suspense } from "react";
import Footer from "@/app/footer";
import { Flex } from "@chakra-ui/react";

export default function AppUI({ params }: { params: { app: string } }) {
  const app = apps.find((app) => app.identifier === params.app)!!;
  return (
    <Flex
      className="h-full w-full"
      alignItems="stretch"
      direction="column"
      padding={{ base: 4, lg: 8 }}
      flex={1}
      justifyContent="start"
    >

    <Suspense>
      <ClientHolder app={app} />
    </Suspense>
    <Footer />
    </Flex>
  );
}

export async function generateMetadata({
  params,
}: {
  params: { app: string };
}): Promise<Metadata> {
  const app = apps.find((app) => app.identifier === params.app)!!;
  return Promise.resolve({
    title: app.displayName,
    description: app.description,
  });
}

export async function generateStaticParams() {
  return apps.map((app) => ({ app: app.identifier }));
}
