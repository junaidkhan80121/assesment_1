import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/login';
import Signup from './components/signup';
import Emails from './components/emails';

function App() {
    const [token, setToken] = useState(localStorage.getItem('token'));

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login setToken={setToken} />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/emails" element={token ? <Emails /> : <Login setToken={setToken} />} />
                <Route path="*" element={<Login setToken={setToken} />} />
            </Routes>
        </Router>
    );
}

export default App;
