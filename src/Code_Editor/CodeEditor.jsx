import React, { useEffect, useRef, useState } from "react";
import { EditorState } from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
import { oneDark } from "@codemirror/theme-one-dark";

const fileExtensions = {
  "script.js": javascript(),
  "app.py": python(),
  "main.cpp": cpp(),
  "Program.java": java(),
};

const CodeEditor = () => {
  const editorRef = useRef(null);
  const [editorValue, setEditorValue] = useState("// Start coding...");
  const [selectedFile, setSelectedFile] = useState("script.js");

  useEffect(() => {
    if (!editorRef.current) return;

    const state = EditorState.create({
      doc: editorValue,
      extensions: [
        history(),
        keymap.of([...defaultKeymap, ...historyKeymap]),
        fileExtensions[selectedFile] || javascript(),
        oneDark,
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            const newCode = update.state.doc.toString();
            setEditorValue(newCode);
          }
        }),
      ],
    });

    const view = new EditorView({
      state,
      parent: editorRef.current,
    });

    return () => view.destroy();
  }, [selectedFile]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(editorValue);
    alert("✅ Code copied to clipboard!");
  };

  const handleDownloadCode = () => {
    const blob = new Blob([editorValue], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = selectedFile;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="vscode-container">
      {/* Sidebar (Like VS Code) */}
      <div className="sidebar">
        <h3>📂 Files</h3>
        <ul>
          {Object.keys(fileExtensions).map((file) => (
            <li
              key={file}
              className={selectedFile === file ? "active-file" : ""}
              onClick={() => setSelectedFile(file)}
            >
              {file}
            </li>
          ))}
        </ul>
      </div>

      {/* Main Editor Section */}
      <div className="editor-section">
        {/* Toolbar */}
        <div className="editor-toolbar">
          <button onClick={handleCopyCode}>📋 Copy</button>
          <button onClick={handleDownloadCode}>📥 Download</button>
        </div>

        {/* Code Editor */}
        <div ref={editorRef} className="editor-box" />
      </div>
    </div>
  );
};

export default CodeEditor;
