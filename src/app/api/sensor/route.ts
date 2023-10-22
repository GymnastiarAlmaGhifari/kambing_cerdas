import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { Sensor } from "@prisma/client";
import { NextRequest } from "next/server";

// Mendapatkan semua data sensor
export async function GET(req: NextRequest) {
  // simpan ke let query hari
  try {
    const { searchParams } = new URL(req.url);

    const date = searchParams.get("date");

    // const cursor = searchParams.get("cursor");

    let sensorData: Sensor[] = [];

    // jika date dengan nilai default "sehari"

    if (date === "sehari") {
      sensorData = await db.sensor.findMany({
        // cursor: {
        //   id: cursor,
        // },
        select: {
          id: true,
          temperature: true,
          humidity: true,
          createdAt: true, // Memasukkan createdAt dari Prisma
        },
        // take: 20,
        // skip: 1,
        orderBy: {
          createdAt: "desc",
        },
      });

      return NextResponse.json({ sensorData });
    } else if (date === "seminggu") {
      sensorData = await db.sensor.findMany({
        select: {
          id: true,
          temperature: true,
          humidity: true,
          createdAt: true, // Memasukkan createdAt dari Prisma
        },
        orderBy: {
          temperature: "desc",
        },
      });

      return NextResponse.json({ sensorData });
    } else {
      return NextResponse.json({ message: "Terjadi kesalahan dalam memuat data sensor." }, { status: 500 });
    }

    // let nextCursor = null;

    // if (sensorData.length === 20) {
    //   nextCursor = sensorData[sensorData.length - 1].id;
    // }

    // return NextResponse.json({
    //   items: sensorData,
    //   // nextCursor,
    // });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Terjadi kesalahan dalam memuat data sensor." }, { status: 500 });
  }
}

// try {
//   const { searchParams } = new URL(req.url);

//   const cursor = searchParams.get("cursor");

//   let sensorData: Sensor[] = [];

//   if (cursor) {
//     sensorData = await db.sensor.findMany({
//       cursor: {
//         id: cursor,
//       },
//       select: {
//         id: true,
//         temperature: true,
//         humidity: true,
//         createdAt: true, // Memasukkan createdAt dari Prisma
//       },
//       take: 20,
//       skip: 1,
//       orderBy: {
//         id: "asc",
//       },
//     });
//   } else {
//     sensorData = await db.sensor.findMany({
//       take: 20,
//       orderBy: {
//         id: "asc",
//       },
//     });
//   }

//   let nextCursor = null;

//   if (sensorData.length === 20) {
//     nextCursor = sensorData[sensorData.length - 1].id;
//   }

//   return NextResponse.json({
//     items: sensorData,
//     nextCursor,
//   });
// } catch (error) {
//   console.error(error);
//   return NextResponse.json({ message: "Terjadi kesalahan dalam memuat data sensor." }, { status: 500 });
// }

// buat data sensor baru
export async function POST(req: Request) {
  try {
    const { temperature, humidity } = await req.json();

    const sensor = await db.sensor.create({
      data: {
        temperature: temperature,
        humidity: humidity,
      },
    });
    return NextResponse.json(sensor, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error loading sensor." }, { status: 500 });
  }
}
