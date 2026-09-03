import { BrowserRouter, Routes, Route } from "react-router-dom";

import RoomEntry from "./pages/RoomEntry";
import CodePlayground from "./pages/CodePlayground";
import ProtectedRoute from "./middlewares/ProtectedRoute";
import { RoomProvider } from "./context/RoomContext";
import { Toaster } from "react-hot-toast";


function App() {
  return (
    <BrowserRouter>
    <RoomProvider>
      <Routes>
        <Route path="/" element={<RoomEntry />} />

        <Route path="/room/:roomId" element={<RoomEntry/>} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/room/:roomId/editor" element={<CodePlayground />} />
        </Route>
           
        
      </Routes>
      <Toaster />
      </RoomProvider>
    </BrowserRouter>
  );
}

export default App;