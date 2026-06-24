import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// Force production URL on all Vercel deployments so preview URLs never
// get sent to Google as the redirect_uri.
if (process.env.VERCEL) {
  process.env.NEXTAUTH_URL = "https://lockd-ai.vercel.app";
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
