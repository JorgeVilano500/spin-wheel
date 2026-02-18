"use client"; 

import React from "react";
import {GameMode, Preloaded} from '../lib/Preloaded'


type SelectOptionsType = {

    setRaw: (name: string) => void; 
    raw: string 
    saveActionWheelItems: () => void
    setGameMode: (gamemode: string) => void;
    gameMode: string
}

function SelectOptions({setRaw, raw, saveActionWheelItems, setGameMode, gameMode}: SelectOptionsType) {


    return (

        <section className='text-center flex flex-col justify-between gap-4 w-48'>

        {/* Will create a section to decide how the wheel decides to spin  */}
        {/* So far, Battle royale (last one standing, will be automatically removing each item after spinning), One from each list, default (what it is right now), First pick is the winner  */}

        <select
            className='bg-zinc-300'
            onChange={(e) => setGameMode(e.target.value)}
        >
            
            {
                GameMode.map((item, i) => (
                    <option value={item.type} >{item.name}</option>
                ))
            }
        </select>

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
    )
}

export default SelectOptions; 
