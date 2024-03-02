import React from 'react';
import { BrowserRouter as Router, Route, Routes  } from 'react-router-dom';
import './App.css';
import Authentication from './components/authentication/authentication';
import Chat from './components/chat/chat';
import { UserProvider } from './components/userContext';

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
            <Route path="/" exact element={<Authentication />} />
            <Route path="/chat" element={<Chat />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
