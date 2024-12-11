"use client";
import "./styles.scss";

import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import { EditorContent, useEditor } from "@tiptap/react";
import { Textarea } from "@nextui-org/react";
import StarterKit from "@tiptap/starter-kit";
import HardBreak from "@tiptap/extension-hard-break";
import React, { useEffect } from "react";
import {
  BsTypeH1,
  BsTypeH2,
  BsTypeH3,
  BsParagraph,
  BsTypeBold,
  BsTypeItalic,
  BsTypeStrikethrough,
  BsHighlighter,
  BsTextLeft,
  BsTextCenter,
  BsTextRight,
  BsJustify,
} from "react-icons/bs";

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="control-group">
      <div className="button-group">
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={
            editor.isActive("heading", { level: 1 }) ? "is-active" : ""
          }
        >
          <BsTypeH1 />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={
            editor.isActive("heading", { level: 2 }) ? "is-active" : ""
          }
        >
          <BsTypeH2 />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={
            editor.isActive("heading", { level: 3 }) ? "is-active" : ""
          }
        >
          <BsTypeH3 />
        </button>
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={editor.isActive("paragraph") ? "is-active" : ""}
        >
          <BsParagraph />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "is-active" : ""}
        >
          <BsTypeBold />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "is-active" : ""}
        >
          <BsTypeItalic />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive("strike") ? "is-active" : ""}
        >
          <BsTypeStrikethrough />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={editor.isActive("highlight") ? "is-active" : ""}
        >
          <BsHighlighter />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={editor.isActive({ textAlign: "left" }) ? "is-active" : ""}
        >
          <BsTextLeft />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={
            editor.isActive({ textAlign: "center" }) ? "is-active" : ""
          }
        >
          <BsTextCenter />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={editor.isActive({ textAlign: "right" }) ? "is-active" : ""}
        >
          <BsTextRight />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          className={
            editor.isActive({ textAlign: "justify" }) ? "is-active" : ""
          }
        >
          <BsJustify />
        </button>
      </div>
    </div>
  );
};

const Tiptap = ({ item, data, setData, value }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        hardBreak: false,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight,
      HardBreak.configure({
        HTMLAttributes: {
          class: 'hard-break',
        },
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const updatedData = data.map((d) =>
        d.sequence === item.sequence ? { ...d, text: editor.getText() } : d
      );
      setData(updatedData);
    },
  });

  useEffect(() => {
    if (editor) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  return (
    <>
      {/* <MenuBar editor={editor} /> */}
      <EditorContent
        editor={editor}
        className="w-full bg-default-100 hover:bg-default-100 px-3 py-2 rounded-medium min-h-[60px] my-2 "
      />
    </>
  );
};

export default Tiptap;
