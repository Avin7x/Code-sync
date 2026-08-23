import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

import { TopNav } from "../components/TopNav"
import { collaborators, fileContents } from "../lib/mock-data"
import {  useEffect, useState } from "react"
import CodeEditor from "@/components/CodeEditor"

function CodePlayground() {
  
  const [panelCollapsed, setPanelCollapsed] = useState(false);
  
  useEffect(()=>{
  //  Get file from server
  }, []);
  return (
    <div className="flex h-screen flex-col bg-background">
      <TopNav
        projectName="realtime-api"
        saveState={false}
        collaborators={collaborators}
        onRun={() => setPanelCollapsed(false)}
        onShare={() => setCollabOpen(true)}
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
                <div className="flex h-full items-center justify-center p-6">
                  <span className="font-semibold">
                    Terminal
                  </span>
                </div>
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