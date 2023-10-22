import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { join } from "path";
import { writeFile, unlink } from "fs/promises";
import { v4 as uuidv4 } from "uuid";

export async function PUT(req: Request, { params }: { params: { id_kandang: string } }) {
  const data = await req.formData();
  const file: File | null = data.get("file") as unknown as File;
  const nama_kandang: string | null = data.get("nama_kandang") as unknown as string | null;

  const { id_kandang } = params;

  try {
    // Menerima kandang yang akan diperbarui dari database
    const existingKandang = await db.kandang.findUnique({ where: { id_kandang: id_kandang } });

    if (!existingKandang) {
      return NextResponse.json({ message: "Data kandang tidak ditemukan" }, { status: 404 });
    }

    // Periksa apakah 'nama_kandang' tidak null sebelum menggunakannya
    const updatedKandangData: {
      nama_kandang?: string;
      gambar_kandang?: string;
    } = {};

    if (nama_kandang !== null) {
      updatedKandangData.nama_kandang = nama_kandang;
    }

    if (existingKandang.gambar_kandang !== null) {
      // Menghapus file sebelumnya jika ada
      const existingImagePath = join(process.cwd(), "images/kandang", existingKandang.gambar_kandang);
      await unlink(existingImagePath);
    }

    // Mengunggah file baru dan mengatur data jika tidak null
    if (file !== null) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const fileExtension = file.name.split(".").pop() || "txt";
      const id = uuidv4();
      const namaFile = `${nama_kandang}_${id}.${fileExtension}`;
      const newImagePath = join(process.cwd(), "images/kandang", namaFile);

      await writeFile(newImagePath, buffer);

      updatedKandangData.gambar_kandang = namaFile;
    }

    // Perbarui data kandang dalam database
    const updatedKandang = await db.kandang.update({
      where: { id_kandang: id_kandang },
      data: updatedKandangData,
    });

    return NextResponse.json({ kandang: updatedKandang, message: "Data kandang berhasil diperbarui" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: `Terjadi kesalahan dalam memperbarui data kandang.${error}` }, { status: 500 });
  }
}
