import { useEffect, useMemo, useRef, useState } from "react";
import * as Y from "yjs";
// import * as awarenessProtocol from "y-protocols/awareness.js";
import Provider from "./yjsProvider";
import toast from "react-hot-toast";

export function useCollaboration(roomId, user) {
    const ydocRef = useRef(null);
    const providerRef = useRef(null);

    if(!ydocRef.current) {
        ydocRef.current = new Y.Doc();
    }
    const ytext = ydocRef.current.getText("code");

    const [awareness, setAwareness] = useState(null);
    const [collaborators, setCollaborators] = useState([]);
    const [executionResult, setExecutionResult] = useState(null);

    useEffect(() => {
        if (!roomId || !user) return;

        const provider = new Provider (
                ydocRef.current,
                "http://localhost:5000",
                roomId
            );
        
            
        setAwareness(provider.awareness);    
        providerRef.current = provider;
           

        const handleExecutionResult = (result) => {
            console.log(result);
            setExecutionResult(result);
        };

        providerRef.current.socket.on("execution-result", handleExecutionResult);

        // Clean up
        return () => {
             
            providerRef.current.socket.off(
                "execution-result",
                handleExecutionResult
            );

            providerRef.current.destroy();

            providerRef.current = null;

        };
    }, [roomId, user]);

    return {
        ydoc: ydocRef.current,
        ytext,
        awareness,
        collaborators,
        executionResult
    };
}