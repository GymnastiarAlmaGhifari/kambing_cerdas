import { db } from "@/lib/db";
import { NextResponse } from "next/server";
// import { CartImageProcessing } from "@prisma/client";
import { NextRequest } from "next/server";
import { join } from "path";
import { writeFile, unlink } from "fs/promises";

export async function DELETE(req: NextRequest) {
  // const idKambing = searchParams.get("id_kambing");
  // const usia = searchParams.get("usia");

  const { id, id_kambing, usia } = await req.json();

  try {
    if (!id_kambing || !usia) {
      return NextResponse.json({ message: "Parameter id_kambing dan usia diperlukan." }, { status: 400 });
    }

    // const gambarYang akan dihapus
    const gambarYangDihapus = await db.cartimageprocessing.findFirst({
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
    const pathGambar = join(process.cwd(), "images/iotimage", gambarYangDihapus?.imagePath as string);
    await unlink(pathGambar);

    // Hapus data dari database
    const data = await db.cartimageprocessing.delete({
      where: {
        id: id,
        id_kambing: id_kambing as string,
        usia: parseInt(usia), // Mengasumsikan 'usia' adalah nilai numerik, sesuaikan jika tidak
      },
    });

    return NextResponse.json({ data, Message: "Data sensor dan gambar berhasil dihapus." });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "Terjadi kesalahan dalam menghapus data sensor atau gambar." }, { status: 500 });
  }
}
