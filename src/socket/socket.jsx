import io from "socket.io-client";
import { useContext, createContext } from "react";
const SocketContext = createContext();

 const useSocket = () => {
  return useContext(SocketContext);
}

export  const SocketProvider = ({ children }) => {
  const socket = io("https://chat-app-mdh0.onrender.com");
  return(
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
export default useSocket;