import React, { useState, useEffect } from "react";
import axios from "axios";

import styles from "./chat.module.css";
import { useUser } from "../userContext";

const Chat = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [message, setMessage] = useState("");
  const [chatLogs, setChatLogs] = useState([]);
  const { currentUser } = useUser();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if(selectedUser) {
      fetchUsers();
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

  const fetchChatLogs = async () => {
    try {
      const res = await axios.get(`http://localhost:5001/messages/${selectedUser}`);
      setChatLogs(res.data);
    } catch (error) {
      console.error("Failed to fetch chat logs");
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!selectedUser || !message) return;

    try {
      await axios.post("http://localhost:5001/messages", {
        sender: currentUser.id,
        receiver: selectedUser,
        content: message,
      });
      fetchChatLogs();
      setMessage("");
    } catch (error) {
      console.error("Failed to send message");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.containerHeader}>
          <div className={styles.headerSearch}>
            <input type="text" placeholder="Search user" onChange={(e) => {
              const query = e.target.value.toLowerCase();
              const filteredUsers = users.filter(user =>
                user.username.toLowerCase().includes(query)
              );
              setUsers(filteredUsers);
            }}></input>
          </div>
          <div className={styles.headerTitle}>
            <h2>Header</h2>
          </div>
        </div>
        <div className={styles.containerMain}>
          <div className={styles.mainSidenav}>
            <div className={styles.sidenavHistory}>
              <h3>History</h3>
              {users.map((user) => (
                <div key={user._id} onClick={() => setSelectedUser(user._id)}>
                  {user.username}
                </div>
              ))}
            </div>
            <div className={styles.sidenavInfo}>
              <div className={styles.infoContainer}>
                <h3>Account name</h3>
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
