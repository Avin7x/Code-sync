import { useState } from "react";
import { Code2, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useNavigate } from "react-router-dom";
import { api } from "@/api/roomApi";

function RoomEntry() {
  const navigate = useNavigate();

  const [roomName, setRoomName] = useState("");
  const [roomId, setRoomId] = useState("");

  const handleCreateRoom = async () => {
    if (!roomName.trim()) return;

    try {
      const { data } = await api.post("/rooms/create", {
        roomName
      });

      navigate(`/room/${data.room._id}`);
    } catch (error) {
      console.error(
        "[Room] Create failed:",
        error.response?.data?.error || error.message
      );
    }
  };

  const handleJoinRoom = async () => {
    navigate(`/room/${data.room._id}`);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Code2 className="size-5" />
          </div>

          <h1 className="text-xl font-semibold tracking-tight">
            CodeSync
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Code together in real time.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">

          {/* Create room */}
          <div>
            <h2 className="text-sm font-semibold">
              Create a room
            </h2>

            <p className="mt-1 text-xs text-muted-foreground">
              Start a new collaborative coding session.
            </p>

            <div className="mt-4 flex gap-2">
              <Input
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="Room name"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleCreateRoom();
                  }
                }}
              />

              <Button
                onClick={handleCreateRoom}
                disabled={!roomName.trim()}
              >
                Create
                <ArrowRight />
              </Button>
            </div>
          </div>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />

            <span className="text-xs text-muted-foreground">
              OR
            </span>

            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Join room */}
          <div>
            <h2 className="text-sm font-semibold">
              Join a room
            </h2>

            <p className="mt-1 text-xs text-muted-foreground">
              Enter the room ID shared with you.
            </p>

            <div className="mt-4 flex gap-2">
              <Input
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
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
                disabled={!roomId.trim()}
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