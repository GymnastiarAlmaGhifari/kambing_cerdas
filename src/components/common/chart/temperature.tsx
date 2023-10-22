"use client"
import React, { Fragment, useEffect, useState } from "react";
import { useChartQuery } from "@/hooks/use-chart-query";
import { useChartSocket } from "@/hooks/use-chart-socket";
import AreaChartContainer from "./AreaChartContainer";

interface SensorData {
    temperature: number;
    createdAt: string;
}


interface TemperatureProps {
    apiUrl: string;
    // socketUrl: string;
    // socketQuery: Record<string, string>;
    // paramKey: "sensorId" | "conversationId";
    // paramValue: string;
}

export const Temperature = ({
    apiUrl,
}: TemperatureProps) => {
    const queryKey = `sensor`;
    const addKey = `sensors`;

    const {
        data,
        status,
    } = useChartQuery({
        queryKey,
        apiUrl,
    });
    useChartSocket({ queryKey, addKey });

    const formattedData: { x: string; y: number }[] = data?.pages[0].sensorData.map((item: SensorData) => ({
        x: item.createdAt,
        y: item.temperature,
    }));
    const reversedData = formattedData.reverse();


    return (
        <div>
            <h1>Data Sensor</h1>
            {status === "loading" ? (
                <p>Loading...</p>
            ) : status === "error" ? (
                <p>Error loading data</p>
            ) : (
                <div>
                    {/* {data?.pages.map((page, pageIndex) => (
                        <Fragment key={pageIndex}>
                            {page.sensorData.map((item: any) => (
                                <div key={item.id}>
                                    <p>Temperature: {item.temperature}</p>
                                    <p>createdAt: {item.createdAt}</p>
                                </div>

                            ))}
                        </Fragment>
                    ))} */}
                    {/* buatkan AreaChartContainer dengan data item.Temperature dan item.createAt */}


                    <AreaChartContainer data={reversedData} size={{ height: 300, width: 400 }} />


                </div>
            )}

        </div>
    );
}
export default Temperature;
