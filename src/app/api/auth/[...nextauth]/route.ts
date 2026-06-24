import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// next-auth's detectOrigin() checks process.env.VERCEL first and, when set,
// uses the forwarded host header — which is the preview URL on preview deploys.
// Clearing VERCEL forces it to fall through to NEXTAUTH_URL instead.
(process.env as Record<string, string>).VERCEL = "";
process.env.NEXTAUTH_URL = "https://lockd-ai.vercel.app";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
