import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { DataDht } from "@prisma/client"; // Import model Sensor dari Prisma

import { useSocket } from "@/components/providers/socket-provider";

type SensorSocketProps = {
  addKey: string;
  updateKey?: string;
  queryKey: string;
};

export const useChartSocket = ({ addKey, updateKey, queryKey }: SensorSocketProps) => {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  // function showNotification(title: string, options: NotificationOptions) {
  //   if (Notification.permission === "granted") {
  //     const notification = new Notification(title, options);
  //   }
  // }

  // // Di dalam fungsi yang dipanggil saat event "addKey" dari WebSocket muncul
  // useEffect(() => {
  //   if (socket) {
  //     const handleAddKey = (sensorData: DataDht) => {
  //       // Tampilkan notifikasi saat ada data baru dari WebSocket
  //       showNotification("Data DataDht Baru", { body: `Temperatur: ${sensorData.temperature}°C` });
  //     };

  //     socket.on(addKey, handleAddKey);

  //     return () => {
  //       socket.off(addKey, handleAddKey);
  //     };
  //   }
  // }, [socket, addKey]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on(updateKey, (sensorData: DataDht) => {
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return oldData;
        }

        const newData = oldData.pages.map((page: any) => {
          return {
            ...page,
            sensorData: page.sensorData.map((item: DataDht) => {
              if (item.id_data_dht === sensorData.id_data_dht) {
                return sensorData;
              }
              return item;
            }),
          };
        });

        return {
          ...oldData,
          pages: newData,
        };
      });
    });

    socket.on(addKey, (sensorData: DataDht) => {
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return {
            pages: [
              {
                sensorData: [sensorData],
              },
            ],
          };
        }

        const newData = [...oldData.pages];

        if (newData[0].sensorData && Array.isArray(newData[0].sensorData)) {
          newData[0] = {
            ...newData[0],
            sensorData: [sensorData, ...newData[0].sensorData],
          };
        } else {
          newData[0].sensorData = [sensorData];
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
