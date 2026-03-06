/**
 * SparkLine — Tiny 7-point SVG trend line for market price cards
 */

import React from 'react';
import Svg, { Path, Defs, LinearGradient, Stop, Rect } from 'react-native-svg';

interface SparkLineProps {
    data: number[];
    width?: number;
    height?: number;
    color: string;
}

export default function SparkLine({ data, width = 64, height = 28, color }: SparkLineProps) {
    if (!data || data.length < 2) return null;

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const padX = 2;
    const padY = 3;
    const w = width - padX * 2;
    const h = height - padY * 2;

    const points = data.map((val, i) => {
        const x = padX + (i / (data.length - 1)) * w;
        const y = padY + (1 - (val - min) / range) * h;
        return [x, y] as [number, number];
    });

    const pathD = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');

    const areaD =
        pathD +
        ` L${points[points.length - 1][0].toFixed(1)},${(padY + h).toFixed(1)} L${padX},${(padY + h).toFixed(1)} Z`;

    const gradId = `sg_${color.replace('#', '')}`;

    return (
        <Svg width={width} height={height}>
            <Defs>
                <LinearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0" stopColor={color} stopOpacity="0.3" />
                    <Stop offset="1" stopColor={color} stopOpacity="0" />
                </LinearGradient>
            </Defs>
            <Path d={areaD} fill={`url(#${gradId})`} />
            <Path d={pathD} stroke={color} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    );
}
