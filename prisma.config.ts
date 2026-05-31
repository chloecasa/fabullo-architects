import { config } from "dotenv";
import { defineConfig, env } from "prisma/config";

// Force dotenv to load your secure .env.local file so Prisma CLI can find your connection strings [1]
config({ path: ".env.local" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
    directUrl: env("DIRECT_URL"),
  } as any, // Cast to any to bypass the missing Prisma 7 typescript definition [1]
});
