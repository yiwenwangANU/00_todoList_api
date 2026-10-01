import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { Redis } from "ioredis";
import { redisStorage } from "@better-auth/redis-storage";
import { prisma } from "./prisma";

const redis = new Redis(process.env.REDIS_URL!);

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  secondaryStorage: redisStorage({
    client: redis,
    keyPrefix: "better-auth:",
  }),
});
