import { io } from "socket.io-client";
import { BASE_URL } from "./globalVariables";


// Singleton socket instance
const socket = io(BASE_URL, {
  transports: ['websocket'],
  withCredentials: true,
});

export default socket;