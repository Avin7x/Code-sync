import { Link, Users, Copy, Check } from "lucide-react";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";

export function UserAvatar({
  roomName,
  language,
  collaborators = [],
}) {
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Replace this later with the actual room ID from your backend
  const {roomId} = useParams();

  const roomLink = `${window.location.origin}/room/${roomId}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(roomLink);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy room link:", error);
    }
  };

  return (
    <>
      <aside className="flex h-full shrink-0 flex-col bg-sidebar">

        {/* Room */}
        <div className="p-3">
          <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <span>Room</span>
          </div>

          <div className="rounded-md bg-muted/50 px-3 py-2">
            <p className="truncate text-sm font-medium">
              {roomName}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              {language}
            </p>
          </div>
        </div>

        <div className="h-px bg-border" />

        {/* Collaborators */}
        <div className="flex-1 p-3">

          <div className="mb-3 flex items-center gap-2">
            <Users className="size-4 text-muted-foreground" />

            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              People
            </span>

            <span className="ml-auto text-xs text-muted-foreground">
              {collaborators.length}
            </span>
          </div>

          <div className="space-y-1">
            {collaborators.map((collaborator) => (
              <div
                key={collaborator.id}
                className="flex items-center gap-2 rounded-md px-2 py-2 hover:bg-accent"
              >
                {/* Avatar */}
                <div className="relative flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
                  {collaborator.name?.charAt(0).toUpperCase()}

                  <span className="absolute -bottom-0.5 -right-0.5 size-2 rounded-full border-2 border-sidebar bg-green-500" />
                </div>

                {/* Name */}
                <div className="min-w-0">
                  <p className="truncate text-sm">
                    {collaborator.name}
                  </p>

                  <p className="text-[11px] text-muted-foreground">
                    Online
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Share */}
        <div className="border-t border-border p-3">
          <button
            onClick={() => setShareOpen(true)}
            className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <Link className="size-4" />
            Share room
          </button>
        </div>
      </aside>

      {/* Share Dialog */}
      <Dialog open={shareOpen} onOpenChange={setShareOpen}>
        <DialogContent className="sm:max-w-md">

          <DialogHeader>
            <DialogTitle>
              Share room
            </DialogTitle>

            <DialogDescription>
              Invite others to collaborate on{" "}
              <span className="font-medium text-foreground">
                {roomName}
              </span>
              .
            </DialogDescription>
          </DialogHeader>

          {/* Link */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">

              <div className="flex h-9 min-w-0 flex-1 items-center rounded-md border border-border bg-muted/30 px-3">
                <span className="truncate text-xs text-muted-foreground">
                  {roomLink}
                </span>
              </div>

              <Button
                size="sm"
                onClick={handleCopy}
                className="shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="size-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="size-4" />
                    Copy
                  </>
                )}
              </Button>

            </div>

            <p className="text-xs text-muted-foreground">
              Anyone with this link can join this room.
            </p>
          </div>

        </DialogContent>
      </Dialog>
    </>
  );
}