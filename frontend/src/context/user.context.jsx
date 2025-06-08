import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../config/Axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch user profile if token exists
    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setUser(null);
                setLoading(false);
                return;
            }
            try {
                const res = await axios.get('/users/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(res.data.user);
            } catch (err) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    // Login method
    const login = async (email, password) => {
        const res = await axios.post('/users/login', { email, password });
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        return res;
    };

    // Logout method
    const logout = async () => {
        const token = localStorage.getItem('token');
        await axios.get('/users/logout', {
            headers: { Authorization: `Bearer ${token}` }
        });
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, setUser, login, logout, loading }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
