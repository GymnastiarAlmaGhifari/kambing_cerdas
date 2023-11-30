import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { notifications } from "@prisma/client";
import { NextRequest } from "next/server";

// Mendapatkan semua data notifications
export async function GET(req: NextRequest) {
  // simpan ke let query hari
  try {
    const tag_id = await db.notifications.findUnique({
      where: {
        id_notifications: "cloe127oa0001cmawhfzoy9iq",
      },
      select: {
        tag_id: true,
      },
    });

    //   return dengan status 200
    return NextResponse.json(tag_id, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Terjadi kesalahan dalam memuat data notifications." }, { status: 500 });
  }
}
