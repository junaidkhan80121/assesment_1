// import React, { useEffect, useState } from 'react';
// import { fetchEmails, downloadAttachment } from '../services/api';
// import { Card, List, ListItem, ListItemText, Container, Typography, Button, Backdrop, CircularProgress, TextField } from '@mui/material';
// import { useNavigate } from 'react-router-dom';

// const Emails = () => {
//     const [emails, setEmails] = useState([]);
//     const [filteredEmails, setFilteredEmails] = useState([]);
//     const [keyword, setKeyword] = useState('');
//     const [backdrop, setbackdrop] = useState(false);
//     const navigate = useNavigate();

//     useEffect(() => {
//         const token = localStorage.getItem('token');
//         const email = localStorage.getItem('email');
//         const password = localStorage.getItem('password');
        
//         if (!token) {
//             navigate('/login');
//         } else {
//             setbackdrop(true);
//             fetchEmails(token, email, password).then((emails) => {
//                 setEmails(emails);
//                 setFilteredEmails(emails);
//                 setbackdrop(false);
//             }).catch((err) => {
//                 localStorage.removeItem('token');
//                 localStorage.removeItem('email');
//                 localStorage.removeItem('password');
//                 setbackdrop(false);
//                 alert("Error in getting emails.");
//                 navigate('/login');
//             });
//         }
//     }, [navigate]);

//     const handleSearch = (event) => {
//         const keyword = event.target.value.toLowerCase();
//         setKeyword(keyword);
//         const filtered = emails.filter(email => 
//             email.subject.toLowerCase().includes(keyword) || 
//             email.from.toLowerCase().includes(keyword)
//         );
//         setFilteredEmails(filtered);
//     };

//     const handleDownload = (emailId, attachmentName) => {
//         const token = localStorage.getItem('token');
//         downloadAttachment(token, emailId, attachmentName);
//     };

//     return (
//         <>
//         <Container maxWidth="md">
//             <Typography variant="h4">Inbox</Typography>
//             <Button onClick={() => { 
//                 localStorage.removeItem('token');
//                 localStorage.removeItem('email');
//                 localStorage.removeItem('password');
//                 navigate('/login'); 
//             }} color="secondary">Logout</Button>
            
//             <TextField 
//                 label="Search Emails" 
//                 variant="outlined" 
//                 fullWidth 
//                 value={keyword} 
//                 onChange={handleSearch} 
//                 sx={{ marginTop: 2, marginBottom: 2 }}
//             />

//             <List>
//                 {filteredEmails.length > 0 ? filteredEmails.map((email, index) => (
//                     <Card elevation={5} sx={{ marginTop: "2vh", marginBottom: "2vh", padding: "10px" }} key={index}>
//                         <ListItem>
//                             <ListItemText
//                                 primary={`${email.subject} - ${email.from}`}
//                                 secondary={email.date}
//                             />
//                         </ListItem>
//                         {email.attachments && email.attachments.length > 0 && (
//                             <div>
//                                 <Typography variant="subtitle2">Attachments:</Typography>
//                                 {email.attachments.map((attachment, idx) => (
//                                     <Button key={idx} variant="contained" size="small" onClick={() => handleDownload(email.id, attachment)}>
//                                         {attachment}
//                                     </Button>
//                                 ))}
//                             </div>
//                         )}
//                     </Card>
//                 )) : <Typography>No emails found</Typography>}
//             </List>
//         </Container>
//         <Backdrop open={backdrop}>
//             <CircularProgress />&emsp;<br/>
//             <Typography variant='h5' sx={{ color: "green" }}>Fetching Emails. Be patient please.</Typography>
//         </Backdrop>
//         </>
//     );
// };

// export default Emails;


import React, { useEffect, useState } from 'react';
import { fetchEmails } from '../services/api';
import { Card, List, ListItem, ListItemText, Container, Typography, Button, Backdrop, CircularProgress, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Emails = () => {
    const [emails, setEmails] = useState([]);
    const [filteredEmails, setFilteredEmails] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [backdrop, setbackdrop] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const email = localStorage.getItem('email');
        const password = localStorage.getItem('password');
        
        if (!token) {
            navigate('/login');
        } else {
            setbackdrop(true);
            fetchEmails(token, email, password)
                .then((emails) => {
                    setEmails(emails);
                    setFilteredEmails(emails);
                    setbackdrop(false);
                })
                .catch(() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('email');
                    localStorage.removeItem('password');
                    setbackdrop(false);
                    alert("Error in getting emails.");
                    navigate('/login');
                });
        }
    }, [navigate]);

    const handleSearch = (event) => {
        const keyword = event.target.value.toLowerCase();
        setKeyword(keyword);
        const filtered = emails.filter(email => 
            email.subject.toLowerCase().includes(keyword) || 
            email.from.toLowerCase().includes(keyword)
        );
        setFilteredEmails(filtered);
    };

    const handleDownload = async (emailId, attachmentName) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(`http://127.0.0.1:5000/download/${emailId}/${attachmentName}`, {
                headers: { Authorization: token },
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', attachmentName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Error downloading attachment:", error);
            alert("Failed to download attachment.");
        }
    };

    return (
        <>
        <Container maxWidth="md">
            <Typography variant="h4">Inbox</Typography>
            <Button onClick={() => { 
                localStorage.removeItem('token');
                localStorage.removeItem('email');
                localStorage.removeItem('password');
                navigate('/login'); 
            }} color="secondary">Logout</Button>
            
            <TextField 
                label="Search Emails" 
                variant="outlined" 
                fullWidth 
                value={keyword} 
                onChange={handleSearch} 
                sx={{ marginTop: 2, marginBottom: 2 }}
            />

            <List>
                {filteredEmails.length > 0 ? filteredEmails.map((email, index) => (
                    <Card elevation={5} sx={{ marginTop: "2vh", marginBottom: "2vh", padding: "10px" }} key={index}>
                        <ListItem>
                            <ListItemText
                                primary={`${email.subject} - ${email.from}`}
                                secondary={email.date}
                            />
                        </ListItem>
                        {email.attachments && email.attachments.length > 0 && (
                            <div>
                                <Typography variant="subtitle2">Attachments:</Typography>
                                {email.attachments.map((attachment, idx) => (
                                    <Button key={idx} variant="contained" size="small" onClick={() => handleDownload(email.id, attachment)}>
                                        {attachment}
                                    </Button>
                                ))}
                            </div>
                        )}
                    </Card>
                )) : <Typography>No emails found</Typography>}
            </List>
        </Container>
        <Backdrop open={backdrop}>
            <CircularProgress />&emsp;<br/>
            <Typography variant='h5' sx={{ color: "green" }}>Fetching Emails. Be patient please.</Typography>
        </Backdrop>
        </>
    );
};

export default Emails;
