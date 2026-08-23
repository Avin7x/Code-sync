import { Link, Users, Copy } from "lucide-react";

export function UserAvatar({
  roomName,
  language,
  collaborators = [],
  onShare,
}) {
  return (
    <aside className="flex h-full  shrink-0 flex-col  bg-sidebar">
      {/* Room */}
      <div className="p-3">
        <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          <span>Room</span>
        </div>

        <div className="rounded-md bg-muted/50 px-3 py-2">
          <p className="truncate text-sm font-medium">{roomName}</p>

          <p className="mt-1 text-xs text-muted-foreground">{language}</p>
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

                {/* Online indicator */}
                <span className="absolute -bottom-0.5 -right-0.5 size-2 rounded-full border-2 border-sidebar bg-green-500" />
              </div>

              {/* Name */}
              <div className="min-w-0">
                <p className="truncate text-sm">{collaborator.name}</p>

                <p className="text-[11px] text-muted-foreground">Online</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-border p-3">
        <button
          onClick={onShare}
          className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          <Link className="size-4" />
          Share room
        </button>
      </div>
    </aside>
  );
}
