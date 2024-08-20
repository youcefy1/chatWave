import React, { useEffect, useState, useRef } from "react";
import Avatar from "react-avatar";
import "../styles/Chat.css";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

function Chat({ socket, username, receiverUsername, showChat }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [roomName, setRoomName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const axiosPrivate = useAxiosPrivate();

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView();
  };

  useEffect(() => {
    scrollToBottom();
  }, [messageList]);

  useEffect(() => {
    const handleReceiveMessage = (data) => {
      setMessageList((prevList) => [...prevList, data]);
      if (data.author !== username && data.author === receiverUsername) {
        if (Notification.permission === "granted") {
          new Notification(`New message from ${data.author}`, {
            body: data.message,
          });
        }
      }
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [socket]);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        receiverUsername: receiverUsername,
        author: username,
        message: currentMessage,
        time: new Date(),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    socket.on("chat_history", (data) => {
      if (data.room === receiverUsername) {
        setMessageList(data.history);
        setRoomName(receiverUsername);
        setIsLoading(false);
      }
    });
    console.log("message list: ",messageList)

    return () => {
      socket.off("chat_history");
    };
  }, [socket, receiverUsername]);

  const deleteChat = async () => {
    try {
      const response = await axiosPrivate.delete(
        `/users/delete-chat/${receiverUsername}`
      );
      window.location.reload(false);
    } catch (err) {
      console.error(err);
      setError("Failed to delete chat");
    }
  };
  
  const blockUser = async () => {
    try {
      const response = await axiosPrivate.put(`/users/block-user/${receiverUsername}`);
      window.location.reload(false);
      console.log(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to block user");
    }
  };
  

  return (
    <>
    {showChat ? (
      isLoading ? (
        <div className="container" id="chatContainer">
        <div className="container" id="chatTopbar">
  <div class="d-flex justify-content-center" id="spinner2">
  <div class="spinner-border" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>
</div>
</div>
</div>
) :
        <div className="container" id="chatContainer">
          <div className="container" id="chatTopbar">
            <div className="receiver-info">
              <div id={"avatar"}>
                <Avatar name={roomName} size="35" round />
              </div>
              <p>{roomName}</p>
            </div>
            <button
              class="drop"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i class="bi bi-three-dots-vertical"></i>
            </button>
            <ul class="dropdown-menu">
              <li>
                <a
                  class="dropdown-item"
                  onClick={deleteChat}
                  style={{ cursor: "pointer" }}
                >
                  Delete Chat
                </a>
              </li>
              <li>
                <a class="dropdown-item" href="#" style={{ color: "	#ff4545",  cursor: "pointer"}} onClick={blockUser}>
                  Block
                </a>
              </li>
            </ul>
          </div>
          <div class="row align-items-center">
            <div class="col">
              <div className="chat-body">
                {messageList.map((messageContent) => {
                  return (
                    <div
                      className="message"
                      id={username === messageContent.author ? "you" : "other"}
                    >
                      <p id="author">{messageContent.author}</p>
                      <div className="messagediv">
                        {username !== messageContent.author && (
                          <Avatar name={roomName} size="26" round />
                        )}
                        <p className="message-content">
                          {messageContent.message}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
              <div className="d-flex" id="chatinput">
                <input
                  type="text"
                  className="form-control me-2"
                  style={{ width: "85%" }}
                  placeholder="Message..."
                  value={currentMessage}
                  onChange={(event) => {
                    setCurrentMessage(event.target.value);
                  }}
                  onKeyPress={(event) => {
                    event.key === "Enter" && sendMessage();
                  }}
                />
                <button
                  className={
                    currentMessage ? "btn btn-primary" : "btn disabled"
                  }
                  onClick={sendMessage}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="container" id="chatContainersecond">
          <div id="startchat">
            <p>Your messages</p>
            <p>Share messages privately with friends.</p>
            <button
              className="btn btn-primary"
              data-bs-toggle="collapse"
              href="#collapseExample"
              role="button"
              aria-expanded="false"
              aria-controls="collapseExample"
            >
              Send Message
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Chat;
