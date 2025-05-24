import { useState } from "react";
import "./chat.css";
import Navbar from "./Navbar";

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const newMessages = [...messages, { role: "user", text: userInput }];
    setMessages(newMessages);
    setUserInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userInput }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setMessages([...newMessages, { role: "bot", text: data.response }]);
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages([...newMessages, { role: "bot", text: "Error fetching response. Please try again." }]);
    }

    setLoading(false);
  };

  return (
    <>
    <Navbar/>
      <div className="max-w-md mx-auto p-4 shadow-md chatbotcontainer">
        <h1 id="chathead">CHATBOT</h1>
        <div className="h-80 overflow-y-auto border-b p-2 text-black">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-2 my-1 rounded-lg text-black ${
                msg.role === "user" ? "bg-blue-500 text-right " : "bg-gray-200 text-black"
              }`}
            >
              {msg.text}
            </div>
          ))}
          {loading && <div className="text-gray-600">Chatbot is typing...</div>}
        </div>
        <div className="flex mt-2 text-black">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="flex-grow p-2 border rounded-l-lg focus:outline-none text-black"
            placeholder="Ask something..."
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
}
