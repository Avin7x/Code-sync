import { Navigate, Outlet, useParams } from "react-router-dom"


function ProtectedRoute() {
    const {roomId } = useParams();
    const joinedRoom = sessionStorage.getItem(`joined-room:${roomId}`);

    if(!joinedRoom) return <Navigate to={`/room/${roomId}`} replace/>;

  return <Outlet />;
}

export default ProtectedRoute;