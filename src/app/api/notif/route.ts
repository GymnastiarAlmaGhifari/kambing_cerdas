import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { notifications } from "@prisma/client";
import { NextRequest } from "next/server";

// Mendapatkan semua data notifications
export async function GET(req: NextRequest) {
  // simpan ke let query hari
  try {
    let notificationsData: notifications[] = [];

    notificationsData = await db.notifications.findMany({
      select: {
        id_notifications: true,
        message_notifications: true,
        tag_id: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    //   return dengan status 200
    return NextResponse.json({ notificationsData });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Terjadi kesalahan dalam memuat data notifications." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { message_notifications } = await req.json();

    const notifications = await db.notifications.create({
      data: {
        message_notifications: message_notifications,
      },
    });
    return NextResponse.json(notifications, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error loading notifications." }, { status: 500 });
  }
}
