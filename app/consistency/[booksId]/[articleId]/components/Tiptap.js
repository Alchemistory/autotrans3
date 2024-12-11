'use client'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React from 'react'
import {Skeleton} from "@nextui-org/react";

function Tiptap() {
  const [isLoading, setIsLoading] = React.useState(true)
  
  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content: '<p>Hello World! 🌎️</p>',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
      },
    },
    onBeforeCreate: () => setIsLoading(true),
    onCreate: () => setIsLoading(false),
  })

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-2 w-full rounded-lg"/>
          <Skeleton className="h-2 w-3/4 rounded-lg"/>
          
        </div>
      ) : (
        <EditorContent editor={editor} />
      )}
    </div>
  )
}

export default Tiptap