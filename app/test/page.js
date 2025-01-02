
'use client'
import {Input,Select, SelectItem} from "@nextui-org/react";
import Tiptap from "./components/Tiptap";
// import Froala from "./components/Froala";
import {useState} from 'react'
export default function App() {
  const [text, setText] = useState('')
  return (
    <div className="flex flex-col w-full flex-wrap md:flex-nowrap gap-4">
      {/* <Froala /> */}
      <Tiptap />
    </div>
  );
}