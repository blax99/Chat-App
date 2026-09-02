import {
  useEffect,
  useRef,
  useState,
} from "react";

import Login from "./components/Login";
import Home from "./components/Home";
import Register from "./components/Register";
import createSocket from "./socket/socket";

import {
  getUsers,
  getChatHistory,
} from "./services/chatService";

import UserList from "./components/UserList";
import ChatWindow from "./components/ChatWindow";


function App() {
  const [page, setPage] = useState("home");
  // =====================================
  // AUTH STATE
  // =====================================

  const [auth, setAuth] = useState(() => {
    const savedAuth = localStorage.getItem("auth");

    return savedAuth
      ? JSON.parse(savedAuth)
      : null;
  });

  // =====================================
  // CHAT STATE
  // =====================================

  const [users, setUsers] = useState([]);

  const [selectedUser, setSelectedUser] =
    useState(null);

  const [messages, setMessages] = useState([]);


  // =====================================
  // REFS
  // =====================================

  const socketRef = useRef(null);

  const selectedUserRef = useRef(null);


  // =====================================
  // HANDLE LOGIN
  // =====================================
  const handleLogin = (loginData) => {
    const authData = {
      token: loginData.token,
      user: {
        ...loginData.user,
        _id: loginData.user.id,
      },
    };

    localStorage.setItem(
      "auth",
      JSON.stringify(authData)
    );

    setAuth(authData);
  };

  const handleRegisterSuccess = () => {
    setPage("login");
  };

  const handleLogout = () => {
    localStorage.removeItem("auth");
    setAuth(null);
  };

  // =====================================
  // LOAD USERS
  // =====================================

  useEffect(() => {
    // Do nothing before login
    if (!auth) return;

    const loadUsers = async () => {
      try {
        const data = await getUsers(
          auth.token
        );

        const allUsers =
          data.users || data;

        // Remove logged-in user
        const otherUsers =
          allUsers.filter(
            (user) =>
              String(user._id) !==
              String(auth.user._id)
          );

        setUsers(otherUsers);

      } catch (error) {
        console.error(
          "Failed to load users:",
          error
        );
      }
    };

    loadUsers();

  }, [auth]);


  // =====================================
  // CONNECT SOCKET
  // =====================================

  useEffect(() => {
    // Do not connect before login
    if (!auth) return;

    const socket = createSocket(
      auth.token
    );

    socketRef.current = socket;


    socket.on("connect", () => {
      console.log(
        "Socket connected:",
        socket.id
      );
    });


    socket.on(
      "connect_error",
      (error) => {
        console.error(
          "Socket error:",
          error.message
        );
      }
    );


    // Receive new messages
    socket.on(
      "message:new",
      (newMessage) => {
        const activeUser =
          selectedUserRef.current;

        // No active chat
        if (!activeUser) return;

        // Check if message belongs
        // to current conversation
        const belongsToCurrentChat =
          String(newMessage.sender) ===
          String(activeUser._id) ||
          String(newMessage.receiver) ===
          String(activeUser._id);

        if (!belongsToCurrentChat) return;


        setMessages(
          (previousMessages) => {
            // Prevent duplicates
            const alreadyExists =
              previousMessages.some(
                (message) =>
                  String(message._id) ===
                  String(newMessage._id)
              );

            if (alreadyExists) {
              return previousMessages;
            }

            return [
              ...previousMessages,
              newMessage,
            ];
          }
        );
      }
    );


    socket.on("user:status", (statusData) => {
      console.log("User status update:", statusData);

      // Update the user in the user list
      setUsers((previousUsers) =>
        previousUsers.map((user) => {
          if (
            String(user._id) ===
            String(statusData.userId)
          ) {
            return {
              ...user,
              isOnline: statusData.isOnline,
            };
          }

          return user;
        })
      );

      // Update the selected user's status
      setSelectedUser((previousUser) => {
        // No user is selected
        if (!previousUser) {
          return previousUser;
        }

        // Status update is for another user
        if (
          String(previousUser._id) !==
          String(statusData.userId)
        ) {
          return previousUser;
        }

        // Update the selected user's status
        return {
          ...previousUser,
          isOnline: statusData.isOnline,
        };
      });
    });

    socket.on(
      "message:error",
      (error) => {
        console.error(
          "Message error:",
          error.message
        );
      }
    );

    // Cleanup socket
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };

  }, [auth]);


  // =====================================
  // SELECT USER
  // =====================================

  const handleSelectUser = async (user) => {
    if (!auth) return;

    try {
      // Update selected user
      setSelectedUser(user);

      // Update ref immediately
      selectedUserRef.current = user;

      // Clear previous messages
      setMessages([]);

      // Get chat history
      const data =
        await getChatHistory(
          user._id,
          auth.token
        );

      setMessages(data.messages);

    } catch (error) {
      console.error(
        "Failed to load chat:",
        error.response?.data || error
      );
    }
  };


  // =====================================
  // SEND MESSAGE
  // =====================================

  const handleSendMessage = (content) => {
    if (!selectedUser || !socketRef.current) {
      return;
    }

    socketRef.current.emit(
      "message:send",
      {
        receiverId: selectedUser._id,
        content,
      }
    );
  };


  // =====================================
  // SHOW LOGIN
  // =====================================
  if (!auth) {
    if (page === "home") {
      return (
        <Home
          onLogin={() => setPage("login")}
          onRegister={() => setPage("register")}
        />
      );
    }

    if (page === "register") {
      return (
        <Register
          onRegisterSuccess={handleRegisterSuccess}
          onLogin={() => setPage("login")}
        />
      );
    }

    return (
      <Login
        onLogin={handleLogin}
      />
    );
  }


  // =====================================
  // SHOW CHAT APPLICATION
  // =====================================

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="w-1/3 border-r">
        <UserList
          users={users}
          selectedUser={selectedUser}
          onSelectUser={handleSelectUser}
          onLogout={handleLogout}
        />
      </div>

      {/* Chat Area */}
      <div className="flex flex-1 flex-col">
        <ChatWindow
          selectedUser={selectedUser}
          messages={messages}
          currentUserId={auth.user._id}
          onSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
}

export default App;