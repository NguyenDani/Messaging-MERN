import React, { useState, useEffect } from "react";
import axios from "axios";

import styles from "./chat.module.css";
import { useUser } from "../userContext";

const Chat = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [message, setMessage] = useState("");
  const [chatLogs, setChatLogs] = useState([]);
  const [searchText, setSearchText] = useState("");
  const { user } = useUser();
  const { token, username } = user;
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if(selectedUser) {
      fetchChatLogs();
    }
  }, [selectedUser]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5001/users");
      setUsers(res.data);
    } catch (error) {
      console.error("Failed to fetch users");
    }
  };

  // Load Chat logs
  const fetchChatLogs = async () => {
    try {
      const res = await axios.get(`http://localhost:5001/messages/${selectedUser}`);
      setChatLogs(res.data);
    } catch (error) {
      console.error("Failed to fetch chat logs");
    }
  };

  // Send message
  const handleSend = async (e) => {
    e.preventDefault();
    if (!selectedUser || !message) return;

    try {
      await axios.post("http://localhost:5001/messages", {
        sender: user.id,
        receiver: selectedUser,
        content: message,
      });
      fetchChatLogs();
      setMessage("");
    } catch (error) {
      console.error("Failed to send message");
    }
  };

  // Search User function
  useEffect(() => {
    const filteredUsers = users.filter(user =>
      user.username.toLowerCase().startsWith(searchText.toLowerCase())
    );
    setFilteredUsers(filteredUsers);
  }, [searchText, users]);

  const handleUserSelect = (userId) => {
    setSelectedUser(userId);
    fetchChatLogs();
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.containerHeader}>
          <div className={styles.headerSearch}>
            <input
              type="text"
              placeholder="Search user"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            {searchText && (
              <div className={styles.dropdown}>
                {filteredUsers.map((user) => (
                  <div key={user._id} onClick={() => handleUserSelect(user._id)}>
                    {user.username}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className={styles.headerTitle}>
            <h2>{selectedUser ? users.find(u => u._id === selectedUser)?.username : "Header"}</h2>
          </div>
        </div>
        <div className={styles.containerMain}>
          <div className={styles.mainSidenav}>
            <div className={styles.sidenavHistory}>
              <h3>History</h3>
              {filteredUsers.map((user) => (
                <div key={user._id} onClick={() => handleUserSelect(user._id)}>
                  {user.username}
                </div>
              ))}
            </div>
            <div className={styles.sidenavInfo}>
              <div className={styles.infoContainer}>
                <h1>Account</h1>
                <h2>{username ? username : "No user logged in"}</h2>
                <button>Logout</button>
              </div>
            </div>
          </div>
          <div className={styles.mainContent}>
            <div className={styles.contentLog}>
              {chatLogs.map((log, index) => (
                <div key={index} className={styles.chatMessage}>
                  <span className={styles.chatSender}>{log.sender.username}:</span> {log.content}
                </div>
              ))}
            </div>
              <form onSubmit={handleSend} className={styles.contentChat}>
                <textarea type="text" placeholder="Message" value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
                <button type="submit">Send</button>
              </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
