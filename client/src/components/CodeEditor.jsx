"use client"

import Editor from "@monaco-editor/react"


function CodeEditor({
  value,
  language = "javascript",
  onChange,
}) {

    
  return (
    <div className="h-full w-full">
      <Editor
        height="100%"
        width="100%"
        theme="vs-dark"
        language={language}
        value={value}
        onChange={(value) => onChange(value ?? "")}
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