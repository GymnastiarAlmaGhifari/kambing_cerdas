import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { join } from "path";
import { writeFile, unlink } from "fs/promises";
import { v4 as uuidv4 } from "uuid";

export async function GET(req: Request, { params }: { params: { id_kambing: string } }) {
  // ambil semua data kambing dari database
  const { id_kambing } = params;

  try {
    const kambingData = await db.iOTImageProcessing.findMany({
      where: { id_kambing: id_kambing },
      select: {
        bobot: true,
        createdAt: true,
        imagePath: true,
        usia: true,
        deskripsi: true,
      },
      // urutkan data berdasarkan tanggal terbaru
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(kambingData, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Terjadi kesalahan saat mengambil data kambing" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id_kambing: string } }) {
  const data = await req.formData();
  const file: File | null | undefined = data.get("file") as unknown as File;
  const nama_kambing: string | null = data.get("nama_kambing") as unknown as string | null;
  const rfid: string | null = data.get("rfid") as unknown as string;
  const tanggal_lahir: string | Date | null = data.get("tanggal_lahir") as unknown as string;

  let tl: Date | null = null;

  // Periksa apakah tanggal_lahir diberikan dan valid

  const { id_kambing } = params;

  try {
    // jika tanggal tidak null maka tidak perlu diubah

    // Periksa apakah RFID sudah ada di database7

    // Menerima kandang yang akan diperbarui dari database
    const existingKandang = await db.kambing.findUnique({ where: { id_kambing: id_kambing } });

    if (!existingKandang) {
      return NextResponse.json({ message: "Data kandang tidak ditemukan" }, { status: 404 });
    }

    // Periksa apakah 'nama_kambing' tidak null sebelum menggunakannya

    let previousImagePath: string | null = existingKandang.gambar_kambing;

    let previousRFID: string | null = existingKandang.rfid;

    let previousTL: Date | null = existingKandang.tanggal_lahir;

    // jika tanggal tidak null maka tidak perlu diubah
    if (tanggal_lahir !== null && tanggal_lahir !== undefined && tanggal_lahir !== "") {
      tl = new Date(tanggal_lahir);

      // Periksa apakah tanggal yang diberikan valid
      if (isNaN(tl.getTime())) {
        return NextResponse.json({ message: "Tanggal lahir tidak valid" }, { status: 400 });
      }
    } else {
      // Jika tanggal_lahir tidak diberikan, gunakan tanggal yang sudah ada (previousTL)
      tl = previousTL;
    }
    // jika rfid tidak null maka tidak perlu diubah
    if (rfid !== null && rfid !== undefined && rfid !== "") {
      // Check if the rfid is already used by a different record
      const existingKambingWithSameRFID = await db.kambing.findFirst({
        where: {
          rfid: rfid,
          id_kambing: { not: id_kambing }, // Exclude the current record from the check
        },
      });

      console.log("Existing Kambing with same RFID:", existingKambingWithSameRFID);

      if (existingKambingWithSameRFID) {
        return NextResponse.json({ message: "RFID sudah ada di database" }, { status: 400 });
      }

      previousRFID = rfid;
    }
    // Hanya mengunggah file baru jika file tidak null
    if (file !== null) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const fileExtension = file.name.split(".").pop() || "jpeg";
      const id = uuidv4();
      const namaFile = `${nama_kambing}_${id}.${fileExtension}`;
      const newImagePath = join(process.cwd(), "images/kambing", namaFile);

      await writeFile(newImagePath, buffer);

      previousImagePath = namaFile;

      // Hapus file lama jika ada
      if (existingKandang.gambar_kambing) {
        await unlink(join(process.cwd(), "images/kambing", existingKandang.gambar_kambing));
      }
    }

    // jika file null maka tidak

    // Perbarui data kandang dalam database
    const updatedKandang = await db.kambing.update({
      where: { id_kambing: id_kambing },
      data: {
        nama_kambing: nama_kambing as string,
        rfid: previousRFID,
        gambar_kambing: previousImagePath,
        ...(tl !== null && tl !== undefined && { tanggal_lahir: tl }),
        id_kandang: existingKandang.id_kandang,
      },
    });

    return NextResponse.json({ kandang: updatedKandang, message: "Data kandang berhasil diperbarui" }, { status: 200 });
  } catch (error) {
    console.error(`Terjadi kesalahan dalam memperbarui data kandang: ${error}`);
    return NextResponse.json({ message: "Terjadi kesalahan dalam memperbarui data kandang." }, { status: 500 });
  }
}
