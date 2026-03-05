import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';       // your homepage component
import Homepage from './pages/Homepage'; 
//const isLoggedIn = false; // change this later based on auth

function App() {
  return (
   <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/Homepage" element={<Homepage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
