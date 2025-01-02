'use client'
import React, { useState, useEffect } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight'
import {Input} from "@nextui-org/react";
const Tiptap = () => {
    const [selectedText, setSelectedText] = useState('');
    const [inputText1, setInputText1] = useState('');
    const [inputText2, setInputText2] = useState('');

    const highlightText = (text, highlight1, highlight2) => {
        if (!highlight1.trim() && !highlight2.trim()) {
            return text;
        }

        const indices = [];
        const addIndices = (highlight, type) => {
            if (!highlight) return;
            let startIndex = 0;
            while ((startIndex = text.toLowerCase().indexOf(highlight.toLowerCase(), startIndex)) !== -1) {
                indices.push({ start: startIndex, end: startIndex + highlight.length, type });
                startIndex += highlight.length;
            }
        };

        // First, highlight based on inputText1
        addIndices(highlight1, 'highlight1');

        indices.sort((a, b) => a.start - b.start);

        const parts = [];
        let lastIndex = 0;

        indices.forEach(({ start, end, type }, index) => {
            if (start > lastIndex) {
                parts.push(text.slice(lastIndex, start));
            }

            let style = '';
            if (type === 'highlight1') {
                style = 'background-color: yellow;';
            }

            parts.push(`<span style="${style}" key=${index}>${text.slice(start, end)}</span>`);
            lastIndex = end;
        });

        if (lastIndex < text.length) {
            parts.push(text.slice(lastIndex));
        }

        let highlightedText = parts.join('');

        // Now, apply the red text highlight based on inputText2
        if (highlight2.trim()) {
            highlightedText = highlightedText.replace(
                new RegExp(`(?<!<[^>]*)(${highlight2})(?![^<]*>)`, 'gi'),
                '<span style="color: red; font-weight: bold;">$1</span>'
            );
        }

        return highlightedText;
    };

    return (
        <div>
            <Input label='인풋1' value={inputText1} onChange={(e) => setInputText1(e.target.value)} />
            <Input label='인풋2' value={inputText2} onChange={(e) => setInputText2(e.target.value)} />

            <div
                className='chunks'
                dangerouslySetInnerHTML={{ __html: highlightText('This is a sample text', inputText1, inputText2) }}
            />
            <div className='flex flex-col gap-2'>
                  <strong>Selected Text1:</strong> {inputText1}
                  <strong>Selected Text2:</strong> {inputText2}
            </div>
        </div>
    )
};

export default Tiptap;
