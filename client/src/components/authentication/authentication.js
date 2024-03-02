import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate  } from 'react-router-dom';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUser } from '../userContext';

import styles from './authentication.module.css';

const Auth = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const navigate = useNavigate();
    const { setUser } = useUser();

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
                toggleAuthMode();
            } catch (error) {
                toast.error("There was a problem registering please try again.");
            }
        } else {
            try {
                const logRes = await axios.post('http://localhost:5001/auth/login', { username, password });
                const { token, user } = logRes.data;
                setUser({ ...user, token });
                toast.success("Login successful!");
                navigate('/chat');
            } catch (error) {
                toast.error("Invalid username or password");
            }
    }
    };

    const toggleAuthMode = () => {
        setUsername('');
        setPassword('');
        setIsRegistering(!isRegistering);
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1>{isRegistering ? 'Register' : 'Login'}</h1>
                <form onSubmit={handleAuth}>
                    <div className={styles.formcolumn}>
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
