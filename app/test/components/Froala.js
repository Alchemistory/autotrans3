'use client'
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import 'froala-editor/js/froala_editor.pkgd.min.js';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import { Input } from "@nextui-org/react";

// Dynamically import FroalaEditor to prevent SSR issues
const FroalaEditor = dynamic(() => import('react-froala-wysiwyg'), { ssr: false });

const FroalaEditorComponent = () => {
    const [inputText, setInputText] = useState('');
    const [editorContent, setEditorContent] = useState('<p>Hello World!</p>');

    const handleModelChange = (model) => {
        setEditorContent(model);
    };

    const highlightMatchingText = (editor) => {
        const content = editor.html.get();
        const highlightedContent = content.replace(
            new RegExp(`(${inputText})`, 'gi'),
            '<span style="background-color: yellow;">$1</span>'
        );
        editor.html.set(highlightedContent);
    };

    const handleInputChange = (e) => {
        setInputText(e.target.value);
        if (editorInstance) {
            highlightMatchingText(editorInstance);
        }
    };

    let editorInstance;

    return (
        <div>
            <Input 
                value={inputText} 
                onChange={handleInputChange} 
                aria-label="Text input"
            />
            <FroalaEditor
                tag='textarea'
                model={editorContent}
                onModelChange={handleModelChange}
                config={{
                    placeholderText: 'Edit Your Content Here!',
                    charCounterCount: false,
                    toolbarButtons: [],
                    toolbarVisibleWithoutSelection: false,
                    attribution: false,
                    events: {
                        'initialized': function () {
                            editorInstance = this;
                        },
                        'contentChanged': function () {
                            highlightMatchingText(this);
                        }
                    }
                }}
            />
            <div>
                <strong>Selected Text:</strong> {inputText}
            </div>
        </div>
    );
};

export default FroalaEditorComponent;