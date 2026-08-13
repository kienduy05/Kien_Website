import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load user from localStorage on initial mount
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse user from local storage");
            }
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            const response = await api.post('/access/login', { username, password });
            const { metadata } = response.data;
            const { user, tokens } = metadata;

            // Save to localStorage
            localStorage.setItem('accessToken', tokens.accessToken);
            localStorage.setItem('clientId', user.id.toString());
            localStorage.setItem('user', JSON.stringify(user));
            
            setUser(user);
            return true;
        } catch (error) {
            console.error('Login failed:', error.response?.data?.message || error.message);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await api.post('/access/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('clientId');
            localStorage.removeItem('user');
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
