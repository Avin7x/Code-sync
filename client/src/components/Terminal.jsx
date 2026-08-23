"use client"

import { Terminal as XTerminal } from "@xterm/xterm"
import { FitAddon } from "@xterm/addon-fit"
import "@xterm/xterm/css/xterm.css"
import { useEffect, useRef } from "react"

function Terminal() {
  const terminalRef = useRef(null)

  useEffect(() => {
    const term = new XTerminal({
      cursorBlink: true,
      cursorStyle: "block",
      fontFamily: "Ubuntu Mono, Consolas, monospace",
      fontSize: 14,
      lineHeight: 1.2,

      theme: {
        background: "#171717",
        foreground: "#d4d4d4",

        cursor: "#a3a3a3",
        cursorAccent: "#171717",

        black: "#171717",
        red: "#f87171",
        green: "#4ade80",
        yellow: "#facc15",
        blue: "#60a5fa",
        magenta: "#c084fc",
        cyan: "#67e8f9",
        white: "#d4d4d4",

        brightBlack: "#737373",
        brightRed: "#fca5a5",
        brightGreen: "#86efac",
        brightYellow: "#fde047",
        brightBlue: "#93c5fd",
        brightMagenta: "#d8b4fe",
        brightCyan: "#a5f3fc",
        brightWhite: "#fafafa",
      },

      scrollback: 5000,
      convertEol: true,
    });

    const fitAddon = new FitAddon()

    term.loadAddon(fitAddon)
    term.open(terminalRef.current)

    fitAddon.fit()
    term.focus()

    term.write(
      "\x1b[32muser@code-playground\x1b[0m:\x1b[34m~/project\x1b[0m$ ",
    );

    const dataDisposable = term.onData((data) => {
      console.log("Terminal input:", data)

      // Enter
      if (data === "\r") {
        term.write("\r\n")
        term.write("$ ")
        return
      }

      // Backspace
      if (data === "\u007f") {
        term.write("\b \b")
        return
      }

      // Normal characters
      term.write(data)
    })

    const resizeObserver = new ResizeObserver(() => {
      fitAddon.fit()
    })

    resizeObserver.observe(terminalRef.current)

    return () => {
      resizeObserver.disconnect()
      dataDisposable.dispose()
      term.dispose()
    }
  }, [])

  return (
    <div className="h-full w-full bg-[#171717] p-2">
      <div
        ref={terminalRef}
        className="xterm-container h-full w-full"
      />
    </div>
  )
}

export default Terminal