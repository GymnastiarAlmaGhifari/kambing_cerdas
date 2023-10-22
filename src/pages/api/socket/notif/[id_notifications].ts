import { NextApiRequest } from "next";
import { NextApiResponseServerIo } from "types/socket";
import { db } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIo) {
  if (req.method !== "PATCH") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const { message_notifications } = req.body;

    const notificationsData = await db.notifications.update({
      where: {
        id_notifications: "clnxsi9nl0000cmkce64vlly6",
      },
      data: {
        message_notifications: message_notifications,
      },
    });

    // emit data using server.io if available
    res?.socket?.server?.io?.emit("addNotifikasi", notificationsData);

    console.log("notifications", notificationsData);
    // consol log addnotifications

    return res.status(200).json(notificationsData);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
