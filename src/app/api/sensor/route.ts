import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { DataDht } from "@prisma/client";
import { NextRequest } from "next/server";

// Mendapatkan semua data sensor
export async function GET(req: NextRequest) {
  // simpan ke let query hari
  try {
    const { searchParams } = new URL(req.url);

    const id = searchParams.get("id");
    const date = searchParams.get("date");

    // const cursor = searchParams.get("cursor");

    let sensorData: DataDht[] = [];

    // jika date dengan nilai default "sehari"
    if (date === "sejam") {
      sensorData = await db.dataDht.findMany({
        where: {
          id_dht22: id,
          createdAt: {
            gte: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000),
          },
        },
        select: {
          id_dht22: true,
          id_data_dht: true,
          temperature: true,
          humidity: true,
          createdAt: true, // Memasukkan createdAt dari Prisma
          updatedAt: true,
        },
        take: 60,
        orderBy: {
          createdAt: "desc",
        },
      });

      return NextResponse.json({ sensorData });
    } else if (date === "sehari") {
      sensorData = await db.dataDht.findMany({
        where: {
          id_dht22: id,
          createdAt: {
            gte: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000),
          },
        },

        select: {
          id_dht22: true,
          id_data_dht: true,
          temperature: true,
          humidity: true,
          createdAt: true, // Memasukkan createdAt dari Prisma
          updatedAt: true,
        },
        take: 1440,
        orderBy: {
          createdAt: "desc",
        },
      });

      return NextResponse.json({ sensorData });
    } else if (date === "seminggu") {
      sensorData = await db.dataDht.findMany({
        where: {
          id_dht22: id,
          createdAt: {
            gte: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
          },
        },
        select: {
          id_dht22: true,
          id_data_dht: true,
          temperature: true,
          humidity: true,
          createdAt: true, // Memasukkan createdAt dari Prisma
          updatedAt: true,
        },
        take: 10080,
        orderBy: {
          createdAt: "desc",
        },
      });

      return NextResponse.json({ sensorData });
    } else if (date === "sebulan") {
      sensorData = await db.dataDht.findMany({
        where: {
          id_dht22: id,
          createdAt: {
            gte: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000),
          },
        },
        select: {
          id_dht22: true,
          id_data_dht: true,
          temperature: true,
          humidity: true,
          createdAt: true, // Memasukkan createdAt dari Prisma
          updatedAt: true,
        },
        take: 43200,
        orderBy: {
          createdAt: "desc",
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

//   let sensorData: DataDht[] = [];

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
    const { id_data_dht, temperature, humidity } = await req.json();

    const sensor = await db.dataDht.create({
      data: {
        id_dht22: id_data_dht,
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
