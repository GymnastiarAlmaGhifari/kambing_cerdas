import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { Kambing } from "@prisma/client";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rfid = searchParams.get("rfid");

    if (rfid) {
      const rfidData = await db.kambing.findMany({
        where: {
          rfid: rfid,
        },
        select: {
          id_kambing: true,
          rfid: true,
          nama_kambing: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      if (rfidData.length > 0) {
        return NextResponse.json({ rfidData });
      } else {
        // RFID tidak ada dalam database, kembalikan respons yang sesuai
        return NextResponse.json({ message: "RFID tidak ditemukan dalam database." }, { status: 404 });
      }
    } else {
      // RFID tidak ada, Anda dapat mengembalikan respons yang sesuai
      return NextResponse.json({ message: "RFID tidak diberikan." }, { status: 400 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Terjadi kesalahan dalam memuat data sensor." }, { status: 500 });
  }
}
