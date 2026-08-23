import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

import { TopNav } from "../components/TopNav"
import { collaborators } from "../lib/mock-data"
import {  useEffect, useState } from "react"
import CodeEditor from "@/components/CodeEditor"
import { UserAvatar } from "@/components/UserAvatar"
import Terminal from "@/components/Terminal"

function CodePlayground() {
  
  const [language, setLanguage] = useState("JavaScript");
  const [roomName, setRoomName] = useState("DSA Practice")
 
  useEffect(()=>{
  //  Get file from server
  }, []);
  return (
    <div className="flex h-screen flex-col bg-background">
      <TopNav
        roomName={roomName}
        language={language}
        onLanguageChange={setLanguage}
        saveState="saved"
        onRun={() => console.log("Run")}
        collaborators={collaborators}
      />

      <div className="min-h-0 flex-1">
        <ResizablePanelGroup
          orientation="horizontal"
          className="h-full"
        >
          {/*  */}
          <ResizablePanel
            defaultSize="15%"
            minSize="15%"
            maxSize="25%"
            className="bg-[#171717] border-r"
          >
            <UserAvatar 
            roomName={roomName}
            language={language}
            collaborators={collaborators}
            />
           
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Main Area */}
          <ResizablePanel defaultSize="85%" minSize="50%">
            <ResizablePanelGroup
              orientation="vertical"
              className="h-full"
            >
              {/* Code Editor */}
              <ResizablePanel defaultSize="60%">
                  <CodeEditor />
              </ResizablePanel>

              <ResizableHandle withHandle />

              {/* Terminal */}
              <ResizablePanel
                defaultSize="15%"
                minSize="15%"
                className="bg-[#171717]"
              >
                <Terminal/>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      <div />
    </div>
  )
}

export default CodePlayground