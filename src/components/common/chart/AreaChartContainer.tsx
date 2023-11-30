// components/AreaChartContainer.tsx

import React from 'react';
import { DefaultAreaChart } from './Chart';
import { YAxis, Tooltip, ResponsiveContainer } from 'recharts';

type DataPoint = {
    x: string; // Sesuaikan dengan tipe data yang sesuai dengan data Anda
    y: number; // Sesuaikan dengan tipe data yang sesuai dengan data Anda
};

type AreaChartContainerProps = {
    data: DataPoint[];
    size: { height: number; width: number };
    warna: string;
    // tipe?: {
    //     humidity?: string;
    //     temperature?: string;
    // }
    // tipe bolean temperature humidity
    tipe: "humidity" | "temperature";
    text: string
};

const AreaChartContainer: React.FC<AreaChartContainerProps> = ({ data, size, warna, tipe, text }) => {
    // Definisikan fungsi untuk merender tooltip jika diperlukan
    const renderTooltip = (val: any) => {
        if (tipe === "temperature") {
            return `${val.payload?.[0]?.value?.toFixed(1)} °C`;
        } else if (tipe === "humidity") {
            return `${val.payload?.[0]?.value?.toFixed(1)} %`;
        }
        return null; // Handle other cases or provide a default
    };

    return (
        <ResponsiveContainer width={size.width} height={size.height} >
            <DefaultAreaChart
                text={text}
                data={data}
                height={size.height}
                width={size.width}
                color={warna}
                // tooltip={renderTooltip}
                renderTooltip={renderTooltip}
            >
                {/* Tambahkan komponen YAxis dan Tooltip di dalam DefaultAreaChart */}
                <YAxis hide={true} type="number" domain={[-5, 105]} />
                <Tooltip
                    content={(x) => (
                        <p className="text-red-600 inline-block">
                            {(x.payload?.[0]?.value as number)?.toFixed(1)} %
                        </p>
                    )}
                />
            </DefaultAreaChart>
        </ResponsiveContainer >
    );
};

export default AreaChartContainer;
