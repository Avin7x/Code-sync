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
import { useNavigate, useParams } from "react-router-dom"
import { api } from "@/api/roomApi"
import { useCollaboration } from "@/lib/useCollaboration"

function CodePlayground() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState("JavaScript");
  const [room, setRoom] = useState("");
  const { roomId } = useParams();
 
  useEffect(()=>{
  //  Get room details from server
   const getRoomDetails = async () => {
  
      try {
        const { data } = await api.get(
          `/rooms/${roomId}`
        );
        setRoom(data.room);
        
      } catch (error) {
        console.error(
          "[Room] Join failed:",
          error.response?.data?.error || error.message
        );
        navigate('/');
      }
    };
    getRoomDetails();
  }, [roomId, navigate]);

  const {ydoc, ytext} = useCollaboration(roomId);
  
  return (
    <div className="flex h-screen flex-col bg-background">
      <TopNav
        roomName={room.name}
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
            roomName={room.nave}
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