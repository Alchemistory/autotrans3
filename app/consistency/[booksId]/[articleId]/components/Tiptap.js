'use client'
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React from 'react'
import {Skeleton} from "@nextui-org/react";
import Highlight from '@tiptap/extension-highlight'
import {Button} from "@nextui-org/react";

function Tiptap() {
  const [isLoading, setIsLoading] = React.useState(true)
  
  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight.configure({
        multicolor: false,
      }),
    ],
    content: '<p>Hello World! 🌎️</p>',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
      },
    },
    onBeforeCreate: () => setIsLoading(true),
    onCreate: () => {
      setIsLoading(false)
      // World 단어 하이라이트 처리
      const content = editor.getHTML()
      const highlightedContent = content.replace(/World/g, '<mark>World</mark>')
      editor.commands.setContent(highlightedContent)
    },
    onUpdate: ({ editor }) => {
      // 에디터 내용이 변경될 때마다 World 단어 하이라이트
      const content = editor.getHTML()
      const highlightedContent = content.replace(/World/g, '<mark>World</mark>')
      if (content !== highlightedContent) {
        editor.commands.setContent(highlightedContent)
      }
    },
  })

  return (
    <div className="border border-gray-200 rounded-lg p-4 relative">
      {!isLoading && editor && (
        <div className="fixed transform translate-x-1/3 -translate-y-full bg-white shadow-lg rounded-lg p-2 gap-2 flex"> 
          <Button
            size='sm'
            className="text-sm px-2 py-1 rounded hover:bg-gray-100"
            onClick={() => editor.chain().focus().unsetHighlight().run()}
          >
            삭제
          </Button>
          <Button
            size='sm'
            className="text-sm px-2 py-1 rounded hover:bg-gray-100"
            onClick={() => {
              const selection = editor.state.selection
              const text = editor.state.doc.textBetween(selection.from, selection.to)
              const newText = prompt('텍스트 수정:', text)
              if (newText) {
                editor.chain().focus().insertContent(newText).run()
              }
            }}
          >
            수정
          </Button>
        </div>
      )}
      
      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-2 w-full rounded-lg"/>
          <Skeleton className="h-2 w-3/4 rounded-lg"/>
        </div>
      ) : (
        <EditorContent 
          editor={editor} 
          className="[&_mark]:hover:cursor-pointer" 
        />
      )}
    </div>
  )
}

export default Tiptap