import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { Kambing } from "@prisma/client";
import { NextRequest } from "next/server";

export async function GET(req: Request, { params }: { params: { id_kandang: string } }) {
  // ambil semua data kambing dari database

  const { id_kandang } = params;

  try {
    const kambingData = await db.kambing.findMany({
      where: { id_kandang: id_kandang },
      select: {
        nama_kambing: true,
        bobot: true,
      },
    });
    return NextResponse.json(kambingData, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Terjadi kesalahan saat mengambil data kambing" }, { status: 500 });
  }
}
