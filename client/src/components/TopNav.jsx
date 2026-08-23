import {
  Wifi,
  Check,
  LoaderCircle,
  Play,
  ChevronDown,
} from "lucide-react";

import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function TopNav({
  roomName="My DSA Practice",
  language="javascript",
  onLanguageChange,
  saveState,
  onRun,
  collaborators = [],
}) {
  const languages = [
    "JavaScript",
    "TypeScript",
    "Python",
    "Java",
    "C++",
    "C",
    "Go",
    "Rust",
  ];

  return (
    <header className="flex h-12 shrink-0 items-center border-b border-border bg-sidebar px-3">

      {/* Logo */}
      <div className="flex items-center gap-2 pr-3">
        <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <span className="font-mono text-[13px] font-bold leading-none">
            {"</>"}
          </span>
        </div>

        <span className="text-sm font-semibold tracking-tight">
          CodeSync
        </span>
      </div>

      <div className="h-5 w-px bg-border" aria-hidden />

      {/* Room name */}
      <div className="ml-3">
        <span className="text-sm font-medium text-foreground uppercase">
          {roomName}
        </span>
      </div>

      {/* Language selector */}
      <div className="ml-4">
        <DropdownMenu>
  <DropdownMenuTrigger className="flex h-7 items-center gap-1.5 rounded-md px-2 text-xs hover:bg-accent">
    {language}
    <ChevronDown className="size-3.5 text-muted-foreground" />
  </DropdownMenuTrigger>

  <DropdownMenuContent align="end">
    {languages.map((item) => (
      <DropdownMenuItem
        key={item}
        onClick={() => onLanguageChange(item)}
      >
        {item}
      </DropdownMenuItem>
    ))}
  </DropdownMenuContent>
</DropdownMenu>
      </div>

      {/* Right side */}
      <div className="ml-auto flex items-center gap-3">

        {/* Save status */}
        <div className="flex items-center gap-1.5 text-xs">
          {saveState === "saving" ? (
            <>
              <LoaderCircle className="size-3.5 animate-spin text-primary" />
              <span className="text-muted-foreground">
                Syncing…
              </span>
            </>
          ) : (
            <>
              <Check className="size-3.5 text-success" />
              <span className="text-muted-foreground">
                Saved
              </span>
            </>
          )}
        </div>

        <div className="h-5 w-px bg-border" aria-hidden />

        {/* Collaborators */}
        {collaborators.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {collaborators.slice(0, 3).map((collaborator) => (
                <div
                  key={collaborator.id}
                  className="flex size-7 items-center justify-center rounded-full border-2 border-sidebar bg-muted text-xs font-medium"
                  title={collaborator.name}
                >
                  {collaborator.name?.charAt(0).toUpperCase()}
                </div>
              ))}
            </div>

            {collaborators.length > 3 && (
              <span className="text-xs text-muted-foreground">
                +{collaborators.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="h-5 w-px bg-border" aria-hidden />

        {/* Connection status */}
        <div className="flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-2 py-0.5 text-xs text-success">
          <Wifi className="size-3.5" />
          <span className="font-medium">
            Connected
          </span>
        </div>

        <div className="h-5 w-px bg-border" aria-hidden />

        {/* Run */}
        <Button
          size="sm"
          onClick={onRun}
          className="bg-success text-background hover:bg-success/90"
        >
          <Play
            className="size-3.5 fill-current"
            data-icon="inline-start"
          />
          Run
        </Button>
      </div>
    </header>
  );
}