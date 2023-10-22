
import { FC } from 'react';
import {
    Area,
    AreaChart,
    Tooltip,
    TooltipProps,
} from 'recharts';

type DefaultAreaChartProps = {
    height: number;
    width: number;
    color: string;
    children: React.ReactNode;
    data: any[];
    renderTooltip?: (point: TooltipProps<number, string>) => React.ReactNode;
};

export const DefaultAreaChart: FC<DefaultAreaChartProps> = ({
    data,
    height,
    width,
    color,
    renderTooltip,
    children,
}) => {
    return (
        <AreaChart
            data={data}
            height={height}
            width={width}
            margin={{ left: 0, top: 0, right: 0, bottom: 0 }}
        >
            <defs>
                <linearGradient id={`gradient_${color}`} x1='0%' y1='0%' x2='0%' y2='100%'>
                    <stop offset='0%' stopColor={color} stopOpacity={0.6} />
                    <stop offset='80%' stopColor={color} stopOpacity={0} />
                </linearGradient>
            </defs>
            <Area
                type='monotone'
                dataKey='y'
                stroke={color}
                strokeWidth={3}
                fillOpacity={1}
                fill={`url(#${`gradient_${color}`})`}
                isAnimationActive={false}
            />
            {renderTooltip && (
                <Tooltip<number, string>
                    content={x => renderTooltip(x)}
                    wrapperStyle={{ outline: 'none' }}
                />
            )}
            {children}
        </AreaChart>
    );
};