import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      username: string | null;
      email: string;
      role: string;
      name: string | null; // Tambahkan properti 'name' jika diperlukan
      password: string | null;
    } & DefaultSession;
  }
  interface User extends DefaultUser {
    username: string | null;
    role: string;
    name: string | null; // Tambahkan properti 'name' jika diperlukan
    password: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    username: string | null;
    role: string;
  }
}
