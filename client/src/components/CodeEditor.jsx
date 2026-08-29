"use client"

import Editor from "@monaco-editor/react"
import { useEffect, useRef } from "react";


function CodeEditor({
  value,
  language = "javascript",
  onChange,
}) {

  const typingTimer = useRef(null);

const handleEditorChange = (value) => {
  clearTimeout(typingTimer.current);

  typingTimer.current = setTimeout(() => {
    console.log("User stopped typing");

    // send/save the code here
  }, 500);
};

useEffect(() => {
  return () => {
    clearTimeout(typingTimer.current);
  };
}, []);
    
  return (
    <div className="h-full w-full">
      <Editor
        height="100%"
        width="100%"
        theme="vs-dark"
        language={language}
        value={value}
        onChange={(value)=>handleEditorChange(value)}
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