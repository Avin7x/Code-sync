"use client"

import Editor from "@monaco-editor/react"
import { useEffect, useRef } from "react";
import { MonacoBinding } from "y-monaco";
import * as Y from "yjs";
import { io } from "socket.io-client"

function CodeEditor({
  ytext,
  language = "javascript",
  onChange,
}) {

  const ydocRef = useRef(null);
  const bindingRef = useRef(null);
  const typingTimer = useRef(null);

const handleEditorChange = (value) => {
  clearTimeout(typingTimer.current);

  typingTimer.current = setTimeout(() => {
    console.log("User stopped typing");

    // send/save the code here
  }, 500);
};

const handleEditorMount = (editor) => {
  
  // binding ytext/yjs to monaco
  const binding = new MonacoBinding(
    ytext,
    editor.getModel(),
    new Set([editor])
  )
  bindingRef.current = binding;
}
useEffect(() => {
  
  return () => {
    clearTimeout(typingTimer.current);
  };
}, []);

useEffect(() => {
  
  return () => {
    bindingRef.current?.destroy();
  }
}, []);
    
  return (
    <div className="h-full w-full">
      <Editor
        height="100%"
        width="100%"
        theme="vs-dark"
        language={language}
        onMount={handleEditorMount}
        options={{
          fontSize: 14,
          minimap: {
            enabled: false,
          },
          automaticLayout: true,
          scrollBeyondLastLine: false,
          padding: {
            top: 10,
          },
          lineNumbers: "on",
          roundedSelection: false,
          cursorStyle: "line",
          tabSize: 2,
          wordWrap: "off",
          folding: true,
          renderWhitespace: "selection",
          suggestOnTriggerCharacters: true,
          quickSuggestions: true,
        }}
      />
    </div>
  )
}

export default CodeEditor