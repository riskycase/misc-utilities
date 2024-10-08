import { apps } from "@/data/apps";
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: "https://utils.riskycase.in",
            lastModified: new Date(),
            changeFrequency: "yearly",
            priority: 1,
        },
        ...apps.map((app) => ({
            url: `https://utils.riskycase.in/apps/${app.identifier}`,
            lastModified: new Date(),
            changeFrequency: "yearly" as "yearly", // Typescript shenanigans ¯\_(ツ)_/¯
            priority: 0.7,
        })),
    ];
}
