import { NextApiHandler, NextApiRequest } from "next";
import { NextApiResponseServerIo } from "types/socket";
import { db } from "@/lib/db";
import path, { join, extname } from "path";
import formidable from "formidable";
import fs from "fs/promises";

export const config = {
  api: {
    bodyParser: false,
  },
};

const nameFile = (id: string) => {
  const datenow = new Date();

  // Mendapatkan informasi waktu saat ini
  const seconds = datenow.getSeconds();
  const minutes = datenow.getMinutes();
  const hours = datenow.getHours();
  const day = datenow.getDate();
  const month = datenow.getMonth() + 1; // Month is zero-based
  const year = datenow.getFullYear();

  // Format file name: id_detik-jam-tanggal-bulan-tahun
  const filename = `${id}_${seconds}-${minutes}-${hours}-${day}-${month}-${year}.jpeg`;
  return filename;
};

const readFile = (req: NextApiRequest, saveLocally?: boolean): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  const options: formidable.Options = {};
  if (saveLocally) {
    options.uploadDir = path.join(process.cwd(), "/images/iotimage");
    options.filename = (name, ext, path, form) => {
      const { id } = req.query;

      // Mendapatkan informasi waktu saat ini

      //  const filename = id ditambah dengan extension atau tipe dari file
      // const filename = `${id}.jpeg`;
      const filename = nameFile(id as string);

      return filename;
    };
  }
  options.maxFileSize = 4000 * 1024 * 1024;
  const form = formidable(options);
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
};

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIo) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const directoryPath = path.join(process.cwd(), "/images/iotimage");
  try {
    await fs.access(directoryPath);
  } catch (error) {
    await fs.mkdir(directoryPath);
  }

  try {
    await readFile(req, true);

    // ambil filename dari readFile(req, true);

    // Ambil 'filename' dari 'files' yang diterima dari 'readFile'
    const { id, bobot, usia, deskripsi } = req.query;

    const filename = nameFile(id as string);

    // Mengisi imagePath dengan nama file
    const estimateData = await db.cartImageProcessing.create({
      data: {
        imagePath: filename,
        id_kambing: id as string,
        bobot: parseFloat(bobot as string),
        usia: parseInt(usia as string),
        deskripsi: deskripsi as string,
      },
    });

    res?.socket?.server?.io?.emit("addEstimate", estimateData);
    console.log("cartImageProcessing", estimateData);

    return res.status(200).json(estimateData);
    // res.json({ done: "ok" });
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
}
