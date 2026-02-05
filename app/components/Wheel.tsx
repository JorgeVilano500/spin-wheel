"use client"

import React, {useMemo} from "react";

type WheelProps = {
    items: string[], 
    size?: number, 
    rotationDeg?: number, 
    spinning?: boolean, 
    durationMs?: number, 
    className?: string, 
    onSpinEnd?: (result: {
        winnerIndex: number;
        winnerValue: string;
        normalizedRotationDeg: number;
      }) => void;

      getSliceFill?: (index: number) => string; 


      formatLabel?: (label: string, index: number) => string
      spin?: () => void;
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
    const a = ((angleDeg - 90) * Math.PI) / 180;
    return {x: cx + r * Math.cos(a), y: cy + r * Math.sin(a)}

}

function normalizeDeg (deg: number) {
    return ((deg % 360) + 360) % 360
}

function winnerIndexFromRotation(itemsLen: number, rotationDeg: number) {
    if(itemsLen <=0) return -1;
    const normalized = normalizeDeg(rotationDeg);
    const pointerAngle = (360 - normalized) % 360
    const slice = 360 / itemsLen;
    const idx = Math.floor(pointerAngle / slice) % itemsLen
    return idx;
    
}

function wedgePath (
    cx: number, 
    cy: number, 
    r: number, 
    startAngle: number, 
    endAngle: number

) {
    const start = polarToCartesian(cx, cy, r, startAngle)
    const end = polarToCartesian(cx, cy, r, endAngle)
    const largeArc = endAngle - startAngle < 180 ? "0" : "1";
    return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y} Z`
} 

export default function Wheel({
    items, 
    size = 320, 
    rotationDeg = 0, 
    spinning = false, 
    durationMs = 4000, 
    className, 
    onSpinEnd, 
    getSliceFill, 
    formatLabel, 
    spin
}: WheelProps) {

    const cleanItems = useMemo(
        () => items.map((s) => s.trim()).filter(Boolean),
        [items]
    )

    const cx = size / 2; 
    const cy = size / 2; 
    const r = size / 2;

    const slice = cleanItems.length > 0 ? 360 / cleanItems.length : 360

    const defaultFill = (i: number) => (i % 2  === 0 ? "#111827" : "#374151")
    const getSliceColor = (i: number, total: number) => {
        const hue = Math.round((i / total) * 360)
        return `hsl(${hue}, 55%, 35%)`
    }
    const fillFor = (i: number) => getSliceColor(i, cleanItems.length)

    const labelFor = formatLabel ?? ((label: string) => label)

    const handleTransitionEnd = () => {
        if(!onSpinEnd) return; 
        if(cleanItems.length === 0) return;

        const idx = winnerIndexFromRotation(cleanItems.length, rotationDeg)
        if (idx < 0) return;


        onSpinEnd({
            winnerIndex: idx, 
            winnerValue: cleanItems[idx],
            normalizedRotationDeg: normalizeDeg(rotationDeg)
        })

    }
    
    return (
        <div className={className}>
            <div className="relative inline-block">
                {/* Pointer top */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <div className="w-0 h-0 border-l-[10px] border-l-transparent border-l-[10px] border-r-transparent border-t-[18px] border-r-[10px] border-b-black" />
                </div>

                {/* Wheel  */}

                <div 
                    onClick={spin}
                    onTransitionEnd={handleTransitionEnd} 
                    className="cursor-pointer rounded-full shadow-lg overflow-hidden"
                    style={{
                        width: size, 
                        height: size, 
                        transform: `rotate(${rotationDeg}deg)`,
                        transition: spinning ? `transform ${durationMs}ms cubic-bezier(0.15, 0.85, 0.1, 1)` : "none"
                    }}
                >
                    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                        {cleanItems.length === 1 ? (
                            <circle cx={cx} cy={cy} r={r} fill={fillFor(0)} />
                        ) : (
                            cleanItems.map((label, i) => {
                                const start = i * slice
                                const end = (i + 1) * slice

                                const mid = start + slice / 2;
                                const textPos = polarToCartesian(cx, cy, r * 0.62, mid)


                // Rotate label so it reads along the wedge direction
                // (You can remove transform if you want all horizontal text)
                                const shownLabel = labelFor(label, i)


                                return (
                                    <g key={`${label}-${i}`}>
                                        <path
                                            d={wedgePath(cx, cy, r, start, end)}
                                            fill={fillFor(i)}
                                        />
                                        <text
                                            x={textPos.x}
                                            y={textPos.y}
                                            fill="black"
                                            fontSize={14}
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                            transform={`rotate(${mid} ${textPos.x} ${textPos.y})`}
                                        >
                                            {shownLabel}
                                        </text>
                                    </g>
                                )
                            })
                        )}
                    </svg>
                </div>

            </div>

        </div>
    )

}