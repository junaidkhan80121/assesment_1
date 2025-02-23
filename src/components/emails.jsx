import React, { useEffect, useState } from 'react';
import { fetchEmails } from '../services/api';
import { List, ListItem, ListItemText, Container, Typography, Button, Backdrop, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Emails = () => {
    const [emails, setEmails] = useState([]);
    const [backdrop, setbackdrop] = useState(false)
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const email = localStorage.getItem('email');
        const password = localStorage.getItem('password');
        if (!token) {
            navigate('/login');
        } else {
            setbackdrop(true)
            fetchEmails(token,email,password).then((emails)=>{setEmails(emails);setbackdrop(false)}).catch(() => {
                localStorage.removeItem('token');
                localStorage.removeItem('email');
                localStorage.removeItem('password');
                setbackdrop(false);
                alert("Session expired. Please login again.");
                setbackdrop(false);
                navigate('/login');
            });
        }
    }, [navigate]);

    return (
        <>
        <Container maxWidth="md">
            <Typography variant="h4">Inbox</Typography>
            <Button onClick={() => { localStorage.removeItem('token');localStorage.removeItem("email");localStorage.removeItem("password");; navigate('/login'); }} color="secondary">Logout</Button>
            <List>
                {emails.length > 0 ? emails.map((email, index) => (
                    <ListItem key={index}>
                        <ListItemText
                            primary={`${email.subject} - ${email.from}`}
                            secondary={email.date}
                        />
                    </ListItem>
                )) : <Typography>No emails found</Typography>}
            </List>
        </Container>
        <Backdrop open={backdrop}>
            <CircularProgress/>&emsp;<br/>
            <Typography variant='h5' sx={{color:"green"}}>Fetching Emails. Be patient please.</Typography>
        </Backdrop>
        </>

    );
};

export default Emails;
