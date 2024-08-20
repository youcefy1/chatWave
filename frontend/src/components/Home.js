import { useNavigate, useLocation } from "react-router-dom";
import NavbarPrivate from "./NavbarPrivate";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import io from "socket.io-client";
import "../styles/Home.css";
import { useState, useEffect } from "react";
import ReactTimeAgo from "react-time-ago";
import Avatar from "react-avatar";
import Chat from "./Chat";
import Endbar from "./Endbar";

const socket = io.connect("http://localhost:3500");

const Home = () => {
  const [receiverUsername, setReceiverUsername] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [username, setUsername] = useState("");
  const [roomsWithLastMessage, setRoomsWithLastMessage] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  const [users, setUsers] = useState();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const getUsername = async () => {
      try {
        const response = await axiosPrivate.get("/users/getUser");
        setUsername(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    getUsername();
  }, []);

  useEffect(() => {
    const getLoggedInUserRooms = async () => {
      try {
        const response = await axiosPrivate.get("/users/getRooms");
        response.data.sort((a, b) => {
          if (!a.lastMessage) return 1;
          if (!b.lastMessage) return -1;

          return new Date(b.lastMessage.time) - new Date(a.lastMessage.time);
        });
        setRoomsWithLastMessage(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    getLoggedInUserRooms();
  }, []);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getUsers = async () => {
      try {
        const response = await axiosPrivate.get("/users", {
          signal: controller.signal,
        });
        isMounted && setUsers(response.data);
      } catch (err) {
        console.error(err);
        navigate("/login", { state: { from: location }, replace: true });
      }
    };

    getUsers();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    Notification.requestPermission();
  }, []);

  const joinChat = (e) => {
    e.preventDefault();
    const isValidUsername = users.find(
      (user) => user.username === receiverUsername
    );

    if (isValidUsername && receiverUsername !== username) {
      const data = { username, receiverUsername };
      console.log("Emitting join_chat:", data);
      socket.emit("join_chat", data);
      setShowChat(true);
    } else if (receiverUsername === username) {
      console.log("You cannot chat with yourself.");
    } else {
      console.log(`User with username ${receiverUsername} not found.`);
    }
  };

  const joinUser = (e, room) => {
    e.preventDefault();
    const data = { username, receiverUsername: room.room };
    console.log("Emitting join_chat:", data);
    socket.emit("join_chat", data);
    setShowChat(true);
    setReceiverUsername(room.room);
  };
  return (
    <>
      <NavbarPrivate />
      {/* <section>
        <p>You are logged in! {username}</p>
        <br />
        <Link to="/admin">Go to the Admin page</Link> 
        <br />
      </section> */}
      <div className="d-flex">
        <>
          <div className="container" id="joinChatContainer">
            <div class="row align-items-center">
              <div class="col">
                <div className="container" id="topbar">
                  <div className="avatar">
                    <a href="/">
                      <Avatar name={username} size="36" round />
                    </a>
                  </div>
                  <a
                    data-bs-toggle="collapse"
                    href="#collapseExample"
                    role="button"
                    aria-expanded="false"
                    aria-controls="collapseExample"
                  >
                    <i class="bi bi-pencil-square"></i>
                  </a>
                </div>
                <div class="collapse" id="collapseExample">
                  <div class="card card-body text-center">
                    <form onSubmit={joinChat} className="d-flex">
                      <input
                        type="text"
                        className="form-control me-2"
                        style={{ width: "70%" }}
                        placeholder="User's Username..."
                        onChange={(event) => {
                          setReceiverUsername(event.target.value);
                        }}
                      />
                      <button
                        className="btn btn-primary"
                        data-bs-toggle="collapse"
                        href="#collapseExample"
                        role="button"
                        aria-expanded="false"
                        aria-controls="collapseExample"
                      >
                        Start Chat
                      </button>
                    </form>
                  </div>
                </div>
                <h5 className="messages">
                  <b>Messages</b>
                </h5>
                {roomsWithLastMessage.length === 0 ? (
                  <div id="noroom">
                    <p>You do not have any room.</p>
                  </div>
                ) : (
                  <>
                    {roomsWithLastMessage.map((room) => (
                      <div
                        class="card card-body justify-content-center mb-2"
                        id="messagegroups"
                        onClick={(e) => joinUser(e, room)}
                      >
                        <div className="d-flex">
                          <div className="avatar">
                            <Avatar name={room.room} size="40" round />
                          </div>
                          <ul key={room.room}>
                            <li>
                              <h6>{room.room}</h6>
                            </li>
                            {room.lastMessage && (
                              <div>
                                <li>
                                  {room.lastMessage.message
                                    ? room.lastMessage.message
                                    : `${room.room} wants to send you a message!`}{" "}
                                  •{" "}
                                  <ReactTimeAgo
                                    date={room.lastMessage.time}
                                    locale="en-US"
                                  />
                                </li>
                              </div>
                            )}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
        </>
        <Chat
          socket={socket}
          username={username}
          receiverUsername={receiverUsername}
          showChat={showChat}
        />
      </div>
      <Endbar />
    </>
  );
};

export default Home;
