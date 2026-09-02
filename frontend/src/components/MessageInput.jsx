import { useState } from "react";

function MessageInput({ onSendMessage }) {
  const [content, setContent] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedContent = content.trim();

    if (!trimmedContent) return;

    onSendMessage(trimmedContent);

    setContent("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-3 border-t bg-white p-4"
    >
      <input
        type="text"
        value={content}
        onChange={(event) =>
          setContent(event.target.value)
        }
        placeholder="Type a message..."
        className="
          flex-1
          rounded-lg
          border
          px-4
          py-2
          outline-none
          focus:border-blue-500
        "
      />

      <button
        type="submit"
        className="
          rounded-lg
          bg-blue-600
          px-5
          py-2
          font-medium
          text-white
          hover:bg-blue-700
        "
      >
        Send
      </button>
    </form>
  );
}

export default MessageInput;