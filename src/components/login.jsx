import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { login } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Login = ({ setToken }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await login(email, password);
            localStorage.setItem('token', data.token);
            localStorage.setItem('email', email);
            localStorage.setItem('password', password);
            setToken(data.token);
            navigate('/emails');
        } catch (err) {
            alert("Invalid credentials");
        }
    };

    return (
        <Box sx={{display:"flex",justifyContent:"center",alignItems:"center",flexDirection:"column",height:"100vh"}}>
            <Typography variant="h4">Login</Typography>
            <form onSubmit={handleSubmit}>
                <TextField sx={{marginTop:"3vh"}} type='email' required='required' label="Email" fullWidth onChange={(e) => setEmail(e.target.value)} />
                <TextField sx={{marginTop:"3vh"}} required='required' label="Password" type="password" fullWidth onChange={(e) => setPassword(e.target.value)} />
                <Button sx={{marginTop:"3vh"}} type="submit" variant="contained" color="primary" fullWidth>Login</Button>
            </form>
            <Button onClick={() => navigate('/signup')} color="secondary">Don't have an account? Sign up</Button>
        </Box>
    );
};

export default Login;
