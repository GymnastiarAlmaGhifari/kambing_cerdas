import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import { userRole } from "@prisma/client";

// get user
export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const id = searchParams.get("id");

    const role = searchParams.get("role");

    const user = await db.user.update({
      where: { id: id as string },
      data: {
        role: role as userRole,
      },
    });

    if (!user) {
      return NextResponse.json({ user: null, message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user, message: "User found" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Something went wrong!" }, { status: 500 });
  }
}
