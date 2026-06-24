import type { DefaultSession, DefaultUser } from "next-auth";
import type { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: { id: string; onboarded?: boolean; } & DefaultSession["user"];
  }
  interface User extends DefaultUser {
    id: string; onboarded?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id?: string; onboarded?: boolean;
  }
}
