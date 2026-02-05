"use server"
// import React, {useState} from 'react'
import {  WheelForm } from "./components";

export default async function Home() {


  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-400 font-sans dark:bg-zinc-800">
         <WheelForm  />
    </div>
  );
}
