import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

import { TopNav } from "../components/TopNav"
import { collaborators, fileContents } from "../lib/mock-data"
import { FileExplorer } from "@/components/FileExplorer"
import { act, useEffect, useState } from "react"
import CodeEditor from "@/components/CodeEditor"

function CodePlayground() {
  
  const [activeFile, setActiveFile] = useState(null);
  const [editorFile, setEditorFile] = useState(null);
  const [tabs, setTabs] = useState([])

  const [fileTree, setFileTree] = useState([
    {
      id: "d_src",
      name: "src",
      type: "folder",
      path: "src",
      parent: null,
      children: [
        {
          id: "f_components",
          name: "components",
          type: "folder",
          path: "src/components",
          parent: "src",
          children: null,
        },
        {
          id: "f_index",
          name: "index.js",
          type: "file",
          path: "src/index.js",
          parent: "d_src",
          language: "javascript",
        },
        {
          id: "f_server",
          name: "server.js",
          type: "file",
          path: "src/server.js",
          parent: "d_src",
          language: "javascript",
        },
        {
          id: "f_routes",
          name: "routes.js",
          type: "file",
          path: "src/routes.js",
          parent: "d_src",
          language: "javascript",
        },
        {
          id: "f_db",
          name: "db.js",
          type: "file",
          path: "src/db.js",
          parent: "d_src",
          language: "javascript",
        },
      ],
    },
    {
      id: "f_package",
      name: "package.json",
      type: "file",
      path: "package.json",
      parent: null,
      language: "json",
    },
    {
      id: "f_readme",
      name: "README.md",
      type: "file",
      path: "README.md",
      parent: null,
      language: "markdown",
    },
    {
      id: "f_env",
      name: ".env.example",
      type: "file",
      path: ".env.example",
      parent: null,
      language: "shell",
    },
  ]);

  const handleSelect = (node) => {
    setActiveFile(node);

    if (node.type === "file") {
      setEditorFile(node);

      setTabs((prev) => {
        // Already open
        if (prev.some((tab) => tab.fileId === node.id)) {
          return prev;
        }

        // Open new tab
        return [
          ...prev,
          {
            fileId: node.id,
            dirty: false,
          },
        ];
      });
    }
  };

  const [panelCollapsed, setPanelCollapsed] = useState(false);
  let value = "";
  if(editorFile && editorFile.type === 'file'){
    value = fileContents[editorFile.id] ?? "";
  }
  useEffect(()=>{
    // get the file tree array from server
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
          {/* File Explorer */}
          <ResizablePanel
            defaultSize="15%"
            minSize="15%"
            maxSize="25%"
            className="bg-[#171717] border-r"
          >
            <FileExplorer
              activeFile={activeFile}
              onSelect={handleSelect}
              fileTree={fileTree}
              setFileTree={setFileTree}
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
                {editorFile?.type === 'file' && (
                  <CodeEditor value={value}/>
                )}
                
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

      {/* Status-bar */}
      <div />
    </div>
  )
}

export default CodePlayground