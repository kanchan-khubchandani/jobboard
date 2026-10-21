
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

export default function Chat() {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = io("http://localhost:5001");
    socketRef.current = socket;

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    socket.on("chatMessage", (data) => {
      setMessages((previous) => [...previous, data]);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  function sendMessage(e) {
    e.preventDefault();

    if (!username.trim() || !message.trim()) return;

    socketRef.current?.emit("chatMessage", {
      username: username.trim(),
      message: message.trim()
    });

    setMessage("");
  }

  return (
    <section className="max-w-3xl mx-auto px-6 py-10">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-3xl font-bold text-blue-600">
          JobBoard Real-Time Chat
        </h2>

        <p className={`mt-3 font-medium ${
          connected ? "text-green-600" : "text-red-600"
        }`}>
          {connected ? "Connected" : "Connecting..."}
        </p>

        <input
          className="w-full border rounded-lg p-3 mt-5"
          placeholder="Enter your name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <div className="bg-gray-50 border rounded-lg p-4 my-5 min-h-48 max-h-80 overflow-y-auto">
          {messages.length === 0 ? (
            <p className="text-gray-500">
              No messages yet. Start the conversation!
            </p>
          ) : (
            messages.map((item, index) => (
              <p key={index} className="mb-3 break-words">
                <strong className="text-blue-600">
                  {item.username}:
                </strong>{" "}
                {item.message}
              </p>
            ))
          )}
        </div>

        <form onSubmit={sendMessage} className="flex gap-3">
          <input
            className="flex-1 min-w-0 border rounded-lg p-3"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <button
            type="submit"
            disabled={!connected}
            className="bg-blue-600 text-white px-5 rounded-lg disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </div>
    </section>
  );
}
