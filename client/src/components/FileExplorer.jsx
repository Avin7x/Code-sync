import { useEffect, useState } from "react"
import {
  ChevronRight,
  ChevronDown,
  FilePlus,
  FolderPlus,
  Search,
  FileCode,
  Braces,
  FileText,
  Folder,
  File as FileIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"


function iconFor(node) {
  if (node.type === "folder") return Folder
  if (node.language === "javascript") return FileCode
  if (node.language === "json") return Braces
  if (node.language === "markdown") return FileText

  return FileIcon
}


const langTint = {
  javascript: "text-syntax-number",
  json: "text-syntax-function",
  markdown: "text-muted-foreground",
}


/*
  Inserts a node inside the correct parent.

  Folder:
    new folder is inserted BEFORE all existing children.

  File:
    new file is inserted AFTER all folders
    but BEFORE existing files.
*/
const insertNode = (fileTree, parentId, newNode) => {
  return fileTree.map((node) => {
    // We found the parent
    if (node.id === parentId && node.type === "folder") {
      const children = node.children ?? []

      // New folders go at the beginning
      if (newNode.type === "folder") {
        return {
          ...node,
          children: [
            newNode,
            ...children,
          ],
        }
      }

      // New files go after all folders
      const folderCount = children.filter(
        (child) => child.type === "folder"
      ).length

      return {
        ...node,
        children: [
          ...children.slice(0, folderCount),
          newNode,
          ...children.slice(folderCount),
        ],
      }
    }

    // Parent wasn't found here.
    // Search recursively inside children.
    if (node.children) {
      return {
        ...node,
        children: insertNode(
          node.children,
          parentId,
          newNode
        ),
      }
    }

    return node
  })
}


/*
  Find a node anywhere inside the fileTree.
*/
const findNodeById = (fileTree, id) => {
  for (const node of fileTree) {
    if (node.id === id) {
      return node
    }

    if (node.children) {
      const found = findNodeById(node.children, id)

      if (found) {
        return found
      }
    }
  }

  return null
}


/*
  Check whether the parent already contains
  a file/folder with the same name.

  This is case-insensitive:

  App.jsx
  app.jsx

  are considered duplicates.
*/
const hasDuplicateChild = (parentNode, name) => {
  const children = parentNode.children ?? []

  return children.some(
    (child) =>
      child.name.trim().toLowerCase() ===
      name.trim().toLowerCase()
  )
}


/*
  Create a new node and insert it into the fileTree.

  Returns:
    { success: true }
    OR
    { success: false, error: "..." }
*/
const createNode = (
  fileName,
  parentNode,
  type,
  setFileTree,
  onSelect
) => {
  const name = fileName.trim()

  // Empty name
  if (!name) {
    return {
      success: false,
      error: "Name cannot be empty.",
    }
  }

  // Invalid path characters
  if (name.includes("/") || name.includes("\\")) {
    return {
      success: false,
      error: "Name cannot contain / or \\.",
    }
  }

  // Duplicate check
  if (hasDuplicateChild(parentNode, name)) {
    return {
      success: false,
      error: `"${name}" already exists in this folder.`,
    }
  }

  const newNode =
    type === "folder"
      ? {
          id: crypto.randomUUID(),
          name,
          type: "folder",
          path: `${parentNode.path}/${name}`,
          parent: parentNode.id,
          children: [],
        }
      : {
          id: crypto.randomUUID(),
          name,
          type: "file",
          path: `${parentNode.path}/${name}`,
          parent: parentNode.id,
          language: "",
        }

  setFileTree((previousfileTree) =>
    insertNode(
      previousfileTree,
      parentNode.id,
      newNode
    )
  )


  return {
    success: true,
    node: newNode,
  }
}


/*
  Search the fileTree.

  A folder is kept if:
    - the folder itself matches
    OR
    - one of its children matches.

  This allows us to show the complete path
  to a matching file.
*/
const filterfileTree = (fileTree, query) => {
  const normalizedQuery = query.trim().toLowerCase()

  if (!normalizedQuery) {
    return fileTree
  }

  const filterNodes = (nodes) => {
    const result = []

    for (const node of nodes) {
      const nodeMatches = node.name
        .toLowerCase()
        .includes(normalizedQuery)

      if (node.type === "folder") {
        const filteredChildren = filterNodes(
          node.children ?? []
        )

        /*
          If the folder itself matches,
          show the whole folder.

          Otherwise only show matching children.
        */
        if (nodeMatches) {
          result.push(node)
        } else if (filteredChildren.length > 0) {
          result.push({
            ...node,
            children: filteredChildren,
          })
        }
      } else if (nodeMatches) {
        result.push(node)
      }
    }

    return result
  }

  return filterNodes(fileTree)
}


function FileRow({
  node,
  depth,
  activeFile,
  onSelect,
  editors,
  creating,
  setCreating,
  setFileTree,
  createError,
  setCreateError,
  isSearching,
}) {
  const [open, setOpen] = useState(true)

  const Icon = iconFor(node)

  const activeEditors = editors.filter(
    (editor) =>
      editor.activeFile === node.id &&
      editor.id !== "u_you"
  )

  const isActive =
    activeFile?.id === node.id


  /*
    Whenever search becomes active,
    open all folders so matching files
    can be seen.
  */
  useEffect(() => {
    if (isSearching && node.type === "folder") {
      setOpen(true)
    }
  }, [isSearching, node.type])


  /*
    Handles Enter inside the temporary
    create input.
  */
  const handleCreateKeyDown = (event) => {
    if (event.key === "Escape") {
      setCreating(null)
      setCreateError("")
      return
    }

    if (event.key !== "Enter") {
      return
    }

    const name = event.currentTarget.value

    const result = createNode(
      name,
      node,
      creating.type,
      setFileTree
    )

    if (!result.success) {
      setCreateError(result.error)
      return
    }

    // Creation succeeded
    setCreateError("")
    setCreating(null)
    onSelect(result.node);
  }


  if (node.type === "folder") {
    const folders =
      node.children?.filter(
        (child) => child.type === "folder"
      ) ?? []

    const files =
      node.children?.filter(
        (child) => child.type === "file"
      ) ?? []


    return (
      <div>
        {/* Folder itself */}
        <button
          type="button"
          onClick={() => {
            setOpen((current) => !current)
            onSelect(node)
          }}
          className={cn(
            "group flex h-6 w-full items-center gap-1 rounded px-1 text-[13px] text-foreground hover:bg-sidebar-accent",
            isActive
              ? "bg-sidebar-accent text-foreground"
              : "text-muted-foreground"
          )}
          style={{
            paddingLeft: depth * 12 + 4,
          }}
        >
          {open ? (
            <ChevronDown className="size-3.5 text-muted-foreground" />
          ) : (
            <ChevronRight className="size-3.5 text-muted-foreground" />
          )}

          <Icon className="size-3.5 text-syntax-property" />

          <span className="truncate">
            {node.name}
          </span>
        </button>


        {/* Children */}
        {open && (
          <div>

            {/* =========================
                NEW FOLDER INPUT
                ========================= */}
            {creating?.parentId === node.id &&
              creating.type === "folder" && (
                <div
                  style={{
                    paddingLeft:
                      (depth + 1) * 12 + 4,
                  }}
                >
                  <input
                    className={cn(
                      "h-6 w-full bg-transparent pl-1.5 text-[13px] text-foreground outline-none",
                      createError &&
                        "text-red-400"
                    )}
                    autoFocus
                    onKeyDown={handleCreateKeyDown}
                    placeholder="folder name"
                  />

                  {createError && (
                    <div
                      className="py-1 text-[11px] text-red-400"
                      style={{
                        paddingLeft: 0,
                      }}
                    >
                      {createError}
                    </div>
                  )}
                </div>
              )}


            {/* =========================
                EXISTING FOLDERS
                ========================= */}
            {folders.map((child) => (
              <FileRow
                key={child.id}
                node={child}
                depth={depth + 1}
                activeFile={activeFile}
                onSelect={onSelect}
                editors={editors}
                creating={creating}
                setCreating={setCreating}
                setFileTree={setFileTree}
                createError={createError}
                setCreateError={setCreateError}
                isSearching={isSearching}
              />
            ))}


            {/* =========================
                NEW FILE INPUT

                Comes AFTER folders
                but BEFORE files.
                ========================= */}
            {creating?.parentId === node.id &&
              creating.type === "file" && (
                <div
                  style={{
                    paddingLeft:
                      (depth + 1) * 12 + 6,
                  }}
                >
                  <input
                    className={cn(
                      "h-6 w-full bg-transparent pl-1.5 text-[13px] text-foreground outline-none",
                      createError &&
                        "text-red-400"
                    )}
                    autoFocus
                    onKeyDown={handleCreateKeyDown}
                    placeholder="file name"
                  />

                  {createError && (
                    <div
                      className="py-1 text-[11px] text-red-400"
                    >
                      {createError}
                    </div>
                  )}
                </div>
              )}


            {/* =========================
                EXISTING FILES
                ========================= */}
            {files.map((child) => (
              <FileRow
                key={child.id}
                node={child}
                depth={depth + 1}
                activeFile={activeFile}
                onSelect={onSelect}
                editors={editors}
                creating={creating}
                setCreating={setCreating}
                setFileTree={setFileTree}
                createError={createError}
                setCreateError={setCreateError}
                isSearching={isSearching}
              />
            ))}
          </div>
        )}
      </div>
    )
  }


  /*
    =========================
    FILE ROW
    =========================
  */

  return (
    <button
      type="button"
      onClick={() => onSelect(node)}
      className={cn(
        "group flex h-6 w-full items-center gap-1.5 rounded px-1 text-[13px] hover:bg-sidebar-accent",
        isActive
          ? "bg-sidebar-accent text-foreground"
          : "text-muted-foreground"
      )}
      style={{
        paddingLeft: depth * 12 + 6,
      }}
    >
      <Icon
        className={cn(
          "size-3.5 shrink-0",
          langTint[node.language ?? ""] ??
            "text-muted-foreground"
        )}
      />

      <span className="truncate">
        {node.name}
      </span>

      {activeEditors.length > 0 && (
        <span className="ml-auto flex -space-x-1 pr-0.5">
          {activeEditors.map((editor) => (
            <span
              key={editor.id}
              className="size-1.5 rounded-full ring-1 ring-sidebar"
              style={{
                backgroundColor:
                  editor.color,
              }}
              title={`${editor.name} editing`}
            />
          ))}
        </span>
      )}
    </button>
  )
}


export function FileExplorer({
  activeFile,
  onSelect,
  fileTree,
  setFileTree,
  collaborators,
}) {
  
  const [query, setQuery] =
    useState("")

  
  const [creating, setCreating] =
    useState(null)

  const [createError, setCreateError] =
    useState("")


  /*
    Determine where the new item should go.

    Folder selected:
      insert inside that folder.

    File selected:
      insert inside the file's parent.

    Nothing selected:
      default to src.
  */
  const targetParentId =
    activeFile
      ? activeFile.type === "folder"
        ? activeFile.id
        : activeFile.parent
      : "d_src"


  /*
    Find the actual target parent node.

    We need the node itself because createNode()
    needs its path.
  */
  const targetParent =
    findNodeById(fileTree, targetParentId)


  /*
    Search results.
  */
  const filteredfileTree =
    filterfileTree(fileTree, query)

  const isSearching =
    query.trim().length > 0


  /*
    Clear creation error whenever
    the user starts a new creation.
  */
  const startCreating = (type) => {
    setCreateError("")

    setCreating({
      type,
      parentId: targetParentId,
    })
  }


  return (
    <aside className="flex h-full w-full min-w-0 flex-col border-r border-border bg-sidebar">

      {/* =========================
          EXPLORER HEADER
          ========================= */}
      <div className="flex h-9 shrink-0 items-center justify-between px-3">

        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Explorer
        </span>

        <div className="flex items-center gap-0.5">

          {/* New File */}
          <button
            onClick={() => startCreating("file")}
            type="button"
            className="flex size-6 items-center justify-center rounded text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
            title="New file"
          >
            <FilePlus className="size-3.5" />
          </button>


          {/* New Folder */}
          <button
            onClick={() => startCreating("folder")}
            type="button"
            className="flex size-6 items-center justify-center rounded text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
            title="New folder"
          >
            <FolderPlus className="size-3.5" />
          </button>

        </div>
      </div>


      {/* =========================
          SEARCH
          ========================= */}
      <div className="shrink-0 px-2 pb-2">

        <div className="flex h-7 items-center gap-1.5 rounded-md border border-border bg-background px-2">

          <Search className="size-3.5 shrink-0 text-muted-foreground" />

          <input
            value={query}
            onChange={(event) =>
              setQuery(event.target.value)
            }
            placeholder="Search files"
            className="w-full min-w-0 bg-transparent text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none"
          />

          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="text-[11px] text-muted-foreground hover:text-foreground"
              title="Clear search"
            >
              ×
            </button>
          )}

          <kbd className="shrink-0 rounded border border-border px-1 text-[10px] text-muted-foreground">
            ⌘P
          </kbd>

        </div>
      </div>


      {/* =========================
          PROJECT
          ========================= */}
      <div className="flex shrink-0 items-center gap-1 px-3 pb-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">

        <ChevronDown className="size-3" />

        acme-realtime-api

      </div>


      {/* =========================
          FILE fileTree
          ========================= */}
      <nav
        className="scrollbar-thin min-h-0 flex-1 overflow-y-auto px-1.5 pb-2"
        aria-label="File fileTree"
      >

        {filteredfileTree.length > 0 ? (
          filteredfileTree.map((node) => (
            <FileRow
              key={node.id}
              node={node}
              depth={0}
              activeFile={activeFile}
              onSelect={onSelect}
              editors={collaborators}
              creating={creating}
              setCreating={setCreating}
              setFileTree={setFileTree}
              createError={createError}
              setCreateError={setCreateError}
              isSearching={isSearching}
            />
          ))
        ) : (
          <div className="px-2 py-4 text-center text-[12px] text-muted-foreground">
            No files found.
          </div>
        )}

      </nav>


      {/* =========================
          FOOTER
          ========================= */}
      <div className="shrink-0 border-t border-border px-3 py-2">

        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">

          <span className="truncate">
            main · synced 2s ago
          </span>

        </div>

      </div>

    </aside>
  )
}