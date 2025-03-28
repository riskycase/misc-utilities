import { apps } from "@/data/apps";
import { Metadata } from "next";
import ClientHolder from "./clientHolder";
import { Suspense } from "react";

export default function AppUI({ params }: { params: { app: string } }) {
  const app = apps.find((app) => app.identifier === params.app)!!;
  return (
    <Suspense>
      <ClientHolder app={app} />
    </Suspense>
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
