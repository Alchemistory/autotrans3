import React from 'react'
import { useState } from 'react'
import { Textarea } from '@nextui-org/react'

function Textareas({ chunk, dictionary }) {
  const [text, setText] = useState(chunk?.chunkId?.chunkText || '');

  const isModerated = chunk?.chunkId?.isModerated;

  return (
    <div className='w-full'>
      <Textarea
        placeholder="Enter your text"
        className={`w-full ${isModerated ? 'bg-gray-200' : ''}`}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
    </div>
  )
}

export default Textareas