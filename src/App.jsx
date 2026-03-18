import Lobbypage from "./lobby/page.jsx";
import {SocketProvider} from "./socket/socket.jsx";
import Roompage from "./room/room.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
const App = () => {
  return (
    <>
      <Router>
        <SocketProvider>
          <Routes>
            <Route path="/" element={<Lobbypage />} />
            <Route path="/room" element={<Roompage />} />
          </Routes>
        </SocketProvider>
      </Router>
    </>
  );
};
export default App;
