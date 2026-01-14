"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";

interface PriceSliderProps {
    defaultValue: [number, number];
    onCommit: (value: [number, number]) => void;
}

export function PriceSlider({ defaultValue, onCommit }: PriceSliderProps) {
    const [localValue, setLocalValue] = useState(defaultValue);

    return (
        <>
            <Slider
                defaultValue={defaultValue}
                max={200}
                step={5}
                onValueChange={(val) => setLocalValue(val as [number, number])}
                onValueCommit={(val) => onCommit(val as [number, number])}
            />
            <div className="flex justify-between text-sm text-gray-500">
                <span>£{localValue[0]}</span>
                <span>£{localValue[1]}</span>
            </div>
        </>
    );
}
