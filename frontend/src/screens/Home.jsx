import React from 'react';
import { useUser } from '../context/user.context';

const Home = () => {
    const { user } = useUser();
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white text-2xl font-semibold">
            {user ? (
                <span>Welcome, {user.email}!</span>
            ) : (
                <span>Welcome to the Home Page</span>
            )}
        </div>
    );
};

export default Home;