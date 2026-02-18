"use client"
import React, {useState, useMemo, useEffect} from 'react'
import {CylinderWheelPicker, SelectOptions, Wheel} from './index'
import { fireConfetti } from '../lib/Confetti'
import {GameMode, Preloaded} from '../lib/Preloaded'

import { WheelPreset, savePresets, LoadPresets, uid } from '../lib/Wheels'

export default function WheelForm () {
    const [presets, setPresets] = useState<WheelPreset[]>([])
    const [activeId, setActiveId] = useState<string | null>(null);

    const [gameMode, setGameMode] = useState<string>('DF');

    const [raw, setRaw] = useState("")
    const items = useMemo(
        () => raw.split("\n").map((s) => s.trim()).filter(Boolean),
        [raw]
    )

    const activePreset = useMemo (
        () => presets.find((p) => p.id === activeId) ?? null,
        [presets, activeId]
    )

    useEffect(() => {
        const existing = LoadPresets();
        if (existing.length) {
            setActiveId(existing[0].id)
            setPresets(existing)
            setRaw(existing[0].items.join("\n"))
        } else {
            // if none are existing we make a new one 
            const initial: WheelPreset = {
                id: uid(), 
                name: "Default", 
                items: ["A", "B", "C", "D"], 
                updatedAt: Date.now()
            }
            setPresets([initial])
            setActiveId(initial.id)
            setRaw(initial.items.join("\n"))
            savePresets([initial])
        }
    }, [])

    const [spinning, setSpinning] = useState(false)
    const [rotation, setRotation] = useState(0)
    const [winner, setWinner] = useState<string | null>(null)

    const spin = () => {
        if(spinning || items.length === 0 ) return;

        setWinner(null);
        setSpinning(true);

        const extraTurns = 6 + Math.floor(Math.random() * 6)
        const randomDeg = Math.random() * 360;
        setRotation((prev) => prev + extraTurns * 360 + randomDeg)


    }
    

    const selectPreset = (id: string) =>{
        const p = presets.find((x) => x.id === id);
        if (!p) return; 
        setActiveId(p.id)
        setRaw(p.items.join("\n"))
    }
    
    const doubleClickDelete = (id: string) => {
        if (presets.length === 1) return
    
        setPresets((prev) => 
             prev.filter((x)=> x.id !=  id))
        setActiveId(presets[0].id)
        setRaw(presets[0].items.join("\n"))
        
    
        console.log(presets.filter((x) => x.id != id))


    }
    
    const addWheel = () => {
        const name = `Wheel ${presets.length + 1}`;
        const newPreset: WheelPreset = {
            id: uid(), 
            name, 
            items: ["Option 1", "Option 2"],
            updatedAt: Date.now()
        }
        setActiveId(newPreset.id);
        setRaw(newPreset.items.join("\n"))
        setPresets((prev) => [...prev, newPreset])
    }

    const saveActionWheelItems = () => {
        if(!activePreset) return;
        
        setPresets((prev) => 
            prev.map((p) => 
                p.id === activePreset.id ? 
                    {...p, items, updatedAt: Date.now()}  
                    : p
            )
        )
        
    }
    

    useEffect(() => {
        if(presets.length) savePresets(presets)
    }, [presets])

    return (
        <div className='p-6 mx-auto w-full max-w-screen flex flex-col gap-4 items-center w-full'>
            <h1 className='text-6xl font-bold'>
                Spin the Wheel
            </h1>
            <h2 className='text-2xl font-semibold'>
                Decide Your Fate
            </h2>

            {winner && <div className='text-lg text-red-600'>Winner: <b>{winner}</b></div>}

        <section className='flex flex-row gap-4 w-full lg:justify-evenly md:justify-around '>

            <div className=''>
                <div className='pt-4'>  

                    <CylinderWheelPicker
                        onSelect={selectPreset}
                        presets={presets}
                        activeId={activeId}
                        onDoubleClick={doubleClickDelete}
                    />
                    <button 
                        onClick={addWheel}
                        className='mt-4 w-14 h-10 rounded-xl bg-black text-white text-sm cursor-pointer'
                    >
                        + New
                    </button>

                </div>


            </div>

            <section className='flex flex-col justify-between h-full my-auto  gap-3 '>
                <Wheel
                    spin={spin}
                    items={items} 
                    size={320}
                    rotationDeg={rotation}
                    spinning={spinning}
                    durationMs={4000}
                    formatLabel={(label) => (label.length > 14 ? label.slice(0, 14) + "..." : label)}
                    className='mx-auto'
                    onSpinEnd={
                        ({winnerValue}) => {
                            
                            if(gameMode === "DF") {
                                setWinner(winnerValue)
                                setSpinning(false);
                                fireConfetti();
                            }
                            else if(gameMode === "BR") {
                                

                                setRaw(prev => {
                                        const items = prev.split("\n").map(s => s.trim()).filter(Boolean)
                                        const remaining = items.filter(item => item !== winnerValue)
                                        setSpinning(false);
                                        if(remaining.length === 1) {
                                            setWinner(winnerValue)
                                            fireConfetti();
                                        }
                                        return remaining.join("\n")
                                    }
                                    
                                )
                            }

                        }
                    }
                />
                <button 
                    onClick={spin}
                    className='px-4 py-2 mx-auto w-24 h-auto my-auto rounded-xl bg-black text-white disabled:opacity-40 disabled:cursor-wait cursor-pointer '
                    disabled={spinning || items.length === 0}
                >
                    {spinning ? "Spinning...": "Spin"}
                </button>  

            </section>

                    <SelectOptions
                        raw={raw}
                        setRaw={setRaw}
                        saveActionWheelItems={saveActionWheelItems}
                        setGameMode={setGameMode}
                        gameMode={gameMode}
                    />

                    

</section>
            
<div className='lg:hidden '>
                        <SelectOptions
                            raw={raw}
                            setRaw={setRaw}
                            saveActionWheelItems={saveActionWheelItems}
                            setGameMode={setGameMode}
                            gameMode={gameMode}
                        />

                    </div>

        </div>
    )
}