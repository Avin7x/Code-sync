import * as Y from "yjs";

const rooms = new Map();
export function createRoomDoc(roomId) {
    const ydoc = new Y.Doc();

    const ytext = ydoc.getText("code");

    rooms.set(roomId, ydoc);
    
    return ydoc;
}

export function getRoomDoc(roomId) {
    return rooms.get(roomId);
}

export function deleteRoomDoc(roomId) {
    const ydoc = rooms.get(roomId);
    if(!ydoc) return;

    ydoc.destroy();
    rooms.delete(roomId);
}