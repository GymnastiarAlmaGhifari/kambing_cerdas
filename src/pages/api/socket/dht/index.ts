import { NextApiRequest } from "next";
import { NextApiResponseServerIo } from "types/socket";
import { db } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIo) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const { temperature, humidity } = req.body;

    const sensorData = await db.sensor.create({
      data: {
        temperature,
        humidity,
      },
    });

    // emit data using server.io if available
    res?.socket?.server?.io?.emit("sensors", sensorData);

    console.log("sensorData", sensorData);
    // consol log addSensorData

    return res.status(200).json(sensorData);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
