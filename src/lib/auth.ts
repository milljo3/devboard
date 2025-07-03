import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "../../node_modules/@prisma/client";

const prisma = new PrismaClient();
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
        minPasswordLength: 6,
    },
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60,
        }
    }
});

export type ErrorCode = keyof typeof auth.$ERROR_CODES | "UNKNOWN";