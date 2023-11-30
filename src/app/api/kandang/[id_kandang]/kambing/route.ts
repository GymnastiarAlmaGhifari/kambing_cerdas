import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { Kambing } from "@prisma/client";
import { NextRequest } from "next/server";
import { join } from "path";
import { writeFile } from "fs/promises";
import { v4 as uuidv4 } from "uuid";

export async function GET(req: Request, { params }: { params: { id_kandang: string } }) {
  // ambil semua data kambing dari database

  const { id_kandang } = params;

  try {
    const kambingData = await db.kambing.findMany({
      where: { id_kandang: id_kandang },
      select: {
        id_kambing: true,
        nama_kambing: true,
        rfid: true,
        bobot: true,
        tanggal_lahir: true,
        gambar_kambing: true,
      },
    });
    return NextResponse.json(kambingData, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Terjadi kesalahan saat mengambil data kambing" }, { status: 500 });
  }
}

// post
export async function POST(req: NextRequest, { params }: { params: { id_kandang: string } }) {
  const data = await req.formData();
  const file: File | null = data.get("file") as unknown as File;
  const nama_kambing: string = data.get("nama_kambing") as unknown as string;
  const rfid: string | null = data.get("rfid") as unknown as string;
  const tanggal_lahir: string = data.get("tanggal_lahir") as unknown as string;

  const tl = new Date(tanggal_lahir);

  try {
    // Periksa apakah RFID sudah ada di database7
    if (rfid !== null && rfid !== undefined && rfid !== "") {
      const existingKambing = await db.kambing.findUnique({
        where: {
          rfid: rfid,
        },
      });

      console.log("Existing Kambing:", existingKambing); // Tambahkan log ini

      if (existingKambing) {
        return NextResponse.json({ message: "RFID sudah ada di database" }, { status: 400 });
      }
    }

    let namaFile: string;

    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const fileExtension = file.name.split(".").pop() || "jpeg";

      // Gunakan uuidv4 untuk membuat nama file untuk gambar_kandang
      const id = uuidv4();
      namaFile = `${nama_kambing}_${id}.${fileExtension}`;

      // Dengan data file di dalam buffer, Anda dapat melakukan apa saja dengan itu.
      // Untuk ini, kita akan menulisnya ke sistem file dalam lokasi baru
      const path = join(process.cwd(), "/images/kambing", namaFile);

      try {
        await writeFile(path, buffer);
        console.log(`Open ${path} to see the uploaded file`);
      } catch (error) {
        return NextResponse.json({ message: "Terjadi kesalahan dalam menyimpan file.", error }, { status: 500 });
      }
    } else {
      // Jika file tidak ada, gunakan file default
      namaFile = "default.jpeg";
    }

    const kandang = await db.kambing.create({
      data: {
        nama_kambing,
        rfid: rfid || null,
        gambar_kambing: namaFile,
        tanggal_lahir: tl,
        id_kandang: params.id_kandang,
      },
    });

    return NextResponse.json({ kandang, message: "Kambing berhasil dibuat" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Terjadi kesalahan dalam memuat data kandang.", error }, { status: 500 });
  }
}
