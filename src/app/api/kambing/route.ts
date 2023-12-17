import { db } from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";
import { join } from "path";
import { unlink } from "fs/promises";

export async function DELETE(req: NextRequest) {
  const { id_kambing } = await req.json();

  try {
    if (!id_kambing) {
      return NextResponse.json({ message: "Parameter id_kambing diperlukan." }, { status: 400 });
    }

    const semuaGambarIot = await db.iotimageprocessing.findMany({
      where: {
        id_kambing: id_kambing as string,
      },
      select: {
        imagePath: true,
      },
    });

    const semuaGambarKambing = await db.kambing.findMany({
      where: {
        id_kambing: id_kambing as string,
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

    // Hapus data dari database (iotimage)
    const dataIot = await db.iotimageprocessing.deleteMany({
      where: {
        id_kambing: id_kambing as string,
      },
    });
    // Hapus data dari database (kambing)
    const dataKambing = await db.kambing.deleteMany({
      where: {
        id_kambing: id_kambing as string,
      },
    });

    return NextResponse.json({ dataIot, dataKambing, Message: "Data sensor dan gambar berhasil dihapus." });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "Terjadi kesalahan dalam menghapus data sensor atau gambar." }, { status: 500 });
  }
}
