import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './screens/Login';
import Register from './screens/Register';
import Profile from './screens/Profile';
import './App.css'
import AppRoutes from './routes/AppRoutes'
import Home from './screens/Home';
import { UserProvider } from './context/user.context';

const App = () => {
  return (
    // <Router>
    //   <Routes>
    //     <Route path="/login" element={<Login />} />
    //     <Route path="/register" element={<Register />} />
    //     <Route path="/profile" element={<Profile />} />
    //     <Route path="/" element={<Home />} />
    //   </Routes>
    // </Router>
    <UserProvider>
      <AppRoutes />
    </UserProvider>
  );
};

export default App
