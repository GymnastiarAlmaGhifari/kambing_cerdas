import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { Dht22 } from "@prisma/client";
import { NextRequest } from "next/server";

export async function POST(req: Request) {
  try {
    const { id_kandang } = await req.json();

    const sensor = await db.dht22.create({
      data: {
        id_kandang: id_kandang,
      },
    });
    return NextResponse.json(sensor, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error loading sensor." }, { status: 500 });
  }
}

// get
export async function GET(req: Request) {
  try {
    const data = await db.dht22.findMany({
      include: {
        kandang: {
          select: {
            id_kandang: true,
            nama_kandang: true,
            gambar_kandang: true,
          },
        },
      },
    });
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error loading sensor." }, { status: 500 });
  }
}
