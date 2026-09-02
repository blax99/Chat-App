import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

function ChatWindow({
  selectedUser,
  messages,
  currentUserId,
  onSendMessage,
}) {
  if (!selectedUser) {
    return (
      <div className="flex h-full items-center justify-center bg-gray-50">
        <p className="text-gray-500">
          Select a user to start chatting
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Chat Header */}
      <div className="border-b bg-white p-4">
        <h2 className="font-semibold text-gray-800">
          {selectedUser.name}
        </h2>

        <p
          className={`text-sm ${selectedUser.isOnline
              ? "text-green-600"
              : "text-gray-500"
            }`}
        >
          {selectedUser.isOnline
            ? "Online"
            : "Offline"}
        </p>
      </div>

      {/* Messages */}
      <MessageList
        messages={messages}
        currentUserId={currentUserId}
      />

      {/* Input */}
      <MessageInput
        onSendMessage={onSendMessage}
      />
    </div>
  );
}

export default ChatWindow;