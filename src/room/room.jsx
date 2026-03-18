import { useCallback, useEffect, useState, useRef, use } from "react";
import useSocket from "../socket/socket";
import peer from "../rtc/connect";
const Roompage = () => {
const socket = useSocket();
  console.log(socket);
  const [stream, setStream] = useState(null);
  const [isUserJoined, setIsUserJoined] = useState(false);
  const [room, setRoom] = useState("");
  const [remotestream, setRemotestream] = useState(null);
  const videoref = useRef();
  const remoteref = useRef();
  useEffect(() => {
  const handleUserJoined = (room) => {
    console.log("joined room:", room);
    setIsUserJoined(true);
    setRoom(room);
  };

  const handleDisconnect = () => {
    setIsUserJoined(false);
  };

  socket.on("user_joined", handleUserJoined);
  socket.on("disconnect", handleDisconnect);

  return () => {
    socket.off("user_joined", handleUserJoined);
    socket.off("disconnect", handleDisconnect);
  };
}, [socket]);
  const getusermedia = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(stream);
      if (videoref.current) {
        videoref.current.srcObject = stream;
        console.log("stream is showing");
      }
    return stream;
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  }, []);
useEffect(() => {
  peer.peer.ontrack = (event) => {
    const remoteStream = event.streams[0];
    console.log("remote stream received");
    if (remoteStream) {
      setRemotestream(remoteStream);
      remoteref.current.srcObject = remoteStream;
      console.log("Remote stream assigned to ref:", remoteref.current.srcObject);
    }
  };
}, []);
  const addmediatrack = useCallback((stream) => {
      if (stream) {
        stream.getTracks().forEach((track) => {
          peer.peer.addTrack(track, stream);
        });
      } else {
        console.error("no stream found");
      }
    } , []);


useEffect(() => {
  const handleAnswer = async (answer) => {
    await peer.peer.setRemoteDescription(answer);
  };

  const handleOffer = async ({ offer, room }) => {
  console.log("offer received in room:", room);
  await peer.peer.setRemoteDescription(offer);
  const stream = await getusermedia();
  addmediatrack(stream);
  const answer = await peer.getanswer();

 socket.emit("answer", { answer, room });
};

  socket.on("answerreceived", handleAnswer);
  socket.on("offerreceived", handleOffer);

  return () => {
    socket.off("answerreceived", handleAnswer);
    socket.off("offerreceived", handleOffer);
  };
}, [socket]);


  const handlecallsent = async () => {
   const stream=await getusermedia();
    addmediatrack(stream);
    const offer = await peer.getOffer();
    socket.emit("offersend", { offer, room });
  };

  useEffect(() => {
  if (!peer?.peer) return;

  peer.peer.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit("ice", {
        candidate: event.candidate,
        room, 
      });
    }
  };

  return () => {
    peer.peer.onicecandidate = null; 
  };
}, [socket, room]);
useEffect(() => {
  const handleIce = async ({ candidate }) => {
    try {
      await peer.peer.addIceCandidate(candidate);
    } catch (err) {
      console.error("Error adding ICE candidate", err);
    }
  };

  socket.on("ice", handleIce);

  return () => {
    socket.off("ice", handleIce);
  };
}, [socket]);
  return (
    <div>
      <h1>room page</h1>
      {isUserJoined ? (
        <>
          <h2>connected</h2>
          <button onClick={handlecallsent}>call</button>
        </>
      ) : (
        <h2>no one is yet here</h2>
      )}
      <h1>stream</h1>
      <div
        style={{
          display: stream ? "flex" : "none",
          flexDirection: "column",
        }}
      >

        <video ref={videoref} autoPlay muted playsInline width="290" height="400" />
      </div>
      <h1>remote stream</h1>
      <div
        style={{
          display: remotestream ? "flex" : "none",
          flexDirection: "column",
        }}
      > 
        <video ref={remoteref} autoPlay playsInline width="290" height="400" />
      </div>
    </div>
  );
};
export default Roompage;
