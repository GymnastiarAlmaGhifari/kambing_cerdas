import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const img = searchParams.get("img") as string;
    const imgPath = path.join(process.cwd(), "images/kandang", img);

    if (fs.existsSync(imgPath)) {
      // Mengambil data gambar dari sistem file
      const data = fs.readFileSync(imgPath);

      // Menentukan content type berdasarkan ekstensi file
      let contentType = "image/png"; // Default ke PNG
      if (img.endsWith(".jpg") || img.endsWith(".jpeg")) {
        contentType = "image/jpeg";
      } else if (img.endsWith(".gif")) {
        contentType = "image/gif";
      }

      // Mengirimkan gambar dengan content type yang sesuai
      return new Response(data, { headers: { "Content-Type": contentType } });
    } else {
      return NextResponse.json({ message: "Gambar tidak ditemukan" }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ message: "Terjadi kesalahan dalam memuat data gambar." }, { status: 500 });
  }
}
