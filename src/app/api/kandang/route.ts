import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { join } from "path";
import { unlink, writeFile } from "fs/promises";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  const data = await req.formData();
  const file: File | null = data.get("file") as unknown as File;
  const nama_kandang: string = data.get("nama_kandang") as unknown as string;

  if (!file) {
    return NextResponse.json({ success: false });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const fileExtension = file.name.split(".").pop() || "txt";

  // gunakan uuidv4 untuk membuat nama file untuk gambar_kandang
  const id = uuidv4();
  const namaFile = `${nama_kandang}_${id}.${fileExtension}`;

  // With the file data in the buffer, you can do whatever you want with it.
  // For this, we'll just write it to the filesystem in a new location
  const path = join(process.cwd(), "/images/kandang", namaFile);

  try {
    await writeFile(path, buffer);
    console.log(`open ${path} to see the uploaded file`);

    const kandang = await db.kandang.create({
      data: {
        nama_kandang,
        // gambar_kandang: `/images/kandang/${namaFile}`,
        gambar_kandang: namaFile,
      },
    });

    return NextResponse.json({ kandang, message: "Kandang berhasil dibuat" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Terjadi kesalahan dalam memuat data kandang." }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const kandang = await db.kandang.findMany({
    orderBy: {
      id_kandang: "asc",
    },
  });

  return NextResponse.json(kandang);
}

export async function DELETE(req: NextRequest) {
  const { id_kandang } = await req.json();

  try {
    if (!id_kandang) {
      return NextResponse.json({ message: "Parameter id kandang diperlukan." }, { status: 400 });
    }

    const semuaGambarKandang = await db.kandang.findMany({
      where: {
        id_kandang: id_kandang as string,
      },
      select: {
        gambar_kandang: true,
      },
    });

    const semuaGambarIot = await db.iotimageprocessing.findMany({
      where: {
        kambing: {
          kandang: {
            id_kandang: id_kandang as string,
          },
        },
      },
      select: {
        imagePath: true,
      },
    });

    const semuaGambarKambing = await db.kambing.findMany({
      where: {
        id_kandang: id_kandang as string,
      },
      select: {
        gambar_kambing: true,
      },
    });

    // Hapus gambar dari sistem file (iotimage)
    for (const gambar of semuaGambarIot) {
      const pathGambarIot = join(process.cwd(), "images/iotimage", gambar.imagePath);
      await unlink(pathGambarIot);
    }

    // Hapus gambar dari sistem file (kambing)
    for (const gambarKambing of semuaGambarKambing) {
      if (gambarKambing.gambar_kambing) {
        const pathGambarKambing = join(process.cwd(), "images/kambing", gambarKambing.gambar_kambing);
        await unlink(pathGambarKambing);
      }
    }

    // Hapus gambar dari sistem file (kandang)
    for (const gambarKandang of semuaGambarKandang) {
      if (gambarKandang.gambar_kandang) {
        const pathGambarKandang = join(process.cwd(), "images/kandang", gambarKandang.gambar_kandang);
        await unlink(pathGambarKandang);
      }
    }

    // Hapus data dari database (iotimage)
    const dataIot = await db.iotimageprocessing.deleteMany({
      where: {
        kambing: {
          kandang: {
            id_kandang: id_kandang as string,
          },
        },
      },
    });
    // Hapus data dari database (kambing)
    const dataKambing = await db.kambing.deleteMany({
      where: {
        id_kandang: id_kandang as string,
      },
    });

    // hapus data dari database (dht22)
    const dataDht = await db.dataDht.deleteMany({
      where: {
        dht22: {
          kandang: {
            id_kandang: id_kandang as string,
          },
        },
      },
    });

    // Hapus data dari database (dht) dan yang datanya yang berkaitan
    const Dht = await db.dht22.deleteMany({
      where: {
        kandang: {
          id_kandang: id_kandang as string,
        },
      },
    });

    // Hapus data dari database (kandang)
    const dataKandang = await db.kandang.deleteMany({
      where: {
        id_kandang: id_kandang as string,
      },
    });

    return NextResponse.json({ dataIot, dataKambing, dataKandang, dataDht, Dht, Message: "Data sensor dan gambar berhasil dihapus." });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "Terjadi kesalahan dalam menghapus data sensor atau gambar." }, { status: 500 });
  }
}
