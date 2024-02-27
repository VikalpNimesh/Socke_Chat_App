import { useEffect, useMemo, useState } from "react";
import "./ChatApp.css";
import io from "socket.io-client";



const ChatApp = () => {
  const socket = useMemo(()=>io.connect("http://localhost:3000"),[])
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [name, setName] = useState("");
  const [showChat, setShowChat] = useState(false);

  const handleSendName = () => {
    if (name !== "") {
      socket.emit("join_room", name);
      setShowChat(true);
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim() !== "") {
      const messageData = {
        name: name,
        message: inputMessage,
        socketId : socket.id
      };
      setMessages((prevMessages) => [...prevMessages, messageData]);
      // console.log(messageData);
      socket.emit("chat_message", messageData);
      setInputMessage("");
    }
  };
  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected", socket.id);
    });
   
    socket.on("send message", (recievedData) => {
      console.log(recievedData);
      setMessages((prevMessages) => [...prevMessages, recievedData]);
    });
    return () => {
      socket.disconnect();
    };
  }, [socket]);
  return (
    <>
      {!showChat ? (
        <div className="name">
          <h1>Join Room</h1>
          <input
            type="text"
            value={name}
            placeholder="Enter your Name"
            onChange={(e) => setName(e.target.value)}
            onKeyPress={(e)=>e.key === "Enter" && handleSendName() }
          />
          <button onClick={handleSendName}>Send</button>
        </div>
      ) : (
        <div className="bg">
          <h1 className="user" >{name}</h1>
          <ul id="messages">
            {messages.map((messageContent, index) => (
              <li
                key={index}
                id={name == messageContent.name ? "you" : "other"}
              >
                {messageContent.message}{" "}
              </li>
            ))}
          </ul>
          <form id="form" onSubmit={sendMessage}>
            <input
              id="input"
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              autoComplete="off"
            />
            <button type="submit">Send</button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatApp;
