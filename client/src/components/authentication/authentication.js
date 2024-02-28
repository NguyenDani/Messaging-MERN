import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate  } from 'react-router-dom';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './styles.css';

const Auth = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const navigate = useNavigate();

    const handleAuth = async (e) => {
        e.preventDefault();
        if (!username || !password) { // Check if username or password is empty
            toast.error("Please provide both username and password!");
            return;
        }
        if (isRegistering) {
            try {
                await axios.post('http://localhost:5001/auth/register', { username, password });
                toast.success("Account created!");
                const res = await axios.post('http://localhost:5001/auth/login', { username, password });
                navigate('/chat');
            } catch (error) {
                toast.error("There was a problem registering please try again.");
            }
        } else {
            try {
                const res = await axios.post('http://localhost:5001/auth/login', { username, password });
                toast.success("Login successful!");
                navigate('/chat');
            } catch (error) {
                toast.error("Wrong login information.");
            }
    }
    };

    const toggleAuthMode = () => {
        setUsername('');
        setPassword('');
        setIsRegistering(!isRegistering);
    };

    return (
        <div>
            <div class="card">
                <h1>{isRegistering ? 'Register' : 'Login'}</h1>
                <form onSubmit={handleAuth}>
                    <div class="form-column">
                        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <button type="submit">{isRegistering ? 'Register' : 'Login'}</button>
                    </div>
                </form>

                <button onClick={toggleAuthMode}>{isRegistering ? 'Login' : 'Register'}</button>
            </div>
            <ToastContainer
                position="bottom-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
                transition={Bounce}
            />
        </div>
        
    );
};

export default Auth;
