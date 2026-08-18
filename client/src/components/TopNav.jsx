
import {
  Wifi,
  Check,
  ChevronDown,
  LoaderCircle,
  Play,
} from "lucide-react"
import { Button } from "./ui/button";


export function TopNav({
  projectName,
  saveState,
  onRun,
  collaborators,
}) {
  return (
    <header className="flex h-12 shrink-0 items-center gap-3 border-b border-border bg-sidebar px-3">
      {/* Logo */}
      <div className="flex items-center gap-2 pr-1">
        <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <span className="font-mono text-[13px] font-bold leading-none">
            {"</>"}
          </span>
        </div>

        <span className="text-sm font-semibold tracking-tight">CodeSync</span>
      </div>

      <div className="h-5 w-px bg-border" aria-hidden />

      {/* Project name */}
      <button className="flex items-center gap-1.5 rounded-md px-2 py-1 text-sm text-foreground hover:bg-accent">
        <span className="text-muted-foreground">acme-labs</span>

        <span className="text-muted-foreground">/</span>

        <span className="font-medium">{projectName}</span>

        <ChevronDown className="size-3.5 text-muted-foreground" />
      </button>

      {/* Save status */}
      <div className="flex items-center gap-1.5 text-xs">
        {saveState === "saving" ? (
          <>
            <LoaderCircle className="size-3.5 animate-spin text-primary" />

            <span className="text-muted-foreground">Syncing…</span>
          </>
        ) : (
          <>
            <Check className="size-3.5 text-success" />

            <span className="text-muted-foreground">Saved</span>
          </>
        )}
      </div>

      {/* Connected status */}
      <div className="flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-2 py-0.5 text-xs text-success">
        <Wifi className="size-3.5" />

        <span className="font-medium">Connected</span>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <div className="h-5 w-px bg-border" aria-hidden />

        {/* Actions */}
        <Button
          size="sm"
          onClick={onRun}
          className={`bg-success text-background hover:bg-success/90`}
        >
          <Play className="size-3.5 fill-current" data-icon="inline-start" />
          Run
        </Button>

        <div className="h-5 w-px bg-border" aria-hidden />

        {/* Profile menu */}
        {/* <button className="flex items-center gap-1 rounded-md p-0.5 hover:bg-accent">
          <UserAvatar
            collaborator={collaborators[0]}
            size="md"
            showStatus
          />

          <ChevronDown className="size-3.5 text-muted-foreground" />
        </button> */}
      </div>
    </header>
  );
}