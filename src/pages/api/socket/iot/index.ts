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

const readFile = (req: NextApiRequest, saveLocally?: boolean): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  const options: formidable.Options = {};
  if (saveLocally) {
    options.uploadDir = path.join(process.cwd(), "/images/iotimage");
    options.filename = (name, ext, path, form) => {
      const { id } = req.query;
      //  const filename = id ditambah dengan extension atau tipe dari file
      const filename = id as string;

      // const filename = `${id}.jpeg`;
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
    const { id } = req.query;
    //  const filename = id ditambah dengan extension atau tipe dari file
    const filename = `${id}.jpeg`;

    // Mengisi imagePath dengan nama file
    const iotImageProcessingData = await db.iOTImageProcessing.create({
      data: {
        imagePath: filename,
        id_kambing: id as string,
      },
    });

    res?.socket?.server?.io?.emit("addIot", iotImageProcessingData);
    console.log("iotImageProcessingData", iotImageProcessingData);

    return res.status(200).json(iotImageProcessingData);
    // res.json({ done: "ok" });
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
}
