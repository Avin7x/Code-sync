import { Code2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useState } from "react";
import { useRoom } from "@/context/RoomContext";
import { useParams } from "react-router-dom";

function RoomEntry() {
  const { roomId } = useParams();

  const [name, setName] = useState("");
  const [manualRoomId, setManualRoomId] = useState(roomId || "");
  const { createRoom, joinRoom } = useRoom();

  const handleCreateRoom = async () => {
    if (!name?.trim()) return;

    await createRoom(name);
  };

  const handleJoinRoom = async () => {
     if (!name.trim() || !manualRoomId.trim()) return;
    await joinRoom(manualRoomId, name);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        {/* Logo */}

        <div className="mb-8 flex flex-col items-center">
          <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Code2 className="size-5" />
          </div>

          <h1 className="text-xl font-semibold tracking-tight">CodeSync</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Code together in real time.
          </p>
        </div>

        {/* Card */}

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          {/* Create room */}

          <div>
            <h2 className="text-sm font-semibold">Create a room</h2>

            <p className="mt-1 text-xs text-muted-foreground">
              Start a new collaborative coding session.
            </p>

            <div className="mt-4 flex gap-2">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleCreateRoom();
                  }
                }}
              />

              <Button onClick={handleCreateRoom} disabled={!name?.trim() ||  !!manualRoomId?.trim()}>
                Create
                <ArrowRight />
              </Button>
            </div>
          </div>

          {/* Divider */}

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />

            <span className="text-xs text-muted-foreground">OR</span>

            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Join room */}

          <div>
            <h2 className="text-sm font-semibold">Join a room</h2>

            <p className="mt-1 text-xs text-muted-foreground">
              Enter the room ID shared with you.
            </p>

            <div className="mt-4 flex gap-2">
              <Input
                value={manualRoomId}
                onChange={(e) => setManualRoomId(e.target.value)}
                placeholder="Room ID"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleJoinRoom();
                  }
                }}
              />

              <Button
                variant="secondary"
                onClick={handleJoinRoom}
                disabled={!manualRoomId?.trim() || !name?.trim()}
              >
                Join
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}

        <p className="mt-4 text-center text-xs text-muted-foreground">
          No setup required. Share the room link and start coding.
        </p>
      </div>
    </main>
  );
}

export default RoomEntry;
