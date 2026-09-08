import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

import { TopNav } from "../components/TopNav"
import {  useState } from "react"
import CodeEditor from "@/components/CodeEditor"
import { UserAvatar } from "@/components/UserAvatar"
import Terminal from "@/components/Terminal"
import {  useParams } from "react-router-dom"
import { useRoom } from "@/context/RoomContext"
import { useCollaboration } from "@/lib/useCollaboration"

function CodePlayground() {
  const [language, setLanguage] = useState("JavaScript");
  const { room, user, runCode } = useRoom();
  const { roomId } = useParams();
  
  
  const { ytext, collaborators } = useCollaboration(roomId, user);
  
  return (
    <div className="flex h-screen flex-col bg-background">
      <TopNav
        roomName={room?.owner}
        language={language}
        onLanguageChange={setLanguage}
        saveState="saved"
        onRun={() => runCode({code: ytext.toString(), language})}
        collaborators={collaborators}
      />

      <div className="min-h-0 flex-1">
        <ResizablePanelGroup
          orientation="horizontal"
          className="h-full"
        >
          {/* Users List */}
          <ResizablePanel
            defaultSize="15%"
            minSize="15%"
            maxSize="25%"
            className="bg-[#171717] border-r"
          >
            <UserAvatar 
            roomName={user.name}
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
                  <CodeEditor ytext={ytext}/>
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