import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { signup } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signup(email, password);
            alert("Signup successful! Please login.");
            navigate('/login');
        } catch (err) {
            alert("Signup failed. Try again.");
        }
    };

    return (
        <Box sx={{display:"flex",justifyContent:"center",alignItems:"center",flexDirection:"column",height:"100vh",gap:"3vh"}}>
            <Typography variant="h4">Signup</Typography>
            <form onSubmit={handleSubmit}>
                <TextField sx={{marginTop:"3vh"}} required='required' type='email' label="Email" fullWidth onChange={(e) => setEmail(e.target.value)} />
                <TextField sx={{marginTop:"3vh"}} required='required' label="Password" type="password" fullWidth onChange={(e) => setPassword(e.target.value)} />
                <Button sx={{marginTop:"3vh"}} type="submit" variant="contained" fullWidth color="primary">Sign Up</Button>
            </form>
            <Button onClick={() => navigate('/login')} color="secondary">Already have an account? Login</Button>
        </Box>
    );
};

export default Signup;
