'use client'
import React, { useState, useEffect } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

const Tiptap = () => {
    const [selectedText, setSelectedText] = useState('');

    const editor = useEditor({
        extensions: [
            StarterKit,
        ],
        content: '<p>Hello World!</p>',
    });

    useEffect(() => {
        const handleSelectionChange = () => {
            const selection = window.getSelection();
            setSelectedText(selection.toString());
        };

        document.addEventListener('selectionchange', handleSelectionChange);

        return () => {
            document.removeEventListener('selectionchange', handleSelectionChange);
        };
    }, []);

    return (
        <div>
            <EditorContent editor={editor} />
            <div>
                <strong>Selected Text:</strong> {selectedText}
            </div>
        </div>
    );
};

export default Tiptap;
