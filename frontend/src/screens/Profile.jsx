import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }
                const response = await axios.get('http://localhost:3000/users/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUser(response.data.user);
            } catch (err) {
                setError('Failed to fetch profile');
                if (err.response?.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login');
                }
            }
        };
        fetchProfile();
    }, [navigate]);

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.get('http://localhost:3000/users/logout', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            localStorage.removeItem('token');
            navigate('/login');
        } catch (err) {
            setError('Failed to logout');
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-white text-lg">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
                        Profile
                    </h1>
                    <p className="mt-2 text-gray-400">Your account information</p>
                </div>

                {/* Profile Card */}
                <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-700/50 p-8">
                    {error && (
                        <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    <div className="space-y-6">
                        {/* Profile Info */}
                        <div className="bg-gray-700/30 rounded-xl p-6 border border-gray-600/50">
                            <div className="flex items-center space-x-4">
                                <div className="flex-shrink-0">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white">
                                        {user.email[0].toUpperCase()}
                                    </div>
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-white">{user.email}</h2>
                                    <p className="text-gray-400">Member since {new Date().toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>

                        {/* Account Details */}
                        <div className="bg-gray-700/30 rounded-xl p-6 border border-gray-600/50">
                            <h3 className="text-lg font-medium text-white mb-4">Account Details</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">Email</span>
                                    <span className="text-white">{user.email}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">Account Type</span>
                                    <span className="text-white">Standard</span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={handleLogout}
                                className="flex-1 py-3 px-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 transform hover:scale-[1.02]"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile; 