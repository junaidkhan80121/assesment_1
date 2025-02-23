import axios from 'axios';

const API_URL = "http://127.0.0.1:5000";

export const login = async (email, password) => {
    const res = await axios.post(`${API_URL}/login`, { email, password });
    return res.data;
};

export const signup = async (email, password) => {
    const res = await axios.post(`${API_URL}/register`, { email, password });
    return res.data;
};

export const fetchEmails = async (token,email,password) => {
    const res = await axios.post(`${API_URL}/emails`, {
        "email": email,
        "password": password
      }, { // Headers as a separate configuration object
        headers: { Authorization: token }
      });
    return res.data;
};
