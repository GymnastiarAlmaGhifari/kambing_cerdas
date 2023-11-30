"use client"
import React, { Fragment, useEffect, useState } from "react";
import { useQuery } from "@/hooks/use-query";
import { useChartSocket } from "@/hooks/use-chart-socket";
import AreaChartContainer from "./AreaChartContainer";

interface SensorData {
    humidity: number;
    createdAt: string;
}


interface HumidityProps {
    apiUrl: string;

    // socketUrl: string;
    // socketQuery: Record<string, string>;
    queryKey: string; // Ensure that queryKey is defined as a string
    // paramValue: string;
}

export const Humidity = ({
    apiUrl,
    queryKey,
}: HumidityProps) => {
    // const queryKey = `sensor`;
    const addKey = `sensors`;

    const { data, status } = useQuery({
        queryKey,
        apiUrl,
    });
    useChartSocket({ queryKey, addKey });

    const formattedData: { x: string; y: number }[] = data?.pages[0].sensorData.map((item: SensorData) => ({
        x: item.createdAt,
        y: item.humidity,
    }));


    return (
        <div>
            {status === "loading" ? (
                <p>Loading...</p>
            ) : status === "error" ? (
                <p>Error loading data</p>
            ) : (
                <div>
                    <AreaChartContainer text={"Kelembaban"} tipe="humidity" warna={"#E11D48"} data={formattedData.reverse()} size={{ height: 300, width: 400 }} />
                </div>
            )}
        </div>
    );
}
export default Humidity;
