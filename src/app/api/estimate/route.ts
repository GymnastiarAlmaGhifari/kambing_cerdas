import { db } from "@/lib/db";
import { NextResponse } from "next/server";
// import { CartImageProcessing } from "@prisma/client";
import { NextRequest } from "next/server";
import { join } from "path";
import { writeFile, unlink } from "fs/promises";

type CartImageProcessing = {
  id?: string;
  usia?: number | null;
  deskripsi?: string | null;
  bobot?: number | null;
  imagePath?: string;
  standart?: number | null;
  keterangan?: string | null;
  createdAt: Date;
  kambing?: {
    nama_kambing: string;
  } | null; // Make kambing optional
};
// Mendapatkan semua data sensor
export async function GET(req: NextRequest) {
  // simpan ke let query hari
  try {
    let estimateData: CartImageProcessing[] = [];

    estimateData = await db.cartimageprocessing.findMany({
      select: {
        id: true,
        usia: true,
        deskripsi: true,
        bobot: true,
        imagePath: true,
        standart: true,
        keterangan: true,
        kambing: {
          select: {
            id_kambing: true,
            nama_kambing: true,
          },
        },
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ estimateData });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "Terjadi kesalahan dalam memuat data sensor." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { id_kambing, usia, imagePath, bobot, deskripsi, standart, keterangan } = await req.json();

  try {
    if (!id_kambing || !usia) {
      return NextResponse.json({ message: "Parameter id, id_kambing, dan usia diperlukan." }, { status: 400 });
    }

    // buat jika id_kambing dan usia sudah ada maka tidak bisa menambahkan data
    const dataAda = await db.iotimageprocessing.findFirst({
      where: {
        id_kambing: id_kambing as string,
        usia: usia,
      },
    });

    if (dataAda) {
      return NextResponse.json({ message: "Data estimasi sudah ada." }, { status: 400 });
    }

    // tambahkan data iotimageprocessing
    const data = await db.iotimageprocessing.create({
      data: {
        id_kambing: id_kambing as string,
        usia: usia,
        imagePath: imagePath as string,
        bobot: bobot,
        standart: standart,
        keterangan: keterangan,
        deskripsi: deskripsi as string,
      },
    });

    return NextResponse.json({ data, message: "Data sensor berhasil ditambahkan." });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "Terjadi kesalahan dalam menambahkan data sensor." }, { status: 500 });
  }
}

// delete
export async function DELETE(req: NextRequest) {
  // const idKambing = searchParams.get("id_kambing");
  // const usia = searchParams.get("usia");

  const { id, id_kambing, usia } = await req.json();

  try {
    if (!id_kambing || !usia) {
      return NextResponse.json({ message: "Parameter id_kambing dan usia diperlukan." }, { status: 400 });
    }

    const semuaGambar = await db.cartimageprocessing.findMany({
      where: {
        id_kambing: id_kambing as string,
        usia: parseInt(usia), // Mengasumsikan 'usia' adalah nilai numerik, sesuaikan jika tidak
      },
      select: {
        imagePath: true,
      },
    });

    // const gambarYang akan dihapus
    const gambarYangTidakDihapus = await db.cartimageprocessing.findFirst({
      where: {
        id: id,
        id_kambing: id_kambing as string,
        usia: parseInt(usia), // Mengasumsikan 'usia' adalah nilai numerik, sesuaikan jika tidak
      },
      select: {
        imagePath: true,
      },
    });

    // Hapus gambar dari sistem file
    for (const gambar of semuaGambar) {
      if (gambar.imagePath !== gambarYangTidakDihapus?.imagePath) {
        const pathGambar = join(process.cwd(), "images/iotimage", gambar.imagePath);
        await unlink(pathGambar);
      }
    }

    // Hapus data dari database
    const data = await db.cartimageprocessing.deleteMany({
      where: {
        id_kambing: id_kambing as string,
        usia: parseInt(usia), // Mengasumsikan 'usia' adalah nilai numerik, sesuaikan jika tidak
        // selain  gambar yang akan ditambahkan
      },
    });

    return NextResponse.json({ data, Message: "Data sensor dan gambar berhasil dihapus." });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "Terjadi kesalahan dalam menghapus data sensor atau gambar." }, { status: 500 });
  }
}
