"use client";
import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

function SimpleTiptap() {
  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Hello World</p>",
  });

  return (
    <div className="editor-container flex items-center justify-center">
      <EditorContent editor={editor} className="[&_mark]:hover:cursor-pointer outline outline-2 outline-gray-300 rounded-lg w-full min-h-12" />
    </div>
  );
}

export default SimpleTiptap;
