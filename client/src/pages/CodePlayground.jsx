import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { TopNav } from "../components/TopNav";
import { useEffect, useState } from "react";
import CodeEditor from "@/components/CodeEditor";
import { UserAvatar } from "@/components/UserAvatar";
import { useParams } from "react-router-dom";
import { useRoom } from "@/context/RoomContext";
import { useCollaboration } from "@/lib/useCollaboration";

function CodePlayground() {
  const [language, setLanguage] = useState("cpp");
  const [activeTab, setActiveTab] = useState("output");
  const [input, setInput] = useState("");

  const { room, user, runCode } = useRoom();
  const { roomId } = useParams();

  const { ydoc, ytext, awareness, collaborators, executionResult } =
    useCollaboration(roomId, user);

    useEffect(() => {
      if(!ydoc) return;
      const settings = ydoc.getMap("settings");

      const sync = () => {
        const lang = settings.get("language");
        if(lang) setLanguage(lang);
      }

      sync();
      settings.observe(sync);

      return () => settings.unobserve(sync);
    }, 
    [ydoc]);

    const handleLanguageChange = (lang) => {
      setLanguage(lang);
      ydoc.getMap("settings").set("language", lang);
    }

  return (
    <div className="flex h-screen flex-col bg-background">
      <TopNav
        roomName={room?.owner}
        language={language}
        onLanguageChange={handleLanguageChange}
        saveState="saved"
        onRun={() =>
          runCode({
            code: ytext.toString(),
            language,
            input,
          })
        }
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
            className="border-r bg-[#171717]"
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
                <CodeEditor ytext={ytext} awareness={awareness} user={user} language={language}/>
              </ResizablePanel>

              <ResizableHandle withHandle />

              {/* Input / Output */}
              <ResizablePanel
                defaultSize="20%"
                minSize="15%"
                className="bg-[#171717] text-[#eeeeee]"
              >
                <div className="flex h-full flex-col">

                  {/* Tabs */}
                  <div className="flex h-10 shrink-0 items-center border-b border-[#2a2a2a]">
                    <button
                      onClick={() => setActiveTab("input")}
                      className={`h-full px-4 text-xs font-medium ${
                        activeTab === "input"
                          ? "border-b-2 border-white text-white"
                          : "text-[#777777] hover:text-[#aaaaaa]"
                      }`}
                    >
                      Input
                    </button>

                    <button
                      onClick={() => setActiveTab("output")}
                      className={`h-full px-4 text-xs font-medium ${
                        activeTab === "output"
                          ? "border-b-2 border-white text-white"
                          : "text-[#777777] hover:text-[#aaaaaa]"
                      }`}
                    >
                      Output
                    </button>
                  </div>

                  {/* Tab Content */}
                  <div className="min-h-0 flex-1 overflow-auto p-3">

                    {/* Input */}
                    {activeTab === "input" && (
                      <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Enter input for your program..."
                        className="h-full min-h-20 w-full resize-none rounded-md border border-[#303030] bg-[#212121] p-3 font-mono text-xs text-[#eeeeee] outline-none "
                      />
                    )}

                    {/* Output */}
                    {activeTab === "output" && (
                      <>
                        {!executionResult ? (
                          <span className="text-xs text-[#666666]">
                            Run your code to see the output.
                          </span>
                        ) : (
                          <div className="space-y-2">
                            {executionResult.output && (
                              <pre className="whitespace-pre-wrap font-mono text-xs text-[#eeeeee]">
                                {executionResult.output}
                              </pre>
                            )}

                            {executionResult.error && (
                              <pre className="whitespace-pre-wrap font-mono text-xs text-red-400">
                                {executionResult.error}
                              </pre>
                            )}

                            <div className="pt-2 text-xs text-[#666666]">
                              Exit code: {executionResult.exitCode}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      <div />
    </div>
  );
}

export default CodePlayground;