import { api } from "@/api/roomApi";
import { createContext, useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// Creates user id
const getUserId = () => {
    let id = sessionStorage.getItem("user-id");
    if(!id){
        id = crypto.randomUUID();
        sessionStorage.setItem("user-id", id);
    }
    return id;
}

const RoomContext = createContext(null);

export function RoomProvider ({children}) {
    const navigate = useNavigate();
    const location = useLocation();

    const roomId = location.pathname.split("/")[2];

    const [room, setRoom] = useState(() => {
        if(!roomId) return null;

        const storedRoom = sessionStorage.getItem(`joined-room:${roomId}`);
        return storedRoom? JSON.parse(storedRoom).room : null;
    });

    const [user, setUser] = useState(() => {
        if(!roomId) return null;

        const storedRoom = sessionStorage.getItem(`joined-room:${roomId}`);
        return storedRoom? JSON.parse(storedRoom).user : null;
    });

    const createRoom  = async(name) => {
        try {
            const userId = getUserId();
            const {data} = await api.post("/rooms/create", {name: name.trim(), userId});

            const createdRoom = data.room;

           

            const currentUser = {
                userId,
                name: name.trim(),
                isOwner: true
            }

            setRoom(createdRoom);
            setUser(currentUser);

            sessionStorage.setItem(`joined-room:${createdRoom.roomId}`, JSON.stringify({
                room: createdRoom,
                user: currentUser
            }));

            navigate(`/room/${createdRoom.roomId}/editor`);

        } catch (error) {
            console.error(
              "[Room] Create failed:",
              error.response?.data?.error || error.message,
            );
        }
    }

    const joinRoom = async(roomId, name) => {
        try {
            const { data } = await api.get(`/rooms/${roomId}`);
            const joinedRoom = data.room;
            const userId = getUserId();
            const currentUser = {
                userId,
                name: name.trim(),
                isOwner: joinedRoom.ownerId == userId,
            }

            setRoom(joinedRoom);
            setUser(currentUser);

            
            
            sessionStorage.setItem(`joined-room:${joinedRoom.roomId}`, JSON.stringify({
                room: joinedRoom,
                user: currentUser
            }));

            navigate(`/room/${joinedRoom.roomId}/editor`);


        } catch (error) {
            console.error(
              "[Room] Join failed:",
              error.response?.data?.error || error.message,
            );
        }
    }

    return (
        <RoomContext.Provider value={{
            room,
            user,
            createRoom,
            joinRoom
        }}>
            {children}
        </RoomContext.Provider>
    )
}

export function useRoom () {
    const context = useContext(RoomContext);
    if(!context) throw new Error("useRoom must be used within RoomProvider");

    return context;
}