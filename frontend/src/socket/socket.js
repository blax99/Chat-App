import { io } from "socket.io-client";

const socket = (token) => {
  return io("http://localhost:5000", {
    auth: {
      token,
    },
  });
};

export default socket;