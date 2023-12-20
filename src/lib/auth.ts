import { NextAuthOptions } from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import { GoogleProfile } from "next-auth/providers/google";
import { compare, hashSync } from "bcrypt";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "./db";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === "production",

  pages: {
    signIn: "/sign-in",
    error: "/error",
  },
  providers: [
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID as string,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    // }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "jhon@gmail.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        const existingUser = await db.user.findUnique({
          where: { email: credentials?.email },
        });

        if (!existingUser) {
          throw new Error("Email Anda Belum Terdaftar");
        }

        if (existingUser.password) {
          const passwordMatch = await compare(credentials.password, existingUser.password);

          if (!passwordMatch) {
            throw new Error("Password Anda Salah");
          }
        }

        return {
          id: existingUser.id,
          username: existingUser.username,
          password: existingUser.password,
          name: existingUser.name,
          email: existingUser.email,
          role: existingUser.role,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.image = user.image;
        token.name = user.name;
      }
      return Promise.resolve(token);
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user = {
          ...session.user,
          role: token.role,
          username: token.username,
        };
      }
      return session;
    },
    // async signIn(params) {
    //   const { user, account, profile } = params;
    //   const randomString = Math.random().toString(36).substring(2);

    //   if (account?.provider === "google" && profile?.email) {
    //     // Cari atau buat pengguna berdasarkan email dari profil Google
    //     const existingUser = await db.user.findUnique({
    //       where: { email: profile.email },
    //     });

    //     if (existingUser) {
    //       // Setel peran pengguna sesuai kebutuhan Anda
    //       user.role = existingUser.role;
    //       user.username = existingUser.username;
    //     } else {
    //       // Jika pengguna tidak ditemukan, Anda dapat membuatnya dengan kata sandi acak menggunakan bcrypt
    //       user.role = "user"; // Ganti dengan peran default yang Anda inginkan

    //       // Menghasilkan kata sandi acak dengan bcrypt
    //       const saltRounds = 10; // Tingkat garam, semakin tinggi semakin aman tetapi memakan waktu lebih lama
    //       const randomPassword = Math.random().toString(36).substring(2);
    //       const hashedPassword = hashSync(randomPassword, saltRounds);

    //       user.password = hashedPassword;
    //     }
    //   }

    //   return true;
    // },
  },
};
