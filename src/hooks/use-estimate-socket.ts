import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { CartImageProcessing } from "@prisma/client"; // Import model Sensor dari Prisma

import { useSocket } from "@/components/providers/socket-provider";

type CartImageProcessingSocketProps = {
  addKey: string;
  updateKey?: string;
  queryKey: string;
};

export const useCartEstimateSocket = ({ addKey, updateKey, queryKey }: CartImageProcessingSocketProps) => {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  function showNotification(title: string, options: NotificationOptions) {
    if (Notification.permission === "granted") {
      const notification = new Notification(title, options);
    }
  }

  // Di dalam fungsi yang dipanggil saat event "addKey" dari WebSocket muncul
  useEffect(() => {
    if (socket) {
      const handleAddKey = (estimateData: CartImageProcessing) => {
        // Tampilkan notifikasi saat ada data baru dari WebSocket
        showNotification("Perhitungan Bobot Baru", { body: `: ${estimateData.bobot}` });
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

    // socket.on(updateKey, (sensorData: CartImageProcessing) => {
    //   queryClient.setQueryData([queryKey], (oldData: any) => {
    //     if (!oldData || !oldData.pages || oldData.pages.length === 0) {
    //       return oldData;
    //     }

    //     const newData = oldData.pages.map((page: any) => {
    //       return {
    //         ...page,
    //         sensorData: page.sensorData.map((item: CartImageProcessing) => {
    //           if (item.id === sensorData.id) {
    //             return sensorData;
    //           }
    //           return item;
    //         }),
    //       };
    //     });

    //     return {
    //       ...oldData,
    //       pages: newData,
    //     };
    //   });
    // });

    socket.on(addKey, (estimateData: CartImageProcessing) => {
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return {
            pages: [
              {
                estimateData: [estimateData],
              },
            ],
          };
        }

        const newData = [...oldData.pages];

        if (newData[0].estimateData && Array.isArray(newData[0].estimateData)) {
          newData[0] = {
            ...newData[0],
            estimateData: [estimateData, ...newData[0].estimateData],
          };
        } else {
          newData[0].estimateData = [estimateData];
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
