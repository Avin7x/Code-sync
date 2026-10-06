"use client"

import Editor from "@monaco-editor/react"
import { useEffect, useState } from "react"
import { MonacoBinding } from "y-monaco"

const HEX_COLOR = /^#[0-9a-fA-F]{6}$/
const COLORS = ["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899"]

function colorFromId(id) {
  const str = String(id)
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) | 0
  }
  return COLORS[Math.abs(hash) % COLORS.length]
}

function CodeEditor({ ytext, awareness, user, language }) {
  const [editor, setEditor] = useState(null)

  // Publish my name + color (only when a real user is provided)
  useEffect(() => {
    if (!awareness || !user) return
    awareness.setLocalStateField("user", {
      id: user.id,
      name: user.name,
      color: colorFromId(user.id ?? user.name),
    })
  }, [awareness, user?.id, user?.name])

  // Bind Yjs <-> Monaco
  useEffect(() => {
    if (!editor || !ytext) return
    const model = editor.getModel()
    if (!model) return
    const binding = new MonacoBinding(ytext, model, new Set([editor]), awareness);

    awareness.setLocalStateField("language", language)
    return () => binding.destroy()
  }, [editor, ytext, awareness])

//   useEffect(() => {
//   if (!editor || !language) return
//     console.log(editor.getModel()?.getLanguageId());
//   const model = editor.getModel()
//   if (!model) return

//   monaco.editor.setModelLanguage(model, language)
// }, [editor, language])

  // Per-user cursor styles
const SHOW_LABEL_MS = 2000

useEffect(() => {
  if (!awareness) return

  const style = document.createElement("style")
  document.head.appendChild(style)

  const lastMoved = new Map() // clientId -> { sel, time }
  let timer

  const updateStyles = () => {
    const now = Date.now()
    let anyVisible = false
    let css = ""

    awareness.getStates().forEach((state, clientId) => {
      if (clientId === awareness.clientID || !state.user) return

      // detect cursor movement by comparing the selection
      const sel = JSON.stringify(state.selection ?? null)
      const prev = lastMoved.get(clientId)
      if (!prev || prev.sel !== sel) {
        lastMoved.set(clientId, { sel, time: now })
      }

      const visible = now - lastMoved.get(clientId).time < SHOW_LABEL_MS
      if (visible) anyVisible = true

      const color = HEX_COLOR.test(state.user.color) ? state.user.color : "#888888"
      const name = String(state.user.name ?? "User")
        .replace(/[^\p{L}\p{N} _-]/gu, "")
        .slice(0, 24)

      css += `
        .yRemoteSelection-${clientId} { background-color: ${color}22; }
        .yRemoteSelectionHead-${clientId} { border-left-color: ${color}; }
        .yRemoteSelectionHead-${clientId}::after {
          content: "${name}";
          background-color: ${color};
          opacity: ${visible ? 0.9 : 0};
        }
      `
    })

    style.textContent = css

    // re-run once the label should fade out
    clearTimeout(timer)
    if (anyVisible) timer = setTimeout(updateStyles, SHOW_LABEL_MS + 50)
  }

  updateStyles()
  awareness.on("change", updateStyles)

  return () => {
    clearTimeout(timer)
    awareness.off("change", updateStyles)
    style.remove()
  }
}, [awareness])

  return (
    <div className="h-full w-full">
      <Editor
        height="100%"
        width="100%"
        theme="vs-dark"
        language={language}
        onMount={(editor) => setEditor(editor)}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          automaticLayout: true,
          scrollBeyondLastLine: false,
          padding: { top: 10 },
          wordWrap: "on",
          tabSize: 2,
        }}
      />
    </div>
  )
}

export default CodeEditor