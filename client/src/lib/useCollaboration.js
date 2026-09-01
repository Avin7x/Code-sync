import { useEffect, useRef } from "react";
import * as Y from "yjs";
import { io } from "socket.io-client";

export function useCollaboration(roomId) {
    const ydocRef = useRef(new Y.Doc());
    const socketRef = useRef(null);
    const ytext = ydocRef.current.getText("code");

    useEffect(() => {
        if(!roomId) return;
        
        const socket = io("http://localhost:5000");
        socketRef.current = socket;

        /*
        * Receive current Yjs state
        * when joining the room
        */
        socket.on("sync-state", (update) => {
             const decoded = new Uint8Array(update);
            Y.applyUpdate(
                ydocRef.current,
                decoded,
                "remote"
            )
        })


        /*
        * Receive live updates
        * from other users
        */
        socket.on("yjs-update", (update) => {
            const decoded = new Uint8Array(update);
            Y.applyUpdate(
                ydocRef.current,
                decoded,
                "remote"
            )
        })


        /*
        * Send local Yjs changes
        * to the server
        */
        const handleYjsUpdate = (update, origin) =>  {
            console.log("handleYjsUpdate hit!");
            if(origin === "remote") return;

            socket.emit("yjs-update", {
                roomId,
                update
            });
        }
        ydocRef.current.on("update", handleYjsUpdate);

        
        /**
         * Join the Socket.Io room
         */
        socket.emit("join-room", roomId);


        // Clean up
        return () => {
            ydocRef.current.off("update", handleYjsUpdate);
            
            socket.disconnect();
            socketRef.current = null;
        }
    }, [roomId]);

    return {
        ydoc: ydocRef.current,
        ytext
    }
}