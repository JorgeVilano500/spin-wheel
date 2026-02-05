"use client"
import React, {useState, useMemo, useEffect} from 'react'
import {CylinderWheelPicker, Wheel} from './index'
import { fireConfetti } from '../lib/Confetti'
import Preloaded from '../lib/Preloaded'
import { WheelPreset, savePresets, LoadPresets, uid } from '../lib/Wheels'

export default function WheelForm () {
    const [presets, setPresets] = useState<WheelPreset[]>([])
    const [activeId, setActiveId] = useState<string | null>(null);

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
        <div className='p-6 flex flex-col gap-4 items-center'>
            <h1 className='text-6xl font-bold'>
                Spin the Wheel
            </h1>
            <h2 className='text-2xl font-semibold'>
                Decide Your Fate
            </h2>
            {winner && <div className='text-lg text-red-600'>Winner: <b>{winner}</b></div>}

        <section className='flex flex-row gap-4'>

            <div className=''>
                <div className='pt-4'>  
                    <CylinderWheelPicker
                        onSelect={selectPreset}
                        presets={presets}
                        activeId={activeId}
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
                    className='mx-4'
                    onSpinEnd={
                        ({winnerValue}) => {
                            setWinner(winnerValue)
                            setSpinning(false);
                            fireConfetti();
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


                    <section className='text-center flex flex-col justify-between gap-4 w-48'>
                        <select onChange={(e) => {
                            console.log(e.target.value)
                            setRaw(e.target.value)
                            }} className='bg-zinc-300 '>
                                <option value={["A", "B", "C"].join("\n")}>Choose your options</option>
                            {Preloaded.map((item, i) => (
                                <option  value={item.options.join("\n")}>{item.name}</option>
                            ))}
                        </select>

                      
                        <textarea
                                value={raw}
                                placeholder='One Per entry'
                                className='w-full h-[50%] my-auto bg-zinc-400 max-w-md min-h-[140px] border rounded-xl p-3'
                                onChange={(e) => setRaw(e.target.value)}
                                />
                                <button 
                                    onClick={saveActionWheelItems}
                                    className='px-4 py-2 rounded-xl bg-black text-white cursor-pointer'
                                > 
                                    Save Wheel List
                                </button>
                      
                </section>

</section>
            

        </div>
    )
}