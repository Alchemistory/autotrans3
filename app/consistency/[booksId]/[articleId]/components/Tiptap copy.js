'use client'
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React from 'react'
import {Skeleton} from "@nextui-org/react";
import Highlight from '@tiptap/extension-highlight'
import {Button} from "@nextui-org/react";
import {useState, useEffect} from "react";

function Tiptap({chunk, dictionary}) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [highlightedContents, setHighlightedContents] = useState([]);
  console.log('chunk:', chunk)
  console.log('dictionary:', dictionary)

  useEffect(() => {
    if (chunk && chunk.chunkId && chunk.chunkId.chunkText) {
      setIsLoading(false);
    }

    if (chunk && chunk.dictionaryList) {
      const newHighlightedContents = dictionary?.filter(dictItem => 
        chunk.dictionaryList.includes(dictItem.id)
      );

      setHighlightedContents(newHighlightedContents);
    }
  }, [chunk, dictionary]);
  console.log('highlightedContents:', highlightedContents)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight.configure({ multicolor: true }),
    ],
    content: chunk?.chunkId?.chunkText || '',
    onCreate: ({ editor }) => {
      highlightText(editor);
    },
    onUpdate: ({ editor }) => {
      highlightText(editor);
    },
  });

  const highlightText = (editor) => {
    const content = editor.getJSON();
    const transactions = [];

    const traverseAndHighlight = (node, startPos = 0) => {
      if (node.type === 'text') {
        const regex = /중재/g;
        let match;
        while ((match = regex.exec(node.text)) !== null) {
          transactions.push({
            from: startPos + match.index + 1,
            to: startPos + match.index + match[0].length + 1,
            attrs: { color: 'yellow' },
          });
        }
      }

      if (node.content) {
        let currentPos = startPos;
        node.content.forEach(childNode => {
          traverseAndHighlight(childNode, currentPos);
          currentPos += childNode.text?.length || 0;
        });
      }
    };

    content.content?.forEach(traverseAndHighlight);

    transactions.forEach(({ from, to, attrs }) => {
      editor.chain().focus().setTextSelection({ from, to }).setMark('highlight', attrs).run();
    });
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 relative flex-grow">
      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-2 w-full rounded-lg" />
          <Skeleton className="h-2 w-3/4 rounded-lg" />
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

export default Tiptap;
