import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Chat = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [message, setMessage] = useState('');
    const [chatLogs, setChatLogs] = useState([]);

    useEffect(() => {
        fetchUsers();
        // Fetch chat logs for the selected user
        // You may need to implement this depending on your backend structure
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await axios.get('http://localhost:5001/users');
            setUsers(res.data);
        } catch (error) {
            console.error('Failed to fetch users');
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!selectedUser || !message) return;

        try {
            await axios.post('http://localhost:5001/messages', {
                sender: 'currentUserId', // Replace with actual sender ID
                receiver: selectedUser,
                message
            });
            // Update chat logs or fetch chat logs again for the selected user
            setMessage('');
        } catch (error) {
            console.error('Failed to send message');
        }
    };

    return (
        <div>
            <h2>Chat</h2>
            <div>
                <h3>Users</h3>
                <ul>
                    {users.map(user => (
                        <li key={user._id} onClick={() => setSelectedUser(user.username)}>
                            {user.username}
                        </li>
                    ))}
                </ul>
            </div>
            {selectedUser && (
                <div>
                    <h3>Chatting with {selectedUser}</h3>
                    {/* Display chat logs here */}
                    <form onSubmit={handleSend}>
                        <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
                        <button type="submit">Send</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Chat;
