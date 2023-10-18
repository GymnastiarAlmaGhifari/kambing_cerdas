import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Sensor } from "@prisma/client"; // Import model Sensor dari Prisma

import { useSocket } from "@/components/providers/socket-provider";

type SensorSocketProps = {
  addKey: string;
  updateKey?: string;
  queryKey: string;
};

export const useChartSocket = ({ addKey, updateKey, queryKey }: SensorSocketProps) => {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on(updateKey, (sensorData: Sensor) => {
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return oldData;
        }

        const newData = oldData.pages.map((page: any) => {
          return {
            ...page,
            items: page.items.map((item: Sensor) => {
              if (item.id === sensorData.id) {
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

    socket.on(addKey, (sensorData: Sensor) => {
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return {
            pages: [
              {
                items: [sensorData],
              },
            ],
          };
        }

        const newData = [...oldData.pages];

        newData[0] = {
          ...newData[0],
          items: [sensorData, ...newData[0].items],
        };

        return {
          ...oldData,
          pages: newData,
        };
      });
    });

    return () => {
      socket.off(addKey);
      socket.off(updateKey);
    };
  }, [queryClient, addKey, queryKey, socket, updateKey]);
};
