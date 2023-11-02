import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { join } from "path";
import { writeFile } from "fs/promises";

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);

  const id = searchParams.get("id");

  const data = await req.formData();

  const file: File | null = data.get("file") as unknown as File;

  if (!file) {
    return NextResponse.json({ success: false });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const fileExtension = file.name.split(".").pop() || "txt";

  const imagePath = `${id}.${fileExtension}`;

  const path = join(process.cwd(), "/images/iotimage", imagePath);

  try {
    await writeFile(path, buffer);
    console.log(`open ${path} to see the uploaded file`);
    const iotImageProcessingData = await db.iOTImageProcessing.create({
      data: {
        imagePath: imagePath,
        // You should specify the relationship to Kambing by using 'kambingId'
      },
    });
    return NextResponse.json({ iotImageProcessingData });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "Terjadi kesalahan dalam memuat data sensor." }, { status: 500 });
  }
}
