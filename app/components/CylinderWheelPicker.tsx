"use client"
import React from 'react'; 

import { WheelPreset } from '../lib/Wheels';

type Props = { 
    presets: WheelPreset[]; 
    activeId: string | null; 
    onSelect: (id: string) => void; 
}


export default function CylinderWheelPicker({presets, activeId, onSelect}:Props) {


    return (
        <div className='flex flex-col items-center gap-2'>
            <div className='text-xs text-gray-500'>Wheels</div>

            <div className='relative w-14 h-[420px]'>
                {/* Cylinder body */}
                <div className='absolute inset-0 rounded-full overflow-hidden border shadow-sm bg-gradient-to-r from-gray-200 via-white to-gray-200'>
                    {/* Wheel inner shadow  */}
                    <div className='absolute inset-0 pointer-events-none bg-gradient-to-r from-black/10 via-transparent to-black/10' />
                    <div className='absolute inset-0 pointer-events-none shadow-[inset_0_10px_20px_rgba(0,0,0,0.12),inset_0_-10px_20px_rgba(0,0,0,0.12)] ' />


                    {/* Scrollable buttons */}
                    <div className='h-full overflow-y-auto py-3 px-2 [scrollbar-width:none] [-ms-overflow-style:none]' >
                        <style jsx>
                            {`
                            div::-webkit-scrollbar{display: none;}
                            `}
                        </style>

                        <div className='flex flex-col gap-1'>
                            {
                                presets.map((p) => {
                                    const active = p.id === activeId;
                                    return (
                                        <button
                                            key={p.id}
                                            onClick={() => onSelect(p.id)}
                                            className={[
                                                "w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold",
                                                "transition-transform",
                                                active ? 
                                                "bg-black text-white scale-105 shadow-md": 
                                                "bg-white text-black scale-105 shadow-sm",    
                                            ].join("")
                                        }
                                        title={p.name}
                                        aria-label={`Select wheel ${p.name}`}
                                        >
                                            {p.name.slice(0, 2).toUpperCase()}
                                        </button>
                                    )
                                })
                            }

                        </div>

                    </div>
                </div>

                {/* Top and bottom caps  */}
                <div className='absolute -top-2 left-1/2 -translate-x-1/2 h-4 rounded-full bg-white/80 shadow' />
                <div className='absolute -bottom-2 left-1/2 -translate-x-1/2 h-4 rounded-full bg-white/80 shadow' />
            </div>
        </div>
    )


}