import { useEffect, useRef } from "react";

function MessageList({
  messages,
  currentUserId,
}) {
  const bottomRef = useRef(null);

  // Automatically scroll to newest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
      {messages.map((message) => {
        const isMyMessage =
          String(message.sender) ===
          String(currentUserId);

        return (
          <div
            key={message._id}
            className={`mb-3 flex ${
              isMyMessage
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`
                max-w-[70%]
                rounded-lg
                px-4
                py-2
                ${
                  isMyMessage
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-900 shadow"
                }
              `}
            >
              {message.content}
            </div>
          </div>
        );
      })}

      <div ref={bottomRef} />
    </div>
  );
}

export default MessageList;