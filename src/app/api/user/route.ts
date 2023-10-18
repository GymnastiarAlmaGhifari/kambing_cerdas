import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { hash } from "bcrypt";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, username, password } = body;

    const exisitngUserByEmail = await db.user.findUnique({
      where: { email: email },
    });

    if (exisitngUserByEmail) {
      return NextResponse.json({ user: null, message: "User with this email already exists" }, { status: 401 });
    }

    const exisitngUserByUsername = await db.user.findUnique({
      where: { username: username },
    });

    if (exisitngUserByUsername) {
      return NextResponse.json({ user: null, message: "User with this username already exists" }, { status: 401 });
    }

    const hashedPassword = await hash(password, 10);
    const newUser = await db.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: "user",
      },
    });

    const { password: newUserPassword, ...rest } = newUser;
    return NextResponse.json({ user: rest, message: "User created Successfully" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Something went wrong!" }, { status: 500 });
  }
}
