import { createAuthClient } from "better-auth/react"
export const authClient = createAuthClient({
    baseURL: "https://devboard-neon.vercel.app"
});

export const {
    signIn,
    signUp,
    signOut,
    useSession,
    sendVerificationEmail,
} = authClient;