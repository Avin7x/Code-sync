import { BrowserRouter, Routes, Route } from "react-router-dom";

import RoomEntry from "./pages/RoomEntry";
import CodePlayground from "./pages/CodePlayground";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RoomEntry />} />
        <Route path="/room/:roomId" element={<CodePlayground />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;