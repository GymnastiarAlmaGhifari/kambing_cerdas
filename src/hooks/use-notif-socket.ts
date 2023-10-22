import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { notifications } from "@prisma/client"; // Import model Notif dari Prisma

import { useSocket } from "@/components/providers/socket-provider";

type NotifSocketProps = {
  addKey: string;
  updateKey?: string;

  queryKey: string;
};

export const useNotifSocket = ({ addKey, updateKey, queryKey }: NotifSocketProps) => {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  function showNotification(title: string, options: NotificationOptions) {
    if (Notification.permission === "granted") {
      new Notification(title, options);
    }
  }

  // Di dalam fungsi yang dipanggil saat event "addKey" dari WebSocket muncul
  useEffect(() => {
    if (socket) {
      const handleAddKey = (notificationsData: notifications) => {
        // Mengecek izin notifikasi
        if (Notification.permission !== "granted") {
          // Jika pengguna belum memberikan izin, tampilkan permintaan izin notifikasi
          Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
              // Izin diberikan, tampilkan notifikasi
              showNotification("Pesan Baru", { body: `${notificationsData.message_notifications}` });
            }
          });
        } else {
          // Izin sudah diberikan, tampilkan notifikasi
          showNotification("Pesan Baru", { body: `${notificationsData.message_notifications}` });
        }
      };

      socket.on(addKey, handleAddKey);

      return () => {
        socket.off(addKey, handleAddKey);
      };
    }
  }, [socket, addKey]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    // socket.on(updateKey, (notificationsData: notifications) => {
    //   queryClient.setQueryData([queryKey], (oldData: any) => {
    //     if (!oldData || !oldData.pages || oldData.pages.length === 0) {
    //       return oldData;
    //     }

    //     const newData = oldData.pages.map((page: any) => {
    //       return {
    //         ...page,
    //         notificationsData: page.NotifData.map((notificationsData: notifications) => {
    //           if (notificationsData.id_notifications === notificationsData.id_notifications) {
    //             return notificationsData;
    //           }
    //           return notificationsData;
    //         }),
    //       };
    //     });

    //     return {
    //       ...oldData,
    //       pages: newData,
    //     };
    //   });
    // });

    socket.on(addKey, (notificationsData: notifications) => {
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return {
            pages: [
              {
                notificationsData: [notificationsData],
              },
            ],
          };
        }

        const newData = [...oldData.pages];

        if (newData[0].notificationsData && Array.isArray(newData[0].notificationsData)) {
          newData[0] = {
            ...newData[0],
            notificationsData: [notificationsData, ...newData[0].notificationsData],
          };
        } else {
          newData[0].notificationsData = [notificationsData];
        }
        return {
          ...oldData,
          pages: newData,
        };
      });
    });

    return () => {
      if (updateKey) {
        socket.off(updateKey);
      }
      socket.off(addKey);
    };
  }, [queryClient, addKey, queryKey, socket, updateKey]);
};
