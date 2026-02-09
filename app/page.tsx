"use server"
// import React, {useState} from 'react'
import {  WheelForm } from "./components";

export default async function Home() {


  return (
    <div className="min-h-screen w-full overflow-x-hidden flex items-center justify-center bg-zinc-400 font-sans dark:bg-zinc-800">
         <WheelForm  />
    </div>
  );
}
