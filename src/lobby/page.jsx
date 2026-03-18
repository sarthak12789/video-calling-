import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useSocket  from "../socket/socket";
const Lobbypage = () => {
  const socket = useSocket();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [room, setRoom] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("join_room", { email, room });
    navigate("/room");
  };
  return (
    <>
      <div
        className="lobbypage"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "100vh",
          gap: "10px",
        }}
      >
        <h1>video calling</h1>
        <form
          className="lobbypage"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <input
            type="email"
            placeholder="enter email here"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="number"
            placeholder="room number"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
          <br />
          <button type="submit" onClick={handleSubmit}>
            join
          </button>
        </form>
      </div>
    </>
  );
};
export default Lobbypage;
